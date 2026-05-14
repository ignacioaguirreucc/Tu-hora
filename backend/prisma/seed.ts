import { PrismaClient, UserRole, SpaceType, SpaceStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding TuHora...');

  // ─── Categorías ─────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'barberia' },
      update: {},
      create: { name: 'Barbería', slug: 'barberia', colorHex: '#4F46E5', sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: 'estetica' },
      update: {},
      create: { name: 'Estética', slug: 'estetica', colorHex: '#8B5CF6', sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: 'odontologia' },
      update: {},
      create: { name: 'Odontología', slug: 'odontologia', colorHex: '#059669', sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: 'bienestar' },
      update: {},
      create: { name: 'Bienestar', slug: 'bienestar', colorHex: '#F59E0B', sortOrder: 4 },
    }),
  ]);

  console.log(`✅ ${categories.length} categorías creadas`);

  const hash = await bcrypt.hash('TuHora123!', 12);

  // ─── Usuario Propietario ─────────────────────────────────
  const ownerUser = await prisma.user.upsert({
    where: { email: 'owner@tuhora.app' },
    update: {},
    create: {
      email: 'owner@tuhora.app',
      passwordHash: hash,
      phone: '+5491123456780',
      role: 'OWNER',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      termsAcceptedAt: new Date(),
      ownerProfile: {
        create: {
          businessName: 'Barbería Centro',
          address: 'Av. Corrientes 1234',
          city: 'Buenos Aires',
          province: 'CABA',
          autoApprove: false,
          spaces: {
            create: [
              {
                name: 'Sillón 1',
                spaceType: 'CHAIR' as SpaceType,
                categoryId: categories[0].id,
                basePriceHour: 1500,
                status: 'ACTIVE' as SpaceStatus,
                description: 'Sillón principal con buena luz natural',
                amenities: {
                  create: [{ name: 'Sillón' }, { name: 'Espejos' }, { name: 'Secador' }],
                },
                availability: {
                  create: [
                    { dayOfWeek: 1, openTime: '09:00', closeTime: '20:00' },
                    { dayOfWeek: 2, openTime: '09:00', closeTime: '20:00' },
                    { dayOfWeek: 3, openTime: '09:00', closeTime: '20:00' },
                    { dayOfWeek: 4, openTime: '09:00', closeTime: '20:00' },
                    { dayOfWeek: 5, openTime: '09:00', closeTime: '20:00' },
                    { dayOfWeek: 6, openTime: '10:00', closeTime: '18:00' },
                  ],
                },
              },
              {
                name: 'Sillón 2',
                spaceType: 'CHAIR' as SpaceType,
                categoryId: categories[0].id,
                basePriceHour: 1500,
                status: 'ACTIVE' as SpaceStatus,
                description: 'Sillón secundario',
                availability: {
                  create: [
                    { dayOfWeek: 1, openTime: '09:00', closeTime: '20:00' },
                    { dayOfWeek: 2, openTime: '09:00', closeTime: '20:00' },
                    { dayOfWeek: 3, openTime: '09:00', closeTime: '20:00' },
                    { dayOfWeek: 4, openTime: '09:00', closeTime: '20:00' },
                    { dayOfWeek: 5, openTime: '09:00', closeTime: '20:00' },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  });

  // ─── Usuario Profesional ─────────────────────────────────
  const proUser = await prisma.user.upsert({
    where: { email: 'pro@tuhora.app' },
    update: {},
    create: {
      email: 'pro@tuhora.app',
      passwordHash: hash,
      phone: '+5491123456781',
      role: 'PROFESSIONAL',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      termsAcceptedAt: new Date(),
      professionalProfile: {
        create: {
          firstName: 'Lucas',
          lastName: 'Rivera',
          specialty: 'Barbero',
          categoryId: categories[0].id,
          publicSlug: 'lucas-rivera',
          isVisible: true,
          validationStatus: 'APPROVED',
          validatedAt: new Date(),
          commissionRate: 15,
          averageRating: 4.9,
          totalReviews: 127,
          totalCompleted: 284,
          services: {
            create: [
              { name: 'Corte clásico',  durationMin: 30, price: 4500, categoryId: categories[0].id },
              { name: 'Corte + Barba',  durationMin: 45, price: 6500, categoryId: categories[0].id, isPopular: true },
              { name: 'Solo barba',     durationMin: 20, price: 3000, categoryId: categories[0].id },
              { name: 'Diseño de fade', durationMin: 40, price: 5500, categoryId: categories[0].id },
            ],
          },
          availability: {
            create: [
              { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
              { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
              { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' },
              { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' },
              { dayOfWeek: 5, startTime: '09:00', endTime: '18:00' },
              { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' },
            ],
          },
        },
      },
    },
  });

  // ─── Usuario Cliente ─────────────────────────────────────
  const clientUser = await prisma.user.upsert({
    where: { email: 'client@tuhora.app' },
    update: {},
    create: {
      email: 'client@tuhora.app',
      passwordHash: hash,
      phone: '+5491123456782',
      role: 'CLIENT',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      termsAcceptedAt: new Date(),
      clientProfile: {
        create: {
          firstName: 'Martín',
          lastName: 'García',
          pointsBalance: 340,
          currentLevel: 'PLATA',
        },
      },
    },
  });

  console.log(`✅ Usuarios de prueba creados:
  👤 Owner:     owner@tuhora.app   / TuHora123!
  💼 Pro:       pro@tuhora.app     / TuHora123!
  📱 Cliente:   client@tuhora.app  / TuHora123!`);

  console.log('✅ Seed completado');
}

main()
  .catch((e) => { console.error('❌ Seed falló:', e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
