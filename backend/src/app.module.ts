import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SpacesModule } from './spaces/spaces.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    // ─── Config global (lee .env) ──────────────────────────
    ConfigModule.forRoot({ isGlobal: true }),

    // ─── Rate limiting básico ──────────────────────────────
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),

    // ─── Infraestructura ───────────────────────────────────
    PrismaModule,

    // ─── Módulos de dominio ────────────────────────────────
    AuthModule,
    UsersModule,
    SpacesModule,
    BookingsModule,
  ],
})
export class AppModule {}
