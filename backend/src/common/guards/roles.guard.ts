import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthUser } from '../../auth/strategies/jwt.strategy';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;

    const { user }: { user: AuthUser } = context.switchToHttp().getRequest();

    // Verificar que el rol activo del usuario está entre los requeridos
    if (!user?.activeRole || !required.includes(user.activeRole)) {
      throw new ForbiddenException(
        `Acceso restringido. Rol activo requerido: ${required.join(' | ')}`,
      );
    }
    return true;
  }
}
