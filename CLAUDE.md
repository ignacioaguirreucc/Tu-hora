# Contexto del Proyecto: TuHora

Red inteligente de espacios flexibles para profesionales independientes. Plataforma mobile para gestión de espacios de coworking y servicios para profesionales (barberos, dentistas, esteticistas, etc.).

## Stack

**Frontend (mobile app):**
- Expo SDK 52 + React Native 0.76 + TypeScript
- Expo Router (file-based navigation)
- Lucide React Native (íconos)
- React Native SVG (gráficos custom)
- expo-blur (efectos)
- Instrument Serif + Geist (tipografía vía expo-google-fonts)

**Backend:**
- NestJS + Prisma + PostgreSQL (no levantado todavía)

## Comandos

**Frontend** (`/frontend`):
```bash
npm install              # primera vez
npx expo start           # arranca Metro bundler
npx expo start --android # en emulador Android
npx expo start --ios     # en simulador iOS
# o escaneá el QR con Expo Go en tu celu
```

**Backend** (`/backend`):
```bash
npm install
docker-compose up -d     # levanta Postgres
npx prisma migrate dev   # aplica migraciones
npm run start:dev
```

## Guías de Código

- **Componentes**: funcionales con TypeScript (.tsx). PascalCase.
- **Hooks/funciones/variables**: camelCase.
- **Estilos**: StyleSheet o inline con objetos. Tokens del tema desde `@/theme`.
- **Tipado**: definir tipos/interfaces para props y estado. No usar `any`.
- **Íconos**: `lucide-react-native` re-exportados desde `@/components/icons`.
- **Navegación**: expo-router con routes en `/frontend/app`. Tab groups en `(client)`, `(pro)`, `(owner)`.
- **Path alias**: `@/*` → `./src/*`.

## Estructura

```
frontend/
├── app/                    ← rutas (expo-router)
│   ├── _layout.tsx         ← root layout (carga fuentes, stack)
│   ├── index.tsx           ← onboarding
│   ├── auth.tsx
│   ├── verification.tsx
│   ├── pro/[id].tsx        ← perfil del profesional
│   ├── booking.tsx
│   ├── confirmation.tsx
│   ├── points.tsx
│   ├── notifications.tsx
│   ├── profile.tsx
│   ├── (client)/           ← tabs cliente
│   ├── (pro)/              ← tabs profesional
│   └── (owner)/            ← tabs propietario
├── src/
│   ├── theme/              ← tokens (T, tipografía, paletas)
│   ├── components/
│   │   ├── ui/             ← Btn, Card, Pill, Chip, Avatar, etc.
│   │   └── icons/          ← re-exports de lucide
│   ├── screens/shared/     ← pantallas reutilizadas por tabs
│   ├── data/               ← mock data
│   └── types/
└── frontend-web-legacy/    ← versión web vieja (referencia)
```

## Notas

- Flujo de validación de identidad (KYC) para profesionales.
- Los datos vienen de `src/data/mock.ts` — el backend todavía no está conectado.
- Diseño basado en el sistema "Warm Premium v2" (paleta crema + naranja + ink negro).
