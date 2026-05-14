import React from 'react';
import { Text, TextStyle } from 'react-native';
import { T, fonts } from '@/theme';

type Props = {
  children: React.ReactNode;
  color?: string;
  style?: TextStyle;
};

export function Eyebrow({ children, color = T.muted, style }: Props) {
  return (
    <Text
      style={[
        {
          fontFamily: fonts.mono,
          fontSize: 10.5,
          color,
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontWeight: '600',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
