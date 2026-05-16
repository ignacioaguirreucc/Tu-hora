import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto, RefreshTokenDto } from './dto/login.dto';
import { SwitchRoleDto } from './dto/switch-role.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthUser } from './strategies/jwt.strategy';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  // ─── Registro ──────────────────────────────────────────────
  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description:
      'Crea cuenta con rol CLIENT aprobado automáticamente. ' +
      'Para ser PRO u OWNER, usar POST /roles/request luego del registro.',
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // ─── Login ─────────────────────────────────────────────────
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Retorna accessToken (15m) y refreshToken (7d) con roles[] y activeRole.',
  })
  login(@Body() dto: LoginDto, @Req() req: Request) {
    const ip = req.ip ?? req.socket?.remoteAddress;
    return this.authService.login(dto, ip);
  }

  // ─── Refresh ───────────────────────────────────────────────
  // El endpoint es público porque el access token ya puede estar expirado.
  // El userId se extrae del refresh token dentro del servicio.
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renovar access token',
    description:
      'Recibe el refreshToken y devuelve un par nuevo (access + refresh). ' +
      'El token anterior queda revocado (rotation).',
  })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  // ─── Logout ────────────────────────────────────────────────
  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión (revoca el refresh token actual)' })
  logout(@CurrentUser() user: AuthUser, @Body() dto: RefreshTokenDto) {
    return this.authService.logout(user.id, dto.refreshToken);
  }

  // ─── Switch Role ───────────────────────────────────────────
  @Post('switch-role')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cambiar rol activo',
    description:
      'Cambia el activeRole del usuario. Solo funciona con roles que ya tenga APPROVED. ' +
      'Devuelve un JWT nuevo con el activeRole actualizado.',
  })
  switchRole(@CurrentUser() user: AuthUser, @Body() dto: SwitchRoleDto) {
    return this.authService.switchRole(user.id, dto.role);
  }

  // ─── Me ────────────────────────────────────────────────────
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Perfil del usuario autenticado',
    description:
      'Retorna los datos del usuario junto con sus roleAssignments y perfiles ' +
      '(clientProfile, professionalProfile, ownerProfile).',
  })
  getMe(@CurrentUser() user: AuthUser) {
    return this.authService.getMe(user.id);
  }
}
