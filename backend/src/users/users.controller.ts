import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Perfil del usuario autenticado' })
  me(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Public()
  @Get('professionals')
  @ApiOperation({ summary: 'Listado público de profesionales (búsqueda)' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  search(@Query() params: any) {
    return this.usersService.searchProfessionals(params);
  }

  @Public()
  @Get('professionals/:slug')
  @ApiOperation({ summary: 'Perfil público de un profesional por slug' })
  publicProfile(@Param('slug') slug: string) {
    return this.usersService.getPublicProfile(slug);
  }
}
