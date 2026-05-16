import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

// ─── Payload firmado dentro del JWT ───────────────────────
export interface JwtPayload {
  sub: string;          // userId
  email: string;
  roles: UserRole[];    // lista de roles APROBADOS al momento del login
  activeRole: UserRole; // rol activo actual en la UI
}

// ─── Objeto adjuntado a request.user por Passport ─────────
export interface AuthUser {
  id: string;
  email: string;
  roles: UserRole[];
  activeRole: UserRole;
  status: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, status: true, activeRole: true, deletedAt: true },
    });

    if (!user || user.deletedAt || user.status === 'BANNED' || user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Sesión inválida');
    }

    // Retornamos el payload del JWT directamente (no re-consultamos roles en cada request)
    // para evitar un query extra. Los roles se actualizan al hacer login / switch-role.
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
      activeRole: payload.activeRole,
      status: user.status,
    };
  }
}
