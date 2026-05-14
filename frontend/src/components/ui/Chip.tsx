import React from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import { T } from '@/theme';

type Props = {
  children: React.ReactNode;
  active?: boolean;
  leading?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Chip({ children, active, leading, onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          height: 34,
          paddingHorizontal: 14,
          borderRadius: 999,
          backgroundColor: active ? T.ink : T.surface,
          borderWidth: 1,
          borderColor: active ? T.ink : T.hairline,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      {leading}
      <Text
        style={{
          color: active ? '#fff' : T.ink2,
          fontSize: 13,
          fontWeight: '500',
          letterSpacing: -0.1,
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
