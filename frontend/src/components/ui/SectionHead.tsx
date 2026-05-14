import React from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import { T, fonts } from '@/theme';

type Props = {
  title: string;
  action?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
};

export function SectionHead({ title, action, onActionPress, style }: Props) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginBottom: 14,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontFamily: fonts.sansBold,
          fontSize: 17,
          letterSpacing: -0.3,
          color: T.ink,
        }}
      >
        {title}
      </Text>
      {action && (
        <Pressable onPress={onActionPress} hitSlop={6}>
          <Text style={{ fontSize: 13, color: T.ink, fontWeight: '600', letterSpacing: -0.1 }}>
            {action}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
