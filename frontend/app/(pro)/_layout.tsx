import { Tabs } from 'expo-router';
import { IcCal, IcHome, IcMap, IcUser } from '@/components/icons';
import { T, fonts } from '@/theme';

export default function ProLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: T.ink,
        tabBarInactiveTintColor: T.hint,
        tabBarStyle: {
          backgroundColor: T.surface,
          borderTopColor: T.hairline,
          borderTopWidth: 1,
          height: 86,
          paddingTop: 10,
          paddingBottom: 28,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.sansSemi,
          fontSize: 10.5,
          letterSpacing: 0.1,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <IcHome size={22} color={color} strokeWidth={focused ? 2.2 : 1.7} />
          ),
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, focused }) => (
            <IcCal size={22} color={color} strokeWidth={focused ? 2.2 : 1.7} />
          ),
        }}
      />
      <Tabs.Screen
        name="spaces"
        options={{
          title: 'Espacios',
          tabBarIcon: ({ color, focused }) => (
            <IcMap size={22} color={color} strokeWidth={focused ? 2.2 : 1.7} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <IcUser size={22} color={color} strokeWidth={focused ? 2.2 : 1.7} />
          ),
        }}
      />
    </Tabs>
  );
}
