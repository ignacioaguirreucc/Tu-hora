import React from 'react';
import { Text, TextStyle } from 'react-native';
import { fonts } from '@/theme';

type Props = {
  children: React.ReactNode;
  tnum?: boolean;
  style?: TextStyle;
};

export function Mono({ children, tnum, style }: Props) {
  return (
    <Text
      style={[
        {
          fontFamily: fonts.mono,
          fontVariant: tnum ? ['tabular-nums'] : undefined,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
