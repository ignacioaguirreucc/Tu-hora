import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { BookingsService } from './bookings.service';
import {
  CreateAppointmentDto,
  CreateSpaceBookingDto,
  RespondSpaceBookingDto,
  CheckAvailabilityDto,
} from './dto/create-booking.dto';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  // ─── Triangulación (público, lo usan todos para ver slots) ──

  @Public()
  @Get('availability')
  @ApiOperation({ summary: '⭐ Slots libres triangulados: profesional + espacio + fecha' })
  checkAvailability(@Query() dto: CheckAvailabilityDto) {
    return this.bookingsService.checkAvailability(dto);
  }

  // ─── Cliente ─────────────────────────────────────────────

  @Post('appointments')
  @Roles('CLIENT')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[CLIENT] Reservar turno con un profesional' })
  book(@CurrentUser() user: any, @Body() dto: CreateAppointmentDto) {
    return this.bookingsService.createAppointment(user.id, dto);
  }

  @Get('appointments/me')
  @Roles('CLIENT')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[CLIENT] Mis turnos (Appointments.tsx)' })
  myAppointments(@CurrentUser() user: any) {
    return this.bookingsService.getMyAppointments(user.id);
  }

  @Patch('appointments/:id/cancel')
  @Roles('CLIENT', 'PROFESSIONAL', 'OWNER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar un turno' })
  cancel(@Param('id') id: string, @CurrentUser() user: any, @Body('reason') reason?: string) {
    return this.bookingsService.cancelAppointment(id, user.id, reason);
  }

  // ─── Profesional ─────────────────────────────────────────

  @Post('space-requests')
  @Roles('PROFESSIONAL')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[PROFESSIONAL] Solicitar un espacio al propietario (ProSpacesSearch)' })
  requestSpace(@CurrentUser() user: any, @Body() dto: CreateSpaceBookingDto) {
    return this.bookingsService.requestSpace(user.id, dto);
  }

  // ─── Propietario ─────────────────────────────────────────

  @Get('space-requests/owner')
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[OWNER] Ver todas las solicitudes de espacio (OwnerRequests.tsx)' })
  ownerRequests(@CurrentUser() user: any) {
    return this.bookingsService.getOwnerRequests(user.id);
  }

  @Patch('space-requests/:id/respond')
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[OWNER] Aprobar o rechazar una solicitud' })
  respond(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: RespondSpaceBookingDto,
  ) {
    return this.bookingsService.respondToSpaceRequest(id, user.id, dto);
  }
}
