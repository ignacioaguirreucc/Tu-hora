import React from 'react';
import { View, Text, ViewStyle, DimensionValue } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop, Circle } from 'react-native-svg';
import { imageTones, type ImageTone, fonts } from '@/theme';

type Props = {
  label?: string;
  width?: DimensionValue;
  height?: number;
  radius?: number;
  tone?: ImageTone;
  style?: ViewStyle;
};

export function PlaceholderImage({
  label,
  width = '100%',
  height = 160,
  radius = 16,
  tone = 'sand',
  style,
}: Props) {
  const t = imageTones[tone];
  const id = `img-${tone}`;
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: t.b,
        },
        style,
      ]}
    >
      <Svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={t.a} />
            <Stop offset="0.55" stopColor={t.b} />
            <Stop offset="1" stopColor={t.c} />
          </LinearGradient>
          <RadialGradient id={`${id}-glow`} cx="0.25" cy="0.2" r="0.7">
            <Stop offset="0" stopColor="#fff" stopOpacity="0.28" />
            <Stop offset="1" stopColor="#fff" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id={`${id}-shadow`} cx="0.85" cy="0.95" r="0.8">
            <Stop offset="0" stopColor="#000" stopOpacity="0.35" />
            <Stop offset="1" stopColor="#000" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id}-bg)`} />
        <Circle cx="80%" cy="22%" r="42" fill={t.a} opacity={0.18} />
        <Circle cx="15%" cy="78%" r="64" fill={t.c} opacity={0.22} />
        <Rect width="100%" height="100%" fill={`url(#${id}-glow)`} />
        <Rect width="100%" height="100%" fill={`url(#${id}-shadow)`} />
      </Svg>
      {!!label && (
        <Text
          style={{
            position: 'absolute',
            left: 14,
            bottom: 12,
            fontSize: 10,
            color: t.fg,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            fontWeight: '600',
            fontFamily: fonts.mono,
            opacity: 0.85,
          }}
        >
          {label}
        </Text>
      )}
    </View>
  );
}
