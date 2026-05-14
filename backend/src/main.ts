import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // ─── Validación global ───────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // elimina campos no declarados en el DTO
      forbidNonWhitelisted: true,
      transform: true,        // convierte tipos automáticamente
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ─── CORS ────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // ─── Prefijo global de API ───────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ─── Swagger ─────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('TuHora API')
    .setDescription(
      `Red Inteligente de Espacios Flexibles

**Roles disponibles:** CLIENT · PROFESSIONAL · OWNER · ADMIN

**Auth:** Bearer JWT — obtenelo en POST /api/v1/auth/login`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Registro, login, tokens')
    .addTag('users', 'Perfiles de usuarios')
    .addTag('spaces', 'Espacios físicos (CRUD del propietario)')
    .addTag('bookings', 'Reservas de espacio y turnos de clientes')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // ─── Arranque ────────────────────────────────────────────
  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 TuHora API corriendo en http://localhost:${port}/api/v1`);
  logger.log(`📖 Swagger docs en    http://localhost:${port}/docs`);
}

bootstrap();
