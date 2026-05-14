import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, phone: true, role: true, status: true,
        avatarUrl: true, createdAt: true,
        clientProfile: true,
        professionalProfile: {
          include: { category: true, services: { where: { isActive: true } } },
        },
        ownerProfile: { include: { spaces: { where: { status: 'ACTIVE' } } } },
      },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async getPublicProfile(slug: string) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { publicSlug: slug, isVisible: true, validationStatus: 'APPROVED' },
      include: {
        category: true,
        services: { where: { isActive: true }, orderBy: { isPopular: 'desc' } },
        reviews: {
          where: { isPublic: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { client: { select: { firstName: true, lastName: true } } },
        },
      },
    });
    if (!profile) throw new NotFoundException('Profesional no encontrado');
    return profile;
  }

  async searchProfessionals(params: {
    category?: string;
    query?: string;
    city?: string;
    page?: number;
    limit?: number;
  }) {
    const { category, query, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    return this.prisma.professionalProfile.findMany({
      where: {
        isVisible: true,
        validationStatus: 'APPROVED',
        ...(category && { category: { slug: category } }),
        ...(query && {
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName:  { contains: query, mode: 'insensitive' } },
            { specialty: { contains: query, mode: 'insensitive' } },
          ],
        }),
      },
      include: { category: true },
      orderBy: [{ averageRating: 'desc' }, { totalReviews: 'desc' }],
      skip,
      take: limit,
    });
  }
}
