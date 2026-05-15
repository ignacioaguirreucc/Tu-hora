# TuHora — Plan de MVP (objetivo: 60% para Agosto 2026)

> Hoy es **15 de mayo de 2026**. Quedan **~13 semanas** hasta agosto. Este plan asume un equipo de **2-3 personas** trabajando 20-30 hs/semana cada uno.

---

## 1. Qué es el MVP (Scope realista)

El MVP **NO** es la app completa con todas las features. Es **el flujo crítico funcionando end-to-end**:

> Un cliente abre la app → se registra → busca un barbero → reserva un turno → el barbero lo ve en su agenda → cliente va y se atiende → puede dejar review.

Si ese flujo funciona, tenés un MVP. Lo demás es accesorio.

### 1.1. IN (lo que SÍ va en el MVP)

| Categoría | Feature | Por qué es crítico |
|---|---|---|
| **Auth** | Signup + Login (email/password) | Sin esto no hay app |
| **Auth** | Multi-rol básico (cliente + 1 más) | Es la diferenciación del negocio |
| **Cliente** | Ver lista de pros con filtro por categoría | Discovery |
| **Cliente** | Ver perfil del pro + servicios + disponibilidad | Decisión de reserva |
| **Cliente** | Reservar turno (1 servicio, día/hora) | Core action |
| **Cliente** | Ver mis turnos próximos | Recordatorio |
| **Cliente** | Cancelar turno | UX básica |
| **Pro** | Onboarding (KYC simple, auto-aprobado) | Para tener pros en la app |
| **Pro** | Cargar servicios (nombre, precio, duración) | Sin esto no hay nada que reservar |
| **Pro** | Cargar horarios disponibles | Sin esto no hay slots |
| **Pro** | Ver agenda de turnos | Operación diaria |
| **Pro** | Marcar turno como completado / no-show | Cierre del flujo |
| **Owner** | Onboarding básico | Tercer pilar del negocio |
| **Owner** | Crear venues + spaces | Inventario |
| **Owner** | Recibir requests de pros | Conectar pros con espacios |
| **Reviews** | Cliente deja review post-turno | Confianza |
| **Notificaciones** | In-app + push básico (confirmación de turno) | Engagement mínimo |

### 1.2. OUT (NO va en el MVP, se hace después)

| Feature | Cuándo |
|---|---|
| Pagos integrados (Mercado Pago) | Post-MVP — al principio pago en efectivo en el local |
| Sistema de puntos + ruleta | Post-MVP — gamificación no es crítica al inicio |
| Promociones / cupones | Post-MVP |
| Analytics avanzado para owner | Post-MVP (un dashboard simple sí, gráficos no) |
| Reschedule de turnos | Post-MVP (por ahora cancelar + crear nuevo) |
| Multi-servicio en un turno | Post-MVP (por ahora 1 servicio = 1 turno) |
| Búsqueda por geolocalización | Post-MVP (por ahora filtro por categoría) |
| Chat cliente ↔ pro | Post-MVP |
| Login con Google/Apple | Post-MVP (email/password primero) |
| KYC con servicio tercero (Truora/Veriff) | Post-MVP (por ahora auto-approve) |
| Penalizaciones por no-show | Post-MVP |
| Sistema de niveles del cliente (Star/Pro/Elite) | Post-MVP |
| Favoritos | Post-MVP |
| Refunds automáticos | Post-MVP |

> **Regla de oro**: si alguien del equipo propone una feature que NO está en la lista IN, va a la lista OUT. Sin excepción hasta agosto.

---

## 2. Stack técnico definitivo

### Backend
- **Framework**: NestJS 10
- **ORM**: Prisma 5
- **DB**: PostgreSQL 16 (Docker local + Railway/Supabase en prod)
- **Auth**: JWT (access + refresh) — librería `@nestjs/jwt` + `passport-jwt`
- **Hash**: bcrypt
- **Validación**: class-validator + class-transformer
- **Storage docs**: Cloudflare R2 (compatible con S3, gratis hasta 10GB)
- **Push notifications**: Expo Push API (gratis, integrado con Expo)
- **Deploy**: Railway o Render (free tier alcanza al principio)

### Frontend
- Lo que ya está: Expo 52 + RN 0.76 + Expo Router (no se toca)
- **HTTP client**: axios (con interceptor para JWT)
- **State management**: Zustand (más liviano que Redux, perfecto para este tamaño)
- **Forms**: react-hook-form (ya están los inputs hechos, solo conectar)
- **Cache de queries**: TanStack Query (React Query) — fundamental para performance

### Herramientas
- **API testing**: Insomnia o Postman
- **DB GUI**: Prisma Studio (incluido) + TablePlus opcional
- **Versionado**: GitHub con branches por feature
- **CI**: GitHub Actions básico (lint + typecheck en cada PR)
- **Tracking de issues**: GitHub Projects (kanban) o Linear free

---

## 3. Organización del equipo

Asumiendo equipo de **3 personas**:

### Persona A — Backend lead
- Setup de NestJS, Prisma, Docker
- Auth module completo
- Endpoints de pros + turnos
- Deploy del backend

### Persona B — Frontend lead (integración)
- Conectar pantallas existentes con el backend real
- Manejo de estado global (Zustand)
- Interceptores axios + refresh token
- Forms (signup, login, reserva)

### Persona C — Full-stack flexible
- Owner module (backend + frontend)
- Notificaciones push
- Reviews
- Apoyo a A y B donde haga falta

Si son **2 personas**: A hace backend + owner. B hace todo el frontend + notifs.

### Reuniones
- **Daily de 15 min** (puede ser por WhatsApp/Discord, no necesariamente video)
- **Weekly de 1h** (lunes 9am): qué hicimos la semana pasada, qué hacemos esta, bloqueos
- **Demo cada 2 semanas** entre ustedes para ver el progreso

---

## 4. Timeline detallado (13 semanas)

### 🟢 SEMANA 1 (15-21 mayo) — Setup
- [ ] Crear carpeta `/backend` con NestJS scaffold (`nest new`)
- [ ] Docker Compose con Postgres 16
- [ ] `npx prisma migrate dev --name init` → crea las 42 tablas
- [ ] `npx prisma db seed` → carga datos de prueba
- [ ] Endpoint health check `GET /health`
- [ ] Frontend: instalar `axios`, `zustand`, `@tanstack/react-query`
- [ ] Configurar variable de entorno con la URL del backend
- **Entregable**: backend levanta en `:3000`, DB con datos, frontend con axios listo

### 🟢 SEMANA 2 (22-28 mayo) — Auth backend
- [ ] Auth module: `POST /auth/signup` (crea User + CLIENT role + ClientProfile)
- [ ] `POST /auth/login` con bcrypt + JWT
- [ ] `POST /auth/refresh` (refresh token)
- [ ] `POST /auth/logout`
- [ ] JWT strategy + AuthGuard
- [ ] Roles guard básico (decorator `@Roles('CLIENT' | 'PRO' | 'OWNER')`)
- **Entregable**: con Postman, registrarse → loguearse → llamar a endpoint protegido

### 🟢 SEMANA 3 (29 may - 4 jun) — Auth frontend
- [ ] Zustand store de auth (user, tokens, isAuthenticated)
- [ ] Axios interceptor: agrega `Authorization: Bearer` + refresh automático
- [ ] Pantalla `auth.tsx` conectada a `/auth/signup` y `/auth/login`
- [ ] Persistencia con `expo-secure-store` (tokens) y `AsyncStorage` (user)
- [ ] Logout funcional
- **Entregable**: signup → login → ves tu tab de cliente con tu nombre real

### 🟡 SEMANA 4 (5-11 jun) — Roles + KYC simple
- [ ] Backend: `POST /roles/request` (auto-aprueba PRO/OWNER, crea profile)
- [ ] Backend: `POST /auth/switch-role`
- [ ] Backend: `GET /me` (devuelve user + roles + perfiles)
- [ ] Frontend: pantalla `become-pro.tsx` conectada
- [ ] Frontend: pantalla `become-owner.tsx` conectada
- [ ] Frontend: switch de rol persiste y redirige a tabs correctas
- **Entregable**: un user puede pedir ser pro, queda aprobado, switchea, ve tabs de pro

### 🟢 SEMANA 5 (12-18 jun) — Endpoints de pros
- [ ] `GET /pros?categoryId=...` — listado público con filtros
- [ ] `GET /pros/:slug` — detalle del pro
- [ ] `GET /pros/:id/services` — servicios del pro
- [ ] `GET /pros/:id/availability?date=...` — slots disponibles
- [ ] Backend lógica de cálculo de slots (basado en `ProfessionalAvailability` + turnos ya tomados)
- **Entregable**: con Postman, listar pros, ver perfil, ver slots disponibles para un día

### 🟡 SEMANA 6 (19-25 jun) — Conectar frontend cliente
- [ ] Hooks con React Query: `useProsList`, `useProDetail`, `useProAvailability`
- [ ] Pantalla de búsqueda (`search.tsx`) usa el endpoint real
- [ ] Perfil del pro (`pro/[id].tsx`) usa el endpoint real
- [ ] Selector de servicios y horarios usa availability real
- **Entregable**: el cliente puede explorar pros reales en la app

### 🟢 SEMANA 7 (26 jun - 2 jul) — Reservas (turnos)
- [ ] Backend: `POST /appointments` (valida slot libre, crea Appointment + AppointmentService)
- [ ] Backend: `GET /appointments/me` (turnos del cliente o del pro según activeRole)
- [ ] Backend: `PATCH /appointments/:id/cancel` (cliente o pro pueden cancelar)
- [ ] Backend: `PATCH /appointments/:id/complete` (solo pro, marca como completado)
- [ ] Frontend: `booking.tsx` conectado → crear turno real
- [ ] Frontend: `confirmation.tsx` muestra datos del turno creado
- **Entregable**: end-to-end de reserva funcionando

### 🟡 SEMANA 8 (3-9 jul) — Pro: servicios y horarios
- [ ] Backend: CRUD de `ProfessionalService`
- [ ] Backend: CRUD de `ProfessionalAvailability`
- [ ] Frontend: pantalla para que el pro agregue/edite servicios (puede ser modal)
- [ ] Frontend: pantalla para que el pro defina sus horarios (días + rangos)
- [ ] Frontend: agenda del pro (`(pro)/agenda.tsx`) muestra turnos reales
- **Entregable**: el pro puede self-onboard completamente y empieza a recibir turnos

### 🟢 SEMANA 9 (10-16 jul) — Owner: venues y spaces
- [ ] Backend: CRUD de `Venue` (solo el dueño puede)
- [ ] Backend: CRUD de `Space` (incluye `SpaceAmenity`, `SpaceAvailability`)
- [ ] Backend: `POST /space-bookings` (pro solicita un espacio)
- [ ] Backend: `GET /owner/space-bookings` (con filtro por status)
- [ ] Backend: `PATCH /space-bookings/:id` (owner aprueba/rechaza)
- [ ] Frontend: tabs de owner conectadas
- **Entregable**: ciclo completo owner ↔ pro funcionando para alquiler

### 🟡 SEMANA 10 (17-23 jul) — Reviews + dashboard
- [ ] Backend: `POST /reviews` (solo si el turno está completado y aún no tiene review)
- [ ] Backend: `GET /pros/:id/reviews`
- [ ] Backend: actualizar `ProfessionalProfile.averageRating` y `totalReviews` al crear review
- [ ] Frontend: pantalla de "calificar" después del turno
- [ ] Frontend: reviews en el perfil del pro
- [ ] Backend: dashboard básico del owner (`GET /owner/dashboard`) — datos crudos sin gráficos
- **Entregable**: reviews funcionando + owner ve sus números

### 🟡 SEMANA 11 (24-30 jul) — Notificaciones
- [ ] Backend: integración con Expo Push API
- [ ] Backend: enviar push al pro cuando un cliente reserva
- [ ] Backend: enviar push al cliente cuando se confirma su turno
- [ ] Backend: enviar push al owner cuando un pro pide un espacio
- [ ] Frontend: registrar device token al login
- [ ] Frontend: pantalla de notificaciones (`notifications.tsx`) con lista real
- **Entregable**: push notifications de eventos críticos

### 🔴 SEMANA 12 (31 jul - 6 ago) — Bug fixing + polish
- [ ] Probar end-to-end todos los flujos
- [ ] Arreglar bugs encontrados
- [ ] Mejorar manejo de errores en frontend (loading states, error messages)
- [ ] Validaciones de borde (qué pasa si el pro borra un servicio con turnos)
- [ ] Performance: paginación en listados grandes
- **Entregable**: app estable

### 🔴 SEMANA 13 (7-13 ago) — Deploy + demo
- [ ] Deploy backend a Railway (o Render)
- [ ] Configurar variables de entorno de producción
- [ ] Build de Expo: `eas build` para tener APK testeable
- [ ] Probar la app en dispositivos reales con datos reales
- [ ] Grabar video demo de 3-5 min mostrando el flujo
- [ ] Actualizar README y CONTEXT.md con el estado final
- **Entregable**: APK + backend deployado + demo para presentar

---

## 5. Lo que NO te va a dar tiempo (y está bien)

Si llegás al 60% con todo lo de arriba funcionando, **NO estás atrasado**. Eso ES el MVP. Lo que sigue para post-agosto:

1. Integración Mercado Pago (semana 14-16)
2. Gamificación (ruleta + puntos) (semana 17-19)
3. Multi-servicio en un turno (semana 20)
4. Analytics avanzado para owner (semana 21)
5. Búsqueda por geolocalización (semana 22)
6. Login social (Google/Apple) (semana 23)
7. KYC con servicio tercero (semana 24-25)
8. Chat in-app (semana 26-28)

---

## 6. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Cómo lo evitamos |
|---|---|---|---|
| Backend setup se demora más de la semana 1 | Media | Alto | Tener Docker Compose listo desde el día 1 |
| Integración frontend ↔ backend se complica | Alta | Alto | Empezar con un solo endpoint (login) y validar todo el flujo antes de sumar más |
| Auth se rompe con multi-rol | Media | Alto | Tests manuales con Postman antes de tocar el frontend |
| Push notifications no llegan | Alta | Medio | Hay buen tutorial de Expo; si falla, dejar solo in-app |
| Deploy se complica al final | Media | Alto | Deployar un "hello world" en semana 2 para tener el pipeline listo |
| Alguno del equipo se atrasa | Alta | Alto | Daily de 15 min para detectar bloqueos rápido |
| Bug en producción | Alta | Medio | Logs centralizados (Sentry free tier) + plan de rollback |

---

## 7. Checklist de "esto está listo"

Para considerar el MVP completo (60%):

### Funcional
- [ ] Un cliente se puede registrar, loguear, buscar un pro y reservar un turno
- [ ] El pro puede ver el turno en su agenda y marcarlo como completado
- [ ] El cliente puede dejar review después
- [ ] Un usuario puede pedir ser pro/owner y operar como tal
- [ ] El owner puede crear venues, spaces y aprobar requests de pros

### Técnico
- [ ] Backend deployado y accesible públicamente
- [ ] DB en producción con migraciones aplicadas
- [ ] APK instalable que se conecta al backend de prod
- [ ] JWT funcionando con refresh automático
- [ ] Push notifications activas
- [ ] README actualizado con cómo levantar el proyecto

### Demo
- [ ] Video de 3-5 min mostrando el flujo crítico
- [ ] Documento de presentación con screenshots
- [ ] 2-3 cuentas de prueba (1 cliente, 1 pro, 1 owner) con datos pre-cargados

---

## 8. Comandos para arrancar (Semana 1)

```bash
# Crear backend
cd "c:\Users\Usuario\Desktop\Tesis TuHora"
npx -y @nestjs/cli new backend
cd backend
npm install @prisma/client @nestjs/jwt @nestjs/passport passport-jwt bcrypt class-validator class-transformer
npm install -D prisma @types/bcrypt

# Docker Compose (crear backend/docker-compose.yml manualmente)
docker compose up -d

# Aplicar schema
npx prisma migrate dev --name init
npx prisma db seed

# Frontend
cd ../frontend
npm install axios zustand @tanstack/react-query expo-secure-store
```

---

## 9. Resumen ejecutivo (para el grupo)

> **Objetivo**: MVP funcional con flujo cliente → pro → owner end-to-end para mediados de agosto.

> **Stack**: NestJS + Prisma + Postgres + Expo + Zustand + React Query.

> **Equipo**: 3 personas, 20-30 hs/semana cada una.

> **Timeline**: 13 semanas (mayo 15 → agosto 13).

> **NO incluye en MVP**: pagos, gamificación, promociones, chat, búsqueda geo, login social, KYC con tercero.

> **Riesgo principal**: meternos en features fuera del scope. Solución: pegar este documento en la pared y revisarlo cada lunes.
