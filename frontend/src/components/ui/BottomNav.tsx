import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { T } from '@/theme';
import type { IconComponent } from '@/components/icons';

export type NavItem = {
  label: string;
  icon: IconComponent;
};

type Props = {
  items: NavItem[];
  active?: number;
  onChange?: (index: number) => void;
};

export function BottomNav({ items, active = 0, onChange }: Props) {
  return (
    <BlurView
      intensity={80}
      tint="light"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: 28,
        paddingTop: 8,
        paddingHorizontal: 8,
        borderTopWidth: 1,
        borderTopColor: T.hairline,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 10,
      }}
    >
      {items.map((item, i) => {
        const I = item.icon;
        const on = i === active;
        return (
          <Pressable
            key={i}
            onPress={() => onChange?.(i)}
            style={{
              flex: 1,
              alignItems: 'center',
              gap: 4,
              paddingVertical: 6,
            }}
          >
            <I size={22} color={on ? T.ink : T.hint} strokeWidth={on ? 2 : 1.6} />
            <Text
              style={{
                fontSize: 10.5,
                fontWeight: on ? '600' : '500',
                color: on ? T.ink : T.muted,
                letterSpacing: -0.05,
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </BlurView>
  );
}
