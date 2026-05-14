import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAppointmentDto,
  CreateSpaceBookingDto,
  RespondSpaceBookingDto,
  CheckAvailabilityDto,
} from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // ═══════════════════════════════════════════════════════
  //  TRIANGULACIÓN DE AGENDAS (RF-4.1)
  //  Cruza: agenda cliente + agenda profesional + espacio
  // ═══════════════════════════════════════════════════════

  async checkAvailability(dto: CheckAvailabilityDto): Promise<string[]> {
    const { professionalId, serviceId, date, spaceId } = dto;

    const service = await this.prisma.professionalService.findFirst({
      where: { id: serviceId, professionalId, isActive: true },
    });
    if (!service) throw new NotFoundException('Servicio no encontrado');

    const d = new Date(date);
    const dayOfWeek = d.getDay();
    const durationMin = service.durationMin;

    // 1. Horario del profesional ese día
    const proAvail = await this.prisma.professionalAvailability.findFirst({
      where: { professionalId, dayOfWeek, isAvailable: true },
    });
    if (!proAvail) return [];

    // 2. Turnos ya reservados del profesional ese día
    const proAppts = await this.prisma.appointment.findMany({
      where: {
        professionalId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        startDatetime: { gte: new Date(`${date}T00:00:00`), lt: new Date(`${date}T23:59:59`) },
      },
    });

    // 3. Si se pidió un espacio, checar su disponibilidad también
    let spaceOccupied: { startDatetime: Date; endDatetime: Date }[] = [];
    let spaceOpen = proAvail.startTime;
    let spaceClose = proAvail.endTime;

    if (spaceId) {
      const space = await this.prisma.space.findUnique({
        where: { id: spaceId, status: 'ACTIVE' },
        include: {
          availability: { where: { dayOfWeek } },
          exceptions: { where: { exceptionDate: d } },
        },
      });
      if (!space) throw new NotFoundException('Espacio no encontrado');

      const exception = space.exceptions[0];
      if (exception && !exception.isAvailable) return [];

      const spaceSlot = exception
        ? { openTime: exception.openTime!, closeTime: exception.closeTime! }
        : space.availability[0];

      if (!spaceSlot) return [];

      spaceOpen = spaceSlot.openTime;
      spaceClose = spaceSlot.closeTime;

      spaceOccupied = await this.prisma.spaceBooking.findMany({
        where: {
          spaceId,
          status: { in: ['PENDING', 'APPROVED'] },
          startDatetime: { gte: new Date(`${date}T00:00:00`), lt: new Date(`${date}T23:59:59`) },
        },
      });
    }

    // 4. Intersección de ventanas horarias
    const windowOpen  = this.maxTime(proAvail.startTime, spaceOpen);
    const windowClose = this.minTime(proAvail.endTime, spaceClose);
    if (this.toMin(windowOpen) >= this.toMin(windowClose)) return [];

    // 5. Generar slots libres (granularidad 30 min)
    const allOccupied = [...proAppts, ...spaceOccupied];
    return this.buildSlots(windowOpen, windowClose, durationMin, allOccupied);
  }

  // ═══════════════════════════════════════════════════════
  //  TURNOS (Cliente → Profesional)
  // ═══════════════════════════════════════════════════════

  async createAppointment(clientUserId: string, dto: CreateAppointmentDto) {
    const client = await this.prisma.clientProfile.findUnique({ where: { userId: clientUserId } });
    if (!client) throw new ForbiddenException('Solo los clientes pueden reservar turnos');

    const service = await this.prisma.professionalService.findFirst({
      where: { id: dto.serviceId, professionalId: dto.professionalId, isActive: true },
      include: { professional: { include: { user: true } } },
    });
    if (!service) throw new NotFoundException('Servicio no encontrado');

    const startDt = new Date(dto.startDatetime);
    const endDt = new Date(startDt.getTime() + service.durationMin * 60_000);

    // Verificar que el slot esté libre
    const conflict = await this.prisma.appointment.findFirst({
      where: {
        professionalId: dto.professionalId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        startDatetime: { lt: endDt },
        endDatetime:   { gt: startDt },
      },
    });
    if (conflict) throw new ConflictException('El horario ya no está disponible');

    return this.prisma.appointment.create({
      data: {
        clientId:               client.id,
        professionalId:         dto.professionalId,
        serviceId:              dto.serviceId,
        spaceBookingId:         dto.spaceBookingId,
        startDatetime:          startDt,
        endDatetime:            endDt,
        serviceNameSnapshot:    service.name,
        serviceDurationSnapshot: service.durationMin,
        servicePriceSnapshot:   service.price,
        addressSnapshot:        service.professional.user.phone ?? null,
        status:                 'PENDING',
        qrCode:                 `TH-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      },
      include: { service: true, professional: { include: { user: { select: { email: true } } } } },
    });
  }

  async getMyAppointments(clientUserId: string) {
    const client = await this.prisma.clientProfile.findUnique({ where: { userId: clientUserId } });
    if (!client) throw new ForbiddenException('Sin perfil de cliente');

    return this.prisma.appointment.findMany({
      where: { clientId: client.id },
      include: {
        service: true,
        professional: { select: { firstName: true, lastName: true, specialty: true, publicSlug: true } },
        spaceBooking: { include: { space: { select: { name: true } } } },
        review: true,
      },
      orderBy: { startDatetime: 'desc' },
    });
  }

  async cancelAppointment(appointmentId: string, userId: string, reason?: string) {
    const appt = await this.prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appt) throw new NotFoundException('Turno no encontrado');
    if (!['PENDING', 'CONFIRMED'].includes(appt.status)) {
      throw new BadRequestException('El turno no puede cancelarse en su estado actual');
    }

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'CANCELLED',
        cancelledById: userId,
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    });
  }

  // ═══════════════════════════════════════════════════════
  //  RESERVAS DE ESPACIO (Profesional → Propietario)
  // ═══════════════════════════════════════════════════════

  async requestSpace(proUserId: string, dto: CreateSpaceBookingDto) {
    const pro = await this.prisma.professionalProfile.findUnique({ where: { userId: proUserId } });
    if (!pro) throw new ForbiddenException('Solo los profesionales pueden solicitar espacios');

    const space = await this.prisma.space.findUnique({
      where: { id: dto.spaceId, status: 'ACTIVE' },
      include: { owner: true },
    });
    if (!space) throw new NotFoundException('Espacio no disponible');

    const startDt = new Date(dto.startDatetime);
    const endDt   = new Date(dto.endDatetime);
    const hours   = (endDt.getTime() - startDt.getTime()) / 3_600_000;

    if (hours <= 0) throw new BadRequestException('El horario de fin debe ser posterior al inicio');

    const conflict = await this.prisma.spaceBooking.findFirst({
      where: {
        spaceId: dto.spaceId,
        status: { in: ['PENDING', 'APPROVED'] },
        startDatetime: { lt: endDt },
        endDatetime:   { gt: startDt },
      },
    });
    if (conflict) throw new ConflictException('El espacio ya está ocupado en ese horario');

    const pricePerHour = Number(space.basePriceHour);
    const totalAmount  = parseFloat((hours * pricePerHour).toFixed(2));

    const booking = await this.prisma.spaceBooking.create({
      data: {
        spaceId:       space.id,
        professionalId: pro.id,
        ownerId:       space.owner.id,
        startDatetime: startDt,
        endDatetime:   endDt,
        totalHours:    hours,
        pricePerHour,
        totalAmount,
        autoApproved:  space.owner.autoApprove,
        status:        space.owner.autoApprove ? 'APPROVED' : 'PENDING',
      },
    });
    return booking;
  }

  async respondToSpaceRequest(
    bookingId: string,
    ownerUserId: string,
    dto: RespondSpaceBookingDto,
  ) {
    const booking = await this.prisma.spaceBooking.findUnique({
      where: { id: bookingId },
      include: { owner: true },
    });
    if (!booking) throw new NotFoundException('Solicitud no encontrada');
    if (booking.owner.userId !== ownerUserId) throw new ForbiddenException('No te pertenece esta solicitud');
    if (booking.status !== 'PENDING') throw new BadRequestException('La solicitud ya fue respondida');

    return this.prisma.spaceBooking.update({
      where: { id: bookingId },
      data: {
        status:          dto.decision,
        rejectionReason: dto.rejectionReason,
        respondedAt:     new Date(),
      },
    });
  }

  async getOwnerRequests(ownerUserId: string) {
    const owner = await this.prisma.ownerProfile.findUnique({ where: { userId: ownerUserId } });
    if (!owner) throw new ForbiddenException('Sin perfil de propietario');

    return this.prisma.spaceBooking.findMany({
      where: { ownerId: owner.id },
      include: {
        space: { select: { name: true } },
        professional: { select: { firstName: true, lastName: true, validationStatus: true } },
      },
      orderBy: { requestedAt: 'desc' },
    });
  }

  // ─── Helpers ──────────────────────────────────────────

  private buildSlots(
    open: string,
    close: string,
    durationMin: number,
    occupied: { startDatetime: Date; endDatetime: Date }[],
  ): string[] {
    const slots: string[] = [];
    let cursor = this.toMin(open);
    const end  = this.toMin(close);

    while (cursor + durationMin <= end) {
      const slotEnd = cursor + durationMin;
      const busy = occupied.some((b) => {
        const bs = b.startDatetime.getHours() * 60 + b.startDatetime.getMinutes();
        const be = b.endDatetime.getHours() * 60 + b.endDatetime.getMinutes();
        return cursor < be && slotEnd > bs;
      });
      if (!busy) {
        slots.push(`${String(Math.floor(cursor / 60)).padStart(2, '0')}:${String(cursor % 60).padStart(2, '0')}`);
      }
      cursor += 30;
    }
    return slots;
  }

  private toMin(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  private maxTime(a: string, b: string) { return this.toMin(a) >= this.toMin(b) ? a : b; }
  private minTime(a: string, b: string) { return this.toMin(a) <= this.toMin(b) ? a : b; }
}
