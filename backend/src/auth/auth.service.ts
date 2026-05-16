import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

const BCRYPT_ROUNDS = 12;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const REFRESH_TTL_DAYS = 7;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────
  // REGISTRO
  // Crea User → UserRoleAssignment(CLIENT, APPROVED) → ClientProfile
  // El usuario queda ACTIVE y puede usar la app inmediatamente como cliente.
  // ─────────────────────────────────────────────────────────────────────────
  async register(dto: RegisterDto) {
    // 1. Verificar email único
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    // 2. Verificar DNI único (si se proveyó)
    if (dto.dni) {
      const dniExists = await this.prisma.user.findUnique({
        where: { dni: dto.dni },
      });
      if (dniExists) {
        throw new ConflictException('El DNI ya está registrado');
      }
    }

    // 3. Hash de la contraseña
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    // 4. Crear User + UserRoleAssignment(CLIENT) + ClientProfile en una transacción
    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          phone: dto.phone ?? null,
          firstName: dto.firstName,
          lastName: dto.lastName,
          dni: dto.dni ?? null,
          status: 'ACTIVE',                // queda activo inmediatamente
          activeRole: UserRole.CLIENT,      // rol inicial
          termsAcceptedAt: new Date(),
        },
      });

      // Asignar rol CLIENT aprobado automáticamente
      await tx.userRoleAssignment.create({
        data: {
          userId: newUser.id,
          role: UserRole.CLIENT,
          status: 'APPROVED',
          approvedAt: new Date(),
        },
      });

      // Crear ClientProfile vacío
      await tx.clientProfile.create({
        data: {
          userId: newUser.id,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      return newUser;
    });

    // 5. Generar tokens
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      [UserRole.CLIENT],
      UserRole.CLIENT,
    );

    // 6. Guardar sesión
    await this.saveSession(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        activeRole: user.activeRole,
        roles: [UserRole.CLIENT],
      },
      ...tokens,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────────────────────────────────
  async login(dto: LoginDto, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Verificar lockout
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new ForbiddenException(
        `Cuenta bloqueada hasta las ${user.lockedUntil.toLocaleTimeString('es-AR')}`,
      );
    }

    const passwordOk = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordOk) {
      const newAttempts = user.failedLoginAttempts + 1;
      const shouldLock = newAttempts >= MAX_FAILED_ATTEMPTS;
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newAttempts,
          lockedUntil: shouldLock
            ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000)
            : null,
        },
      });
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
      throw new ForbiddenException('Tu cuenta está suspendida. Contactá soporte.');
    }

    // Leer roles aprobados del usuario
    const roleAssignments = await this.prisma.userRoleAssignment.findMany({
      where: { userId: user.id, status: 'APPROVED' },
      select: { role: true },
    });
    const approvedRoles = roleAssignments.map((r) => r.role);

    // Determinar activeRole: usar el guardado o CLIENT como fallback
    const activeRole = user.activeRole ?? UserRole.CLIENT;

    // Resetear intentos fallidos + actualizar lastLogin
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      approvedRoles,
      activeRole,
    );

    // Guardar sesión
    await this.saveSession(user.id, tokens.refreshToken, ipAddress);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        activeRole,
        roles: approvedRoles,
        avatarUrl: user.avatarUrl,
      },
      ...tokens,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // REFRESH TOKEN (rotation)
  // El userId se extrae del refresh token decodificado, no del access token.
  // ─────────────────────────────────────────────────────────────────────────
  async refresh(rawRefreshToken: string) {
    // 1. Decodificar el refresh token para obtener el userId
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(rawRefreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    const userId = payload.sub;

    // 2. Buscar sesiones activas y verificar que el token coincide
    const sessions = await this.prisma.authSession.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
    });

    const matchResult = await Promise.all(
      sessions.map(async (s) => ({
        session: s,
        match: await bcrypt.compare(rawRefreshToken, s.refreshToken),
      })),
    ).then((results) => results.find((r) => r.match));

    if (!matchResult) {
      throw new UnauthorizedException('Refresh token inválido o ya utilizado');
    }

    // 3. Revocar sesión anterior (token rotation)
    await this.prisma.authSession.update({
      where: { id: matchResult.session.id },
      data: { revokedAt: new Date() },
    });

    // 4. Releer roles actuales desde DB (pueden haber cambiado)
    const roleAssignments = await this.prisma.userRoleAssignment.findMany({
      where: { userId, status: 'APPROVED' },
      select: { role: true },
    });
    const approvedRoles = roleAssignments.map((r) => r.role);

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, email: true, activeRole: true, status: true },
    });

    if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
      throw new ForbiddenException('Tu cuenta está suspendida.');
    }

    const activeRole = user.activeRole ?? UserRole.CLIENT;

    // 5. Generar nuevos tokens
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      approvedRoles,
      activeRole,
    );

    // 6. Guardar nueva sesión
    await this.saveSession(user.id, tokens.refreshToken);

    return tokens;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LOGOUT — revoca el refresh token de la sesión actual
  // ─────────────────────────────────────────────────────────────────────────
  async logout(userId: string, rawRefreshToken: string) {
    const sessions = await this.prisma.authSession.findMany({
      where: { userId, revokedAt: null },
    });

    for (const session of sessions) {
      const match = await bcrypt.compare(rawRefreshToken, session.refreshToken);
      if (match) {
        await this.prisma.authSession.update({
          where: { id: session.id },
          data: { revokedAt: new Date() },
        });
        return { message: 'Sesión cerrada correctamente' };
      }
    }

    // Si no encontró el token, igual responde OK (idempotente)
    return { message: 'Sesión cerrada correctamente' };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SWITCH ROLE — cambia el rol activo del usuario
  // Solo puede cambiar a un rol que tenga APPROVED en UserRoleAssignment
  // ─────────────────────────────────────────────────────────────────────────
  async switchRole(userId: string, newRole: UserRole) {
    // 1. Verificar que el user tiene ese rol aprobado
    const assignment = await this.prisma.userRoleAssignment.findUnique({
      where: { userId_role: { userId, role: newRole } },
    });

    if (!assignment || assignment.status !== 'APPROVED') {
      throw new ForbiddenException(
        `No tenés el rol ${newRole} aprobado. Solicitalo primero desde tu perfil.`,
      );
    }

    // 2. Actualizar activeRole en la DB (para persistir entre dispositivos)
    await this.prisma.user.update({
      where: { id: userId },
      data: { activeRole: newRole },
    });

    // 3. Leer todos los roles aprobados
    const roleAssignments = await this.prisma.userRoleAssignment.findMany({
      where: { userId, status: 'APPROVED' },
      select: { role: true },
    });
    const approvedRoles = roleAssignments.map((r) => r.role);

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { email: true },
    });

    // 4. Generar JWT nuevo con el activeRole actualizado
    const tokens = await this.generateTokens(
      userId,
      user.email,
      approvedRoles,
      newRole,
    );

    return {
      activeRole: newRole,
      roles: approvedRoles,
      ...tokens,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET ME — perfil completo del usuario autenticado
  // ─────────────────────────────────────────────────────────────────────────
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        dni: true,
        avatarUrl: true,
        activeRole: true,
        status: true,
        emailVerifiedAt: true,
        createdAt: true,
        roleAssignments: {
          select: {
            role: true,
            status: true,
            approvedAt: true,
          },
        },
        clientProfile: {
          select: {
            id: true,
            pointsBalance: true,
            currentLevel: true,
            totalBookings: true,
          },
        },
        professionalProfile: {
          select: {
            id: true,
            publicSlug: true,
            specialty: true,
            isVerified: true,
            validationStatus: true,
            averageRating: true,
            totalReviews: true,
          },
        },
        ownerProfile: {
          select: {
            id: true,
            businessName: true,
            city: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    return user;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // HELPERS PRIVADOS
  // ─────────────────────────────────────────────────────────────────────────

  private async generateTokens(
    userId: string,
    email: string,
    roles: UserRole[],
    activeRole: UserRole,
  ) {
    const payload: JwtPayload = { sub: userId, email, roles, activeRole };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async saveSession(
    userId: string,
    rawRefreshToken: string,
    ipAddress?: string,
  ) {
    const refreshTokenHash = await bcrypt.hash(rawRefreshToken, 10);
    await this.prisma.authSession.create({
      data: {
        userId,
        refreshToken: refreshTokenHash,
        ipAddress,
        expiresAt: new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000),
      },
    });
  }
}
