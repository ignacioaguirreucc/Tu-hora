import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpaceDto, UpdateSpaceDto, SpaceAvailabilityDto } from './dto/create-space.dto';

@Injectable()
export class SpacesService {
  constructor(private prisma: PrismaService) {}

  // ─── CRUD del propietario ──────────────────────────────────

  async create(ownerId: string, dto: CreateSpaceDto) {
    const owner = await this.prisma.ownerProfile.findUnique({ where: { userId: ownerId } });
    if (!owner) throw new ForbiddenException('Solo los propietarios pueden crear espacios');

    const { amenities, ...data } = dto;

    return this.prisma.space.create({
      data: {
        ...data,
        basePriceHour: data.basePriceHour,
        ownerId: owner.id,
        amenities: amenities?.length
          ? { create: amenities.map((name) => ({ name })) }
          : undefined,
      },
      include: { amenities: true, photos: true },
    });
  }

  async findByOwner(userId: string) {
    const owner = await this.prisma.ownerProfile.findUnique({ where: { userId } });
    if (!owner) throw new ForbiddenException('No tenés perfil de propietario');

    return this.prisma.space.findMany({
      where: { ownerId: owner.id },
      include: {
        photos: { orderBy: { sortOrder: 'asc' } },
        amenities: true,
        availability: { orderBy: { dayOfWeek: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(spaceId: string, userId: string, dto: UpdateSpaceDto) {
    await this.assertOwns(spaceId, userId);
    const { amenities, ...data } = dto;

    const space = await this.prisma.space.update({
      where: { id: spaceId },
      data: {
        ...data,
        ...(amenities !== undefined && {
          amenities: {
            deleteMany: {},
            create: amenities.map((name) => ({ name })),
          },
        }),
      },
      include: { amenities: true },
    });
    return space;
  }

  async remove(spaceId: string, userId: string) {
    await this.assertOwns(spaceId, userId);
    return this.prisma.space.update({
      where: { id: spaceId },
      data: { status: 'INACTIVE' },
    });
  }

  // ─── Disponibilidad ────────────────────────────────────────

  async setAvailability(spaceId: string, userId: string, slots: SpaceAvailabilityDto[]) {
    await this.assertOwns(spaceId, userId);

    await this.prisma.spaceAvailability.deleteMany({ where: { spaceId } });
    return this.prisma.spaceAvailability.createMany({
      data: slots.map((s) => ({ ...s, spaceId })),
    });
  }

  // ─── Búsqueda pública ──────────────────────────────────────

  async findAvailable(params: { categoryId?: string; date?: string; city?: string }) {
    return this.prisma.space.findMany({
      where: {
        status: 'ACTIVE',
        ...(params.categoryId && { categoryId: params.categoryId }),
      },
      include: {
        photos: { where: { isPrimary: true }, take: 1 },
        amenities: true,
        owner: { select: { businessName: true, city: true, address: true } },
        category: true,
      },
      orderBy: { averageRating: 'desc' },
    });
  }

  // ─── Slots disponibles para una fecha (base del algoritmo) ──
  async getAvailableSlots(spaceId: string, date: string, durationMin: number) {
    const space = await this.prisma.space.findUnique({
      where: { id: spaceId, status: 'ACTIVE' },
      include: { availability: true, exceptions: true },
    });
    if (!space) throw new NotFoundException('Espacio no encontrado');

    const d = new Date(date);
    const dayOfWeek = d.getDay();

    // Verificar excepción
    const exception = space.exceptions.find(
      (e) => e.exceptionDate.toISOString().slice(0, 10) === date,
    );
    if (exception && !exception.isAvailable) return [];

    const avail = exception
      ? { openTime: exception.openTime!, closeTime: exception.closeTime! }
      : space.availability.find((a) => a.dayOfWeek === dayOfWeek);

    if (!avail) return [];

    // Obtener reservas existentes
    const existing = await this.prisma.spaceBooking.findMany({
      where: {
        spaceId,
        status: { in: ['PENDING', 'APPROVED'] },
        startDatetime: {
          gte: new Date(`${date}T00:00:00`),
          lt:  new Date(`${date}T23:59:59`),
        },
      },
    });

    return this.computeSlots(avail.openTime, avail.closeTime, durationMin, existing);
  }

  private computeSlots(
    openTime: string,
    closeTime: string,
    durationMin: number,
    occupied: { startDatetime: Date; endDatetime: Date }[],
  ): string[] {
    const slots: string[] = [];
    const [oh, om] = openTime.split(':').map(Number);
    const [ch, cm] = closeTime.split(':').map(Number);
    let cursor = oh * 60 + om;
    const end = ch * 60 + cm;

    while (cursor + durationMin <= end) {
      const slotEnd = cursor + durationMin;
      const conflicts = occupied.some((b) => {
        const bs = b.startDatetime.getHours() * 60 + b.startDatetime.getMinutes();
        const be = b.endDatetime.getHours() * 60 + b.endDatetime.getMinutes();
        return cursor < be && slotEnd > bs;
      });
      if (!conflicts) {
        const h = String(Math.floor(cursor / 60)).padStart(2, '0');
        const m = String(cursor % 60).padStart(2, '0');
        slots.push(`${h}:${m}`);
      }
      cursor += 30; // granularidad de 30 min
    }
    return slots;
  }

  // ─── Helper ───────────────────────────────────────────────

  private async assertOwns(spaceId: string, userId: string) {
    const owner = await this.prisma.ownerProfile.findUnique({ where: { userId } });
    if (!owner) throw new ForbiddenException('No tenés perfil de propietario');

    const space = await this.prisma.space.findFirst({
      where: { id: spaceId, ownerId: owner.id },
    });
    if (!space) throw new NotFoundException('Espacio no encontrado o no te pertenece');
    return space;
  }
}
