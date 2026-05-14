# TuHora · Mobile App

App mobile de TuHora — red inteligente de espacios flexibles para profesionales independientes.

## Stack

- **Expo SDK 52** + **React Native 0.76** + **TypeScript**
- **Expo Router** para navegación file-based
- **Lucide React Native** para íconos
- **React Native SVG** para gráficos custom
- **Instrument Serif** + **Geist** (sistema) para tipografía

## Setup

### Requisitos
- Node.js 20+
- npm o pnpm
- Para probar en celular: app **Expo Go** instalada (iOS / Android)
- (Opcional) Android Studio para emulador o Xcode para simulador iOS

### Instalación

```bash
npm install
```

### Correr la app

```bash
npx expo start
```

Esto abre Metro bundler. Después tenés varias opciones:

- **Escanear el QR** con la app Expo Go en tu celular (mismo wifi)
- **Tecla `a`** para emulador Android
- **Tecla `i`** para simulador iOS (solo en Mac)
- **Tecla `w`** para abrir en browser (modo web, soporte limitado)

## Estructura

```
frontend/
├── app/                    ← rutas (expo-router file-based)
│   ├── _layout.tsx         ← layout raíz
│   ├── index.tsx           ← pantalla inicial (onboarding)
│   ├── auth.tsx            ← login / registro
│   ├── verification.tsx    ← KYC profesional
│   ├── pro/[id].tsx        ← detalle del profesional
│   ├── booking.tsx         ← reserva
│   ├── confirmation.tsx    ← confirmación
│   ├── points.tsx          ← puntos / ruleta
│   ├── notifications.tsx
│   ├── profile.tsx
│   ├── (client)/           ← tabs cliente: home, search, appointments, profile
│   ├── (pro)/              ← tabs profesional: dashboard, agenda, spaces, profile
│   └── (owner)/            ← tabs propietario: dashboard, spaces, requests, analytics
├── src/
│   ├── theme/              ← tokens, paletas, tipografía
│   ├── components/
│   │   ├── ui/             ← atoms: Btn, Card, Pill, Chip, Avatar, BottomNav, etc.
│   │   └── icons/          ← re-exports de lucide
│   ├── screens/shared/     ← pantallas reutilizadas (Profile, Notifications)
│   ├── data/mock.ts        ← datos de prueba
│   └── types/
└── frontend-web-legacy/    ← (afuera) versión web vieja archivada
```

## Convenciones

- **Path alias**: `@/*` → `./src/*` (configurado en `tsconfig.json`)
- **Componentes**: PascalCase, archivos `.tsx`
- **Hooks/funciones/variables**: camelCase
- **Tipos**: definir interfaces para props. Nunca `any`.

## Pantallas

**Auth (3):**
- Onboarding · Login/Registro · Verificación KYC

**Cliente (4 tabs + 4 modales):**
- Inicio · Buscar · Turnos · Perfil
- Detalle profesional · Reserva · Confirmación · Puntos · Notificaciones

**Profesional (4 tabs):**
- Dashboard · Agenda · Espacios disponibles · Perfil

**Propietario (4 tabs):**
- Dashboard · Espacios · Solicitudes · Métricas

## Backend

El backend (NestJS + Prisma) está en `/backend`. Por ahora la app usa datos mockeados de `src/data/mock.ts`. La conexión con el backend se hará más adelante.
