import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { T } from '@/theme';

type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'ink';
type Size = 'sm' | 'md';

const tones: Record<Tone, { bg: string; fg: string; dot: string; bd: string }> = {
  neutral: { bg: T.pageAlt, fg: T.ink2, dot: T.muted, bd: T.hairline },
  accent: { bg: T.accentSoft, fg: T.accentInk, dot: T.accent, bd: '#FFD7BE' },
  success: { bg: T.successSoft, fg: '#0E5A36', dot: T.success, bd: '#BFDDCB' },
  warning: { bg: T.warningSoft, fg: '#6B3D04', dot: T.warning, bd: '#EAD4A6' },
  danger: { bg: T.dangerSoft, fg: '#7A1F17', dot: T.danger, bd: '#EBC2BC' },
  info: { bg: T.infoSoft, fg: '#13347A', dot: T.info, bd: '#C7D2EC' },
  ink: { bg: T.ink, fg: '#fff', dot: '#fff', bd: T.ink },
};

type Props = {
  children: React.ReactNode;
  tone?: Tone;
  dot?: boolean;
  leading?: React.ReactNode;
  size?: Size;
  style?: ViewStyle;
};

export function Pill({ children, tone = 'neutral', dot, leading, size = 'md', style }: Props) {
  const t = tones[tone];
  const sz = size === 'sm' ? { h: 22, px: 8, fs: 11, gap: 5 } : { h: 28, px: 10, fs: 12, gap: 6 };
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: sz.gap,
          height: sz.h,
          paddingHorizontal: sz.px,
          borderRadius: 999,
          backgroundColor: t.bg,
          borderWidth: 1,
          borderColor: t.bd,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      {dot && (
        <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: t.dot }} />
      )}
      {leading}
      <Text style={{ color: t.fg, fontSize: sz.fs, fontWeight: '500', letterSpacing: -0.05 }}>
        {children}
      </Text>
    </View>
  );
}
