import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { T, fonts } from '@/theme';

type Props = {
  title: string;
  sub?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  large?: boolean;
  style?: ViewStyle;
};

export function AppBar({ title, sub, left, right, large, style }: Props) {
  return (
    <View
      style={[
        {
          paddingTop: 6,
          paddingBottom: 16,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: large ? 'flex-start' : 'center',
          gap: 12,
        },
        style,
      ]}
    >
      {left}
      <View style={{ flex: 1 }}>
        {sub && (
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 10.5,
              color: T.muted,
              marginBottom: 4,
              letterSpacing: 1,
              textTransform: 'uppercase',
              fontWeight: '600',
            }}
          >
            {sub}
          </Text>
        )}
        <Text
          style={{
            fontFamily: fonts.sansBold,
            fontSize: large ? 28 : 22,
            letterSpacing: -0.5,
            color: T.ink,
            lineHeight: large ? 32 : 26,
          }}
        >
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}
