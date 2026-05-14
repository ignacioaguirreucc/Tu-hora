import React from 'react';
import { Text, View, TextInput, ViewStyle } from 'react-native';
import { T } from '@/theme';

type Props = {
  label?: string;
  value?: string;
  placeholder?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  focused?: boolean;
  secure?: boolean;
  onChangeText?: (v: string) => void;
  style?: ViewStyle;
};

export function Field({
  label,
  value,
  placeholder,
  leading,
  trailing,
  focused,
  secure,
  onChangeText,
  style,
}: Props) {
  return (
    <View style={style}>
      {label && (
        <Text
          style={{
            fontSize: 13,
            fontWeight: '500',
            color: T.ink2,
            marginBottom: 6,
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          height: 50,
          paddingHorizontal: 14,
          borderRadius: 12,
          backgroundColor: T.surface,
          borderWidth: 1,
          borderColor: focused ? T.ink : T.hairlineDk,
        }}
      >
        {leading}
        <TextInput
          style={{
            flex: 1,
            fontSize: 15,
            color: T.ink,
            letterSpacing: -0.1,
          }}
          placeholder={placeholder}
          placeholderTextColor={T.hint}
          value={value}
          secureTextEntry={secure}
          onChangeText={onChangeText}
        />
        {trailing}
      </View>
    </View>
  );
}
