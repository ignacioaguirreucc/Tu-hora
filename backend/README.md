# TuHora — Backend API

NestJS · PostgreSQL · Prisma · JWT

## Inicio rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus valores
```

### 3. Levantar la base de datos
```bash
docker-compose up -d
# Postgres queda en localhost:5432
# PgAdmin en http://localhost:5050 (con --profile tools)
```

### 4. Crear tablas y seed
```bash
npm run db:migrate     # crea tablas en la DB
npm run db:seed        # carga datos de prueba
npm run db:studio      # abre Prisma Studio (visual)
```

### 5. Correr el servidor
```bash
npm run start:dev
```

API disponible en **http://localhost:3000/api/v1**
Swagger docs en **http://localhost:3000/docs**

---

## Usuarios de prueba (después del seed)

| Rol          | Email               | Password     |
|-------------|---------------------|--------------|
| Propietario | owner@tuhora.app    | TuHora123!   |
| Profesional | pro@tuhora.app      | TuHora123!   |
| Cliente     | client@tuhora.app   | TuHora123!   |

---

## Módulos

| Módulo      | Ruta           | Descripción                                |
|------------|----------------|--------------------------------------------|
| `auth`     | `/api/v1/auth` | Register, login, refresh, logout           |
| `users`    | `/api/v1/users` | Perfiles, búsqueda de profesionales       |
| `spaces`   | `/api/v1/spaces` | CRUD de espacios, disponibilidad          |
| `bookings` | `/api/v1/bookings` | Turnos, solicitudes, triangulación      |

---

## Endpoints clave

```
POST   /api/v1/auth/register          Registro (CLIENT | PROFESSIONAL | OWNER)
POST   /api/v1/auth/login             Login → devuelve accessToken + refreshToken
POST   /api/v1/auth/refresh           Renovar access token
POST   /api/v1/auth/logout            Cerrar sesión

GET    /api/v1/users/me               Mi perfil
GET    /api/v1/users/professionals    Buscar profesionales
GET    /api/v1/users/professionals/:slug  Perfil público

GET    /api/v1/spaces                 Buscar espacios disponibles
POST   /api/v1/spaces                 [OWNER] Crear espacio
GET    /api/v1/spaces/my              [OWNER] Mis espacios
PATCH  /api/v1/spaces/:id             [OWNER] Actualizar espacio
PUT    /api/v1/spaces/:id/availability [OWNER] Configurar horarios
GET    /api/v1/spaces/:id/slots       Slots libres (fecha + duración)

⭐ GET  /api/v1/bookings/availability  Triangulación: pro + espacio + fecha → slots
POST   /api/v1/bookings/appointments            [CLIENT]  Reservar turno
GET    /api/v1/bookings/appointments/me         [CLIENT]  Mis turnos
PATCH  /api/v1/bookings/appointments/:id/cancel Cancelar turno

POST   /api/v1/bookings/space-requests          [PRO]    Solicitar espacio
GET    /api/v1/bookings/space-requests/owner    [OWNER]  Ver solicitudes
PATCH  /api/v1/bookings/space-requests/:id/respond [OWNER] Aprobar/rechazar
```

---

## Próximos módulos a implementar

- [ ] `notifications` — push + in-app (Firebase)
- [ ] `payments` — Mercado Pago + split automático
- [ ] `gamification` — puntos, ruleta, premios
- [ ] `analytics` — dashboard del propietario
- [ ] `reviews` — calificaciones post-turno
