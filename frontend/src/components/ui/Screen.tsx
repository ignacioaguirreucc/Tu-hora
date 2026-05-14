import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { T } from '@/theme';

type Props = {
  children: React.ReactNode;
  bg?: string;
  padTop?: number;
  padBottom?: number;
  navHeight?: number;
  style?: ViewStyle;
  scroll?: boolean;
};

export function Screen({
  children,
  bg = T.page,
  padTop = 54,
  padBottom = 34,
  navHeight = 0,
  style,
  scroll = true,
}: Props) {
  const content = (
    <View style={{ paddingTop: padTop, paddingBottom: padBottom + navHeight }}>
      {children}
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: bg }, style]}>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
  },
});
