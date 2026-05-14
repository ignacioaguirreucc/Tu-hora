import { Platform } from 'react-native';

export const fonts = {
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemi: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }) as string,
  serif: 'InstrumentSerif_400Regular',
  serifItalic: 'InstrumentSerif_400Regular_Italic',
};

export const text = {
  displayXl: { fontFamily: fonts.sansBold, fontSize: 36, letterSpacing: -0.8, lineHeight: 40 },
  display: { fontFamily: fonts.sansBold, fontSize: 28, letterSpacing: -0.6, lineHeight: 34 },
  title: { fontFamily: fonts.sansSemi, fontSize: 20, letterSpacing: -0.4, lineHeight: 26 },
  titleSm: { fontFamily: fonts.sansSemi, fontSize: 16, letterSpacing: -0.3, lineHeight: 22 },
  body: { fontFamily: fonts.sans, fontSize: 14, letterSpacing: -0.1, lineHeight: 20 },
  bodyMed: { fontFamily: fonts.sansMedium, fontSize: 14, letterSpacing: -0.1, lineHeight: 20 },
  caption: { fontFamily: fonts.sans, fontSize: 12, letterSpacing: 0, lineHeight: 16 },
  captionMed: { fontFamily: fonts.sansMedium, fontSize: 12, letterSpacing: 0, lineHeight: 16 },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    fontWeight: '600' as const,
  },
};
