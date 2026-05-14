import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

// ─── Cliente reserva turno con profesional ───────────────────
export class CreateAppointmentDto {
  @ApiProperty({ example: 'uuid-del-profesional' })
  @IsUUID()
  professionalId: string;

  @ApiProperty({ example: 'uuid-del-servicio' })
  @IsUUID()
  serviceId: string;

  @ApiProperty({ example: '2026-05-20T10:00:00' })
  @IsDateString()
  startDatetime: string;

  @ApiPropertyOptional({ description: 'Si el profesional atiende en un espacio reservado' })
  @IsOptional()
  @IsUUID()
  spaceBookingId?: string;
}

// ─── Profesional solicita espacio al propietario ─────────────
export class CreateSpaceBookingDto {
  @ApiProperty({ example: 'uuid-del-espacio' })
  @IsUUID()
  spaceId: string;

  @ApiProperty({ example: '2026-05-20T10:00:00' })
  @IsDateString()
  startDatetime: string;

  @ApiProperty({ example: '2026-05-20T14:00:00' })
  @IsDateString()
  endDatetime: string;
}

// ─── Propietario responde a solicitud ────────────────────────
export class RespondSpaceBookingDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED'] })
  @IsString()
  decision: 'APPROVED' | 'REJECTED';

  @ApiPropertyOptional({ example: 'El horario ya está ocupado' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

// ─── Triangulación: disponibilidad cruzada ───────────────────
export class CheckAvailabilityDto {
  @ApiProperty({ example: 'uuid-del-profesional' })
  @IsUUID()
  professionalId: string;

  @ApiProperty({ example: 'uuid-del-servicio' })
  @IsUUID()
  serviceId: string;

  @ApiProperty({ example: '2026-05-20' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ description: 'Si se requiere espacio físico' })
  @IsOptional()
  @IsUUID()
  spaceId?: string;
}
