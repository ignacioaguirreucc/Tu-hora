import React from 'react';
import { Text, View } from 'react-native';
import { T, avatarPalettes, type AvatarTone } from '@/theme';
import { IcCheck } from '@/components/icons';

type Props = {
  name?: string;
  size?: number;
  tone?: AvatarTone;
  verified?: boolean;
  radius?: number;
};

export function Avatar({ name = '', size = 44, tone = 'ink', verified, radius }: Props) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
  const palette = avatarPalettes[tone];
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius ?? size / 2,
        backgroundColor: palette.bg,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Text
        style={{
          color: palette.fg,
          fontWeight: '600',
          fontSize: size * 0.36,
          letterSpacing: -0.2,
        }}
      >
        {initials}
      </Text>
      {verified && (
        <View
          style={{
            position: 'absolute',
            bottom: -1,
            right: -1,
            width: size * 0.34,
            height: size * 0.34,
            borderRadius: 999,
            backgroundColor: T.info,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: T.surface,
          }}
        >
          <IcCheck size={size * 0.2} color="#fff" strokeWidth={2.5} />
        </View>
      )}
    </View>
  );
}
