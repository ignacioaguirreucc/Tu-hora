# TuHora — Contexto del proyecto (handoff)

> Documento de traspaso. Resumen de qué es el proyecto, qué hicimos hasta ahora, cómo quedó la base de datos, cómo manejar el login multi-rol y qué sigue.

---

## 1. Qué es TuHora

Red inteligente de **espacios flexibles para profesionales independientes**. Plataforma mobile (Expo / React Native) donde conviven tres roles que se relacionan entre sí:

- **Cliente** → reserva turnos con profesionales (cortes de pelo, dentista, estética, etc).
- **Profesional** (barbero, dentista, esteticista) → ofrece servicios, gestiona su agenda, puede alquilar un espacio físico a un dueño.
- **Dueño de local** → tiene un local con uno o más "espacios" (sillones, camillas, consultorios) y los alquila por hora a profesionales.

La gracia del modelo: un mismo usuario puede ser **los tres roles al mismo tiempo** (un barbero puede ser cliente de un dentista y a la vez dueño de su propio local).

---

## 2. Stack

**Frontend (mobile)**
- Expo SDK 52 + React Native 0.76 + TypeScript
- Expo Router (file-based routing en `/frontend/app`)
- Tab groups: `(client)`, `(pro)`, `(owner)` — cada rol tiene sus pantallas
- Fuentes: Instrument Serif + Geist
- Diseño: "Warm Premium v2" (crema + naranja + ink negro)

**Backend (a empezar)**
- NestJS + Prisma + PostgreSQL
- Docker Compose para Postgres local
- JWT (access + refresh tokens)

---

## 3. Qué hicimos hasta ahora

### ✅ Frontend (funcional con mock data)
- Todas las pantallas están construidas y navegables
- Onboarding, login (email + social Google/Apple), verification (KYC steps)
- Tabs de cliente: home, search, bookings, profile
- Tabs de pro: dashboard, agenda, spaces (para alquilar), profile
- Tabs de owner: dashboard, spaces (sus espacios), requests (solicitudes), analytics
- Flujos: `booking.tsx` (reserva en 3 pasos), `confirmation.tsx`, `pro/[id].tsx` (perfil del pro)
- Gamificación: `points.tsx` (ruleta animada + catálogo de premios)
- KYC: `become-pro.tsx` y `become-owner.tsx` (formularios + subida de documentos)
- Sistema de switch de rol funcionando con `AuthContext` (en mock)
- Data mockeada en `src/data/mock.ts`

### ✅ Base de datos (Prisma schema completo)
- 42 tablas definidas en `backend/prisma/schema.prisma`
- Pasa **1FN, 2FN, 3FN, BCNF** (con denormalizaciones documentadas)
- Seed script en `backend/prisma/seed.ts` con datos de prueba
- Diagrama visual en `schema_mermaid.txt` (pegar en `mermaid.live`)

### ⏳ Backend (pendiente)
- NestJS scaffold
- Auth module (signup, login, JWT, refresh)
- Endpoints REST para cada feature
- Subida de documentos a storage (S3 / Cloudflare R2)
- Integración pagos (Mercado Pago)
- Webhooks de notificaciones

---

## 4. Cómo quedó la base de datos

### 4.1. Tablas principales (42 en total)

**Auth / identidad**
- `User` — la persona (email, password, dni, firstName, lastName, activeRole)
- `UserRoleAssignment` — qué roles tiene aprobados (CLIENT, PROFESSIONAL, OWNER, ADMIN)
- `AuthSession`, `SocialAccount`, `PasswordResetToken`, `VerificationToken`, `DeviceToken`

**Perfiles por rol**
- `ClientProfile` — datos como cliente (puntos, nivel, ruleta)
- `ProfessionalProfile` — datos como profesional (matrícula, especialidad, comisión)
- `OwnerProfile` — datos como dueño (CUIT, businessName, auto-aprobación)

**Locales y espacios**
- `Venue` — local físico (Av. Corrientes 1234)
- `Space` — unidad dentro del venue (sillón, camilla, consultorio)
- `SpacePhoto`, `SpaceAmenity`, `SpaceAvailability` — fotos, equipamiento, horarios

**Reservas**
- `SpaceBooking` — el pro le alquila un espacio al dueño
- `Appointment` — el cliente reserva un turno con el pro
- `AppointmentService` — los servicios concretos del turno (1 turno puede tener varios)

**Pagos**
- `Transaction` — el cobro
- `PaymentSplit` — cómo se reparte (pro / owner / plataforma)
- `NoShowPenalty` — penalización si el cliente no apareció

**Gamificación**
- `PointsTransaction` — historial de puntos
- `Reward`, `RewardRedemption` — recompensas y canjes
- `WheelSpin` — ruleta de premios

**Otros**
- `Review`, `Promotion`, `Notification`, `AuditLog`, `OwnerAnalyticsSnapshot`, `CommissionMilestone`, `ClientFavorite`

### 4.2. Correcciones BCNF que se aplicaron

| Antes | Ahora |
|---|---|
| `User.role` era un solo enum | Tabla `UserRoleAssignment` para soportar multi-rol |
| Sin `dni` en User | `User.dni String? @unique` (un DNI = una persona) |
| `Appointment` tenía snapshots duplicados (`serviceNameSnapshot`, etc) | Snapshots viven solo en `AppointmentService` |
| `SpaceBooking.ownerId` era dependencia transitiva | Removido (se deriva por `space.venue.ownerId`) |
| `SpaceAvailability` permitía un solo bloque por día | Permite turnos partidos (mañana + tarde) |
| FKs sin relación Prisma (`payerUserId`, `recipientUserId`, etc) | Todas las FKs tienen relación explícita |
| `OwnerProfile` no tenía nombre del responsable | Agregado `firstName`, `lastName` |

---

## 5. Cómo manejar usuarios y multi-rol (la parte clave)

Este es el punto más importante para entender el sistema. **No tenemos 3 tablas de usuarios separadas**. Tenemos **una sola tabla User** + una tabla `UserRoleAssignment` que dice qué roles tiene aprobados.

### 5.1. Modelo mental

```
                       ┌──────────────────────┐
                       │       User           │
                       │ (1 fila por persona) │
                       │ email, dni, password │
                       │ activeRole           │
                       └──────────┬───────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
   │ UserRoleAssign   │  │ UserRoleAssign   │  │ UserRoleAssign   │
   │ role: CLIENT     │  │ role: PRO        │  │ role: OWNER      │
   │ status: APPROVED │  │ status: APPROVED │  │ status: PENDING  │
   └──────────────────┘  └──────────────────┘  └──────────────────┘
              │                   │                   │
              ▼                   ▼                   ▼
       ┌────────────┐      ┌────────────────┐  ┌──────────────┐
       │ Client     │      │ Professional   │  │ Owner        │
       │ Profile    │      │ Profile        │  │ Profile      │
       │ (puntos)   │      │ (servicios)    │  │ (venue, CUIT)│
       └────────────┘      └────────────────┘  └──────────────┘
```

**Reglas clave**:
1. Todo usuario al registrarse arranca con `UserRoleAssignment { role: CLIENT, status: APPROVED }` automáticamente.
2. Para ser PRO u OWNER, el usuario tiene que **pedir el rol** (KYC) → se crea `UserRoleAssignment { role: PRO, status: PENDING }`.
3. Admin revisa los documentos → cambia a `status: APPROVED` → recién ahí el usuario puede usar ese rol.
4. `User.activeRole` guarda el rol activo en la UI (qué tabs ve ahora). Cambia con el botón "switch role".

### 5.2. Flujo de signup y login

#### Signup (registro inicial)
```
POST /auth/signup
{
  email, password, dni, firstName, lastName
}
```
Backend hace:
1. Crea `User`
2. Crea `UserRoleAssignment { role: CLIENT, status: APPROVED }` automáticamente
3. Crea `ClientProfile` vacío
4. Devuelve JWT con `{ userId, roles: ['CLIENT'], activeRole: 'CLIENT' }`

> Resultado: el usuario ya puede usar la app como cliente. Para ser pro/owner tiene que pedirlo aparte.

#### Login
```
POST /auth/login
{ email, password }
```
Backend hace:
1. Valida credenciales
2. Lee `UserRoleAssignment WHERE userId = X AND status = APPROVED`
3. Devuelve JWT con `{ userId, roles: [...], activeRole: user.activeRole }`

> El JWT carga la lista completa de roles aprobados — el frontend la usa para decidir si mostrar el botón "switch role".

### 5.3. Pedir otro rol (KYC — auto-aprobación con flag)

El usuario clickea "Convertite en profesional" (`become-pro.tsx`) o "Registrá tu local" (`become-owner.tsx`):

```
POST /roles/request
{
  role: 'PROFESSIONAL',
  specialty: 'Barbero',
  publicSlug: 'lucas-rivera',
  documents: [...]
}
```
Backend hace:
1. Crea `UserRoleAssignment { role: PROFESSIONAL, status: APPROVED }` (auto)
2. Crea `ProfessionalProfile { isVerified: false, validationStatus: PENDING }`
3. Sube los docs a storage → crea `ProfessionalDocument` rows
4. El user ya puede usar el rol inmediatamente, pero aparece como "no verificado"

Para conseguir el **badge de verificado** (relevante para confianza del cliente):
```
PATCH /admin/professionals/:id { isVerified: true }
```
Backend:
1. Marca `ProfessionalProfile.isVerified = true` y `validationStatus = APPROVED`
2. Manda push: "Tu cuenta está verificada, ya tenés el badge"

> Detalle clave: el usuario **NO** queda bloqueado esperando aprobación. Puede operar desde el segundo uno. La revisión manual solo es para otorgar el badge de confianza.

### 5.4. Switch de rol (cambiar entre cliente/pro/owner)

El usuario clickea el botón de switch en su perfil:
```
POST /auth/switch-role
{ role: 'PROFESSIONAL' }
```
Backend:
1. Verifica que el user tiene `UserRoleAssignment { role: PROFESSIONAL, status: APPROVED }`
2. Actualiza `User.activeRole = PROFESSIONAL`
3. Devuelve un **JWT nuevo** con `activeRole` actualizado
4. Frontend redirige a `/(pro)/dashboard`

### 5.5. Autorización en endpoints

NestJS usa un guard custom `@Roles()` que lee el JWT:

```typescript
@Get('owner/analytics')
@Roles('OWNER')              // ← solo si activeRole === OWNER
async getAnalytics() { ... }

@Get('pro/agenda')
@Roles('PROFESSIONAL')
async getAgenda() { ... }
```

Si un cliente intenta acceder a `/owner/analytics` → 403 Forbidden.

### 5.6. Por qué este diseño es correcto

- **Una sola identidad** (User) → un solo email/password/DNI.
- **Roles desacoplados** (UserRoleAssignment) → se pueden agregar sin migrar la tabla principal.
- **KYC independiente por rol** → ser pro no implica nada sobre ser owner.
- **Switch instantáneo** → no hay que cerrar sesión para cambiar de rol.
- **Cumple BCNF** → no hay dependencias transitivas en User.

---

## 6. Estrategia de KYC (verificación de identidad)

Esta es una decisión importante porque define cuánta fricción tiene el onboarding y cuánto trabajo manual implica para nosotros.

### 6.1. Las 4 opciones que evaluamos

| Opción | Cómo funciona | Pro | Contra |
|---|---|---|---|
| **1. Auto-aprobación total** | Click → APPROVED sin revisar nada | Cero fricción | Cualquiera puede ser "barbero verificado" → riesgo de estafa |
| **2. Auto + flag `isVerified=false`** | Auto APPROVED para usar el rol, pero sin badge. Badge requiere revisión manual | Usuario opera enseguida; revisión solo para el badge | Pros no verificados pueden manchar la reputación al inicio |
| **3. KYC tercerizado** | Truora / Veriff / Onfido / Didit valida DNI+selfie automático en 30s vía API | Profesional, sin trabajo manual | Cuesta ~$1 USD por verificación; requiere integración |
| **4. Manual total** | Admin revisa cada solicitud antes de aprobar | Control total | Inviable más allá de 100 usuarios |

### 6.2. Decisión tomada

**Fase actual (desarrollo + primeros 200-500 usuarios) → Opción 2.**

- Al pedir rol PRO u OWNER, el sistema lo aprueba automáticamente (`status = APPROVED`)
- `ProfessionalProfile.isVerified` arranca en `false`
- En el marketplace, los pros sin verificar aparecen sin el badge "Verificado"
- El admin (nosotros) solo revisa cuando un pro pide el **badge de verificación**
- Esto reduce la revisión manual a ~5% del volumen de usuarios

**Fase producción (cuando lleguemos a ~500 usuarios o al primer caso de fraude) → migrar a Opción 3.**

### 6.3. Por qué la migración a Opción 3 es trivial

El schema actual ya soporta ambos modos sin cambios. Lo único que cambia es **quién** dispara el cambio de status:

| | Opción 2 | Opción 3 |
|---|---|---|
| Aprobar `UserRoleAssignment.status` | Backend al recibir el request (auto) | Backend al recibir webhook del servicio KYC |
| Marcar `isVerified=true` | Admin manual | Webhook del servicio KYC |
| Resto del sistema | Idéntico | Idéntico |

Cuando llegue el momento de migrar a Opción 3:
1. Te registrás en un servicio (Truora / Veriff / Didit — los 3 tienen capa free para arrancar)
2. Agregás `POST /kyc/start` que llama al servicio y devuelve una URL para el usuario
3. El frontend redirige al user → el servicio hace DNI + selfie + biometría
4. El servicio te llama por webhook: `POST /webhooks/kyc { userId, result: 'approved' }`
5. Tu backend actualiza `isVerified = true` automáticamente

**No tocás el schema, no migrás datos, no cambiás la UI más allá de un par de pantallas.** El sistema multi-rol y la lógica de `UserRoleAssignment` siguen funcionando igual.

### 6.4. Casos especiales

- **Roles que SIEMPRE requieren revisión manual** (incluso en Opción 2):
  - Profesionales de salud (odontología, kinesiología) — por regulación legal
  - Owners con CUIT de Responsable Inscripto > X facturación
- **Auto-aprobación inmediata**:
  - Cliente (siempre)
  - Profesionales de servicios no regulados (barbería, manicura, masajes) — pueden operar sin badge

Esta lógica se implementa con un campo extra en `UserRoleAssignment` o con un check en el endpoint de aprobación (por ahora no está en el schema, se puede agregar en Fase 2).

---

## 7. Próximos pasos (en orden)

### Fase 1 — Backend base (semana 1-2)
1. **Crear scaffold NestJS** en `/backend`
2. **Docker Compose** con Postgres 16
3. **`prisma migrate dev`** → aplicar schema actual y crear la DB
4. **`prisma db seed`** → cargar datos de prueba
5. **Auth module**:
   - `POST /auth/signup` (con creación automática de CLIENT role)
   - `POST /auth/login`
   - `POST /auth/refresh`
   - `POST /auth/logout`
   - JWT strategy + Roles guard

### Fase 2 — Endpoints core (semana 3-4)
6. **Roles**:
   - `POST /roles/request` (pedir PRO u OWNER)
   - `GET /roles/me` (lista de roles + status del usuario)
   - `POST /auth/switch-role`
7. **Profesionales**:
   - `GET /pros` (listing con filtros: categoría, rating, distancia)
   - `GET /pros/:slug` (detalle público)
   - `GET /pros/:id/services` y `GET /pros/:id/availability`
8. **Turnos**:
   - `POST /appointments` (crear)
   - `PATCH /appointments/:id/cancel`
   - `GET /appointments` (los míos como cliente o como pro)

### Fase 3 — Features dueño (semana 5)
9. **Venues + Spaces**:
   - CRUD de venues y spaces para el owner
   - `GET /owner/space-bookings` (solicitudes de alquiler)
   - `PATCH /owner/space-bookings/:id { status: APPROVED/REJECTED }`
10. **Analytics**:
    - `GET /owner/analytics?from=...&to=...`

### Fase 4 — Pagos (semana 6)
11. **Integración Mercado Pago**
12. **`Transaction` + `PaymentSplit`** al confirmar turno
13. **Webhook de pagos** → marca turno como pagado
14. **Refunds** y `NoShowPenalty`

### Fase 5 — Gamificación + notificaciones (semana 7)
15. Lógica de puntos al completar turno
16. Endpoints de ruleta (`/wheel/spin`)
17. Push notifications con Expo Push Tokens
18. Cron jobs para reminders

### Fase 6 — Admin + KYC (semana 8)
19. Panel admin para revisar `UserRoleAssignment` con status PENDING
20. Subida y revisión de documentos
21. Aprobación / rechazo con notificación al user

### Fase 7 — Frontend → backend real
22. Reemplazar mock data por llamadas reales (axios o fetch con JWT)
23. Manejo de loading / error states
24. Refresh token automático en interceptor

---

## 8. Archivos clave del repo

```
/backend
  /prisma
    schema.prisma          ← schema completo (42 tablas, BCNF)
    seed.ts                ← datos de prueba

/frontend
  /app                     ← rutas (Expo Router)
    /(client)              ← tabs del cliente
    /(pro)                 ← tabs del pro
    /(owner)               ← tabs del owner
    auth.tsx               ← login
    become-pro.tsx         ← KYC pro
    become-owner.tsx       ← KYC owner
    booking.tsx            ← reserva de turno
  /src
    /auth/AuthContext.tsx  ← maneja login/logout/switchRole (mock)
    /components/ui         ← Button, Card, Field, etc.
    /data/mock.ts          ← datos de prueba del frontend

CONTEXT.md                 ← este documento
schema_mermaid.txt         ← diagrama ER (pegar en mermaid.live)
CLAUDE.md                  ← guía de código del proyecto
```

---

## 9. Comandos útiles

**Frontend**
```bash
cd frontend
npm install
npx expo start              # arranca Metro
npx expo start --tunnel     # si Expo Go no se conecta
```

**Backend (cuando empecemos)**
```bash
cd backend
docker-compose up -d        # levanta Postgres
npm install
npx prisma migrate dev      # aplica schema → crea las 42 tablas
npx prisma db seed          # carga datos de prueba
npm run start:dev           # arranca NestJS en :3000
```

**Verificar DB**
```bash
npx prisma studio           # GUI para ver/editar registros
```

---

## 10. Decisiones que ya están tomadas (no las cambien sin avisar)

- **Multi-rol vía `UserRoleAssignment`** (no agregar `role` directo en User).
- **`User.dni`** es único — un DNI = una cuenta.
- **`Appointment.serviceNameSnapshot` NO existe** — los snapshots viven en `AppointmentService`.
- **`SpaceBooking.ownerId` NO existe** — derivar de `space.venue.ownerId`.
- **`activeRole`** se persiste en `User.activeRole` para mantenerlo entre dispositivos.
- **JWT** carga `{ userId, roles[], activeRole }` — el guard de NestJS valida ambos.
- **CLIENT role** se asigna automáticamente al signup.
- **PRO y OWNER roles** se auto-aprueban (Opción 2 de KYC) pero arrancan con `isVerified=false`. Solo se revisa manualmente para otorgar el badge de verificado. Migración futura a Opción 3 (KYC tercerizado) ya está prevista — ver sección 6.

---

## 11. Dudas frecuentes

**¿Por qué no separar el login en 3 (cliente / pro / owner)?**
Porque el negocio se rompe: un mismo barbero puede querer reservar un dentista (como cliente) y a la vez alquilar su sillón a otro pro (como owner). Si tuviera 3 cuentas distintas, sería una pesadilla de UX y datos.

**¿Cómo sabe el frontend qué tabs mostrar?**
Por `user.activeRole`. La función `routeForRole(role)` en `AuthContext.tsx` mapea cada rol a su tab group: CLIENT → `/(client)/home`, PRO → `/(pro)/dashboard`, OWNER → `/(owner)/dashboard`.

**¿Y si alguien tiene solo el rol CLIENT?**
No ve el botón de switch. Solo aparece cuando `roles.length > 1`. Si quiere ser pro, clickea "Convertite en profesional" en su perfil y arranca el KYC.

**¿El admin es un rol más?**
Sí, `UserRole.ADMIN` existe en el enum, pero no se asigna por self-service. Se agrega manualmente en la DB para los usuarios del equipo TuHora.
