import React from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import { T } from '@/theme';
import type { IconComponent } from '@/components/icons';

type Variant = 'ghost' | 'solid' | 'dark';

const variants: Record<Variant, { bg: string; bd: string; color: string }> = {
  ghost: { bg: 'transparent', bd: T.hairline, color: T.ink },
  solid: { bg: T.surface, bd: T.hairline, color: T.ink },
  dark: { bg: T.ink, bd: T.ink, color: '#fff' },
};

type Props = {
  icon: IconComponent;
  size?: number;
  badge?: string | number;
  onPress?: () => void;
  variant?: Variant;
  style?: ViewStyle;
};

export function IconBtn({ icon: I, size = 36, badge, onPress, variant = 'ghost', style }: Props) {
  const v = variants[variant];
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          width: size,
          height: size,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: v.bg,
          borderWidth: 1,
          borderColor: v.bd,
        },
        style,
      ]}
    >
      <I size={18} color={v.color} />
      {badge != null && (
        <View
          style={{
            position: 'absolute',
            top: -3,
            right: -3,
            minWidth: 16,
            height: 16,
            paddingHorizontal: 4,
            borderRadius: 999,
            backgroundColor: T.accent,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: T.page,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>{badge}</Text>
        </View>
      )}
    </Pressable>
  );
}
