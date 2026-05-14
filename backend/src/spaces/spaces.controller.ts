import {
  Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { SpacesService } from './spaces.service';
import { CreateSpaceDto, UpdateSpaceDto, SpaceAvailabilityDto } from './dto/create-space.dto';

@ApiTags('spaces')
@Controller('spaces')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SpacesController {
  constructor(private spacesService: SpacesService) {}

  // ─── Endpoints del Propietario ──────────────────────────

  @Post()
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[OWNER] Crear un nuevo espacio' })
  create(@CurrentUser() user: any, @Body() dto: CreateSpaceDto) {
    return this.spacesService.create(user.id, dto);
  }

  @Get('my')
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[OWNER] Mis espacios con disponibilidad y métricas' })
  mySpaces(@CurrentUser() user: any) {
    return this.spacesService.findByOwner(user.id);
  }

  @Patch(':id')
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[OWNER] Actualizar un espacio' })
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateSpaceDto) {
    return this.spacesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[OWNER] Desactivar un espacio' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.spacesService.remove(id, user.id);
  }

  @Put(':id/availability')
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[OWNER] Configurar horarios del espacio' })
  setAvailability(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() slots: SpaceAvailabilityDto[],
  ) {
    return this.spacesService.setAvailability(id, user.id, slots);
  }

  // ─── Endpoints Públicos / Profesional ─────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Buscar espacios disponibles (ProSpacesSearch)' })
  findAvailable(@Query() params: any) {
    return this.spacesService.findAvailable(params);
  }

  @Public()
  @Get(':id/slots')
  @ApiOperation({ summary: 'Slots libres de un espacio para una fecha y duración dada' })
  slots(
    @Param('id') id: string,
    @Query('date') date: string,
    @Query('duration') duration: number,
  ) {
    return this.spacesService.getAvailableSlots(id, date, Number(duration) || 60);
  }
}
