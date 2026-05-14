export const T = {
  page: '#FBFAF7',
  pageAlt: '#F2F0EA',
  surface: '#FFFFFF',
  ink: '#0A0908',
  ink2: '#1F1D1A',
  muted: '#75716A',
  hint: '#A8A49A',
  hairline: '#EEEBE3',
  hairlineDk: '#D6D2C7',
  accent: '#F2541B',
  accentSoft: '#FFEEE3',
  accentInk: '#5C1A05',
  success: '#1C7A4F',
  successSoft: '#E5F2EB',
  warning: '#B26A0A',
  warningSoft: '#FAEFD7',
  danger: '#C8362B',
  dangerSoft: '#FBE3DF',
  info: '#2854C5',
  infoSoft: '#E5ECF8',
  shadow: 'rgba(15, 14, 12, 0.06)',
  shadowMd: 'rgba(15, 14, 12, 0.10)',
  shadowLg: 'rgba(15, 14, 12, 0.18)',
} as const;

export type ThemeKey = keyof typeof T;

export const avatarPalettes = {
  ink: { bg: T.ink, fg: '#fff' },
  accent: { bg: T.accent, fg: '#fff' },
  soft: { bg: T.pageAlt, fg: T.ink },
  olive: { bg: '#3F4A2E', fg: '#fff' },
  plum: { bg: '#3D2A3A', fg: '#fff' },
  teal: { bg: '#1F4544', fg: '#fff' },
  sand: { bg: '#C8B68C', fg: T.ink },
} as const;

export type AvatarTone = keyof typeof avatarPalettes;

export const imageTones = {
  sand: { a: '#F0E5CC', b: '#C8A77A', c: '#8A6B3E', fg: '#FFFFFF' },
  olive: { a: '#6A7A50', b: '#3F4A2E', c: '#252D18', fg: '#FFFFFF' },
  ink: { a: '#3A3833', b: '#1A1916', c: '#0A0908', fg: '#FFFFFF' },
  blush: { a: '#F5D5C0', b: '#D89C7E', c: '#A1664A', fg: '#FFFFFF' },
  sky: { a: '#CAD5E0', b: '#7A8FA8', c: '#3D4F66', fg: '#FFFFFF' },
  stone: { a: '#E0DCD0', b: '#9C9587', c: '#5D5648', fg: '#FFFFFF' },
} as const;

export type ImageTone = keyof typeof imageTones;

export const shadows = {
  sm: {
    shadowColor: '#0F0E0C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F0E0C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F0E0C',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 8,
  },
} as const;
