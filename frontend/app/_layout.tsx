import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from '@expo-google-fonts/instrument-serif';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator, Text, TextInput } from 'react-native';
import { useEffect } from 'react';
import { T, fonts } from '@/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    const TextAny = Text as unknown as { defaultProps?: Record<string, unknown> };
    const InputAny = TextInput as unknown as { defaultProps?: Record<string, unknown> };
    TextAny.defaultProps = TextAny.defaultProps || {};
    InputAny.defaultProps = InputAny.defaultProps || {};
    const existing = (TextAny.defaultProps.style as object) || {};
    const existingInput = (InputAny.defaultProps.style as object) || {};
    TextAny.defaultProps.style = [{ fontFamily: fonts.sans, color: T.ink }, existing];
    InputAny.defaultProps.style = [{ fontFamily: fonts.sans, color: T.ink }, existingInput];
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: T.page,
        }}
      >
        <ActivityIndicator color={T.ink} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: T.page },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="verification" />
          <Stack.Screen name="(client)" />
          <Stack.Screen name="(pro)" />
          <Stack.Screen name="(owner)" />
          <Stack.Screen name="pro/[id]" />
          <Stack.Screen name="booking" />
          <Stack.Screen name="confirmation" options={{ animation: 'fade' }} />
          <Stack.Screen name="points" />
          <Stack.Screen name="notifications" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
