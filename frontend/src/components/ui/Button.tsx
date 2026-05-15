import React from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import { T, shadows } from '@/theme';

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'soft' | 'success' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const sizeMap: Record<Size, { h: number; px: number; fs: number; r: number }> = {
  sm: { h: 38, px: 16, fs: 13, r: 12 },
  md: { h: 48, px: 20, fs: 14.5, r: 14 },
  lg: { h: 56, px: 24, fs: 15.5, r: 16 },
};

const variantMap: Record<Variant, { bg: string; fg: string; bd: string; shadow?: boolean }> = {
  primary: { bg: T.ink, fg: '#fff', bd: T.ink, shadow: true },
  accent: { bg: T.accent, fg: '#fff', bd: T.accent, shadow: true },
  secondary: { bg: T.surface, fg: T.ink, bd: T.hairlineDk },
  ghost: { bg: 'transparent', fg: T.ink, bd: 'transparent' },
  soft: { bg: T.pageAlt, fg: T.ink, bd: T.hairline },
  success: { bg: T.success, fg: '#fff', bd: T.success, shadow: true },
  danger: { bg: T.surface, fg: T.danger, bd: T.dangerSoft },
};

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  full?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Btn({
  children,
  variant = 'primary',
  size = 'md',
  leading,
  trailing,
  full,
  disabled,
  onPress,
  style,
}: Props) {
  const s = sizeMap[size];
  const v = variantMap[variant];
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          height: s.h,
          paddingHorizontal: s.px,
          borderRadius: s.r,
          backgroundColor: v.bg,
          borderWidth: 1,
          borderColor: v.bd,
          alignSelf: full ? 'stretch' : 'flex-start',
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
          opacity: disabled ? 0.5 : pressed ? 0.92 : 1,
        },
        v.shadow && !disabled ? shadows.sm : null,
        style,
      ]}
    >
      {leading}
      <Text
        style={{
          color: v.fg,
          fontSize: s.fs,
          fontWeight: '600',
          letterSpacing: -0.15,
        }}
      >
        {children}
      </Text>
      {trailing}
    </Pressable>
  );
}
