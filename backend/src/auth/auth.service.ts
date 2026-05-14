import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

const BCRYPT_ROUNDS = 12;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // ─── Registro ─────────────────────────────────────────────
  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('El email ya está registrado');

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const [firstName, ...rest] = dto.name.trim().split(' ');
    const lastName = rest.join(' ') || '';

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        phone: dto.phone,
        role: dto.role,
        status: 'PENDING',
        termsAcceptedAt: new Date(),
        // Crear el perfil correspondiente al rol
        ...(dto.role === 'CLIENT' && {
          clientProfile: { create: { firstName, lastName } },
        }),
        ...(dto.role === 'PROFESSIONAL' && {
          professionalProfile: {
            create: {
              firstName,
              lastName,
              specialty: 'Sin definir',
              categoryId: await this.getDefaultCategoryId(),
              publicSlug: await this.generateSlug(dto.name),
            },
          },
        }),
        ...(dto.role === 'OWNER' && {
          ownerProfile: {
            create: {
              businessName: dto.name,
              address: 'Pendiente',
              city: 'Buenos Aires',
              province: 'CABA',
            },
          },
        }),
      },
      select: { id: true, email: true, role: true, status: true },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user, ...tokens };
  }

  // ─── Login ────────────────────────────────────────────────
  async login(dto: LoginDto, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Verificar lockout
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new ForbiddenException(
        `Cuenta bloqueada. Intentá de nuevo después de ${user.lockedUntil.toLocaleTimeString('es-AR')}`,
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

    // Reset intentos fallidos
    await this.prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Guardar sesión
    await this.prisma.authSession.create({
      data: {
        userId: user.id,
        refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
        ipAddress,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: { id: user.id, email: user.email, role: user.role, status: user.status },
      ...tokens,
    };
  }

  // ─── Refresh token ────────────────────────────────────────
  async refresh(userId: string, rawRefreshToken: string) {
    const sessions = await this.prisma.authSession.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
    });

    const validSession = await Promise.all(
      sessions.map(async (s) => ({
        session: s,
        match: await bcrypt.compare(rawRefreshToken, s.refreshToken),
      })),
    ).then((results) => results.find((r) => r.match));

    if (!validSession) throw new UnauthorizedException('Refresh token inválido');

    // Revocar la sesión anterior (rotation)
    await this.prisma.authSession.update({
      where: { id: validSession.session.id },
      data: { revokedAt: new Date() },
    });

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Nueva sesión
    await this.prisma.authSession.create({
      data: {
        userId: user.id,
        refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return tokens;
  }

  // ─── Logout ───────────────────────────────────────────────
  async logout(userId: string, rawRefreshToken: string) {
    const sessions = await this.prisma.authSession.findMany({
      where: { userId, revokedAt: null },
    });

    for (const s of sessions) {
      const match = await bcrypt.compare(rawRefreshToken, s.refreshToken);
      if (match) {
        await this.prisma.authSession.update({
          where: { id: s.id },
          data: { revokedAt: new Date() },
        });
        return { message: 'Sesión cerrada' };
      }
    }
    return { message: 'Sesión cerrada' };
  }

  // ─── Helpers ──────────────────────────────────────────────
  private async generateTokens(userId: string, email: string, role: string) {
    const payload: JwtPayload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '15m'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async getDefaultCategoryId(): Promise<string> {
    const cat = await this.prisma.category.findFirst({ where: { isActive: true } });
    if (!cat) throw new NotFoundException('No hay categorías configuradas');
    return cat.id;
  }

  private async generateSlug(name: string): Promise<string> {
    const base = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    let slug = base;
    let n = 1;
    while (await this.prisma.professionalProfile.findUnique({ where: { publicSlug: slug } })) {
      slug = `${base}-${n++}`;
    }
    return slug;
  }
}
