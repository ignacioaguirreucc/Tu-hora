import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** Extrae el usuario autenticado de la request (puesto por JwtStrategy.validate) */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
);
