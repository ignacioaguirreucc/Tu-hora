import React from 'react';
import { Text, TextStyle } from 'react-native';
import { fonts, T } from '@/theme';

type Props = {
  children: React.ReactNode;
  size?: number;
  italic?: boolean;
  color?: string;
  style?: TextStyle;
};

export function Serif({ children, size = 28, italic, color = T.ink, style }: Props) {
  return (
    <Text
      style={[
        {
          fontFamily: italic ? fonts.serifItalic : fonts.serif,
          fontSize: size,
          color,
          lineHeight: size * 1.05,
          letterSpacing: -0.6,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
