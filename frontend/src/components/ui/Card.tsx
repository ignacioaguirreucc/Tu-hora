import React from 'react';
import { View, ViewStyle } from 'react-native';
import { T, shadows } from '@/theme';

type Elevation = 'none' | 'sm' | 'md' | 'lg';

type Props = {
  children: React.ReactNode;
  pad?: number;
  radius?: number;
  accent?: string;
  bg?: string;
  elevation?: Elevation;
  bordered?: boolean;
  style?: ViewStyle;
};

export function Card({
  children,
  pad = 16,
  radius = 18,
  accent,
  bg = T.surface,
  elevation = 'sm',
  bordered = true,
  style,
}: Props) {
  const shadow = elevation === 'none' ? {} : shadows[elevation];
  return (
    <View
      style={[
        {
          backgroundColor: bg,
          borderWidth: bordered ? 1 : 0,
          borderColor: T.hairline,
          borderRadius: radius,
          padding: pad,
          position: 'relative',
        },
        shadow,
        style,
      ]}
    >
      {accent && (
        <View
          style={{
            position: 'absolute',
            top: 16,
            bottom: 16,
            left: 0,
            width: 3,
            borderRadius: 999,
            backgroundColor: accent,
          }}
        />
      )}
      {children}
    </View>
  );
}
