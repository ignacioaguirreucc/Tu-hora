import { useRouter } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, PlaceholderImage, Serif } from '@/components/ui';
import { IcArrowR } from '@/components/icons';
import { T, fonts } from '@/theme';

function Logo({ size = 28, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.28,
          backgroundColor: dark ? '#fff' : T.ink,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: size * 0.08,
            height: size * 0.42,
            backgroundColor: dark ? T.ink : '#fff',
            borderRadius: 999,
            transform: [{ translateY: -size * 0.04 }],
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: size * 0.5,
            left: size * 0.5,
            width: size * 0.32,
            height: size * 0.08,
            backgroundColor: T.accent,
            borderRadius: 999,
            transform: [{ translateX: -size * 0.04 }, { translateY: -size * 0.04 }],
          }}
        />
      </View>
      <Text
        style={{
          fontSize: size * 0.55,
          fontWeight: '700',
          letterSpacing: -0.4,
          color: dark ? '#fff' : T.ink,
        }}
      >
        TuHora
      </Text>
    </View>
  );
}

export default function Onboarding() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      {/* Hero image full width */}
      <View style={{ position: 'relative' }}>
        <PlaceholderImage tone="ink" height={520} radius={0} />
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'transparent',
          }}
        />
        <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <View
            style={{
              paddingHorizontal: 24,
              paddingTop: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Logo size={26} dark />
            <Pressable
              onPress={() => router.replace('/(client)/home')}
              hitSlop={10}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.2)',
              }}
            >
              <Text style={{ fontSize: 12.5, color: '#fff', fontWeight: '500' }}>Saltar</Text>
            </Pressable>
          </View>
        </SafeAreaView>

        {/* Floating chip on hero */}
        <View
          style={{
            position: 'absolute',
            bottom: 28,
            left: 24,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 999,
            backgroundColor: 'rgba(255,255,255,0.14)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.22)',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              backgroundColor: T.accent,
            }}
          />
          <Text
            style={{
              fontSize: 11,
              color: '#fff',
              fontFamily: fonts.mono,
              fontWeight: '500',
              letterSpacing: 0.6,
              textTransform: 'uppercase',
            }}
          >
            Nuevo · v2.0
          </Text>
        </View>
      </View>

      {/* Content sheet */}
      <View
        style={{
          flex: 1,
          marginTop: -32,
          backgroundColor: T.page,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingHorizontal: 28,
          paddingTop: 32,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontFamily: fonts.mono,
            color: T.muted,
            letterSpacing: 1,
            textTransform: 'uppercase',
            fontWeight: '600',
          }}
        >
          La red de profesionales
        </Text>

        <Serif size={40} style={{ marginTop: 14, lineHeight: 44 }}>
          Reservá con{'\n'}quien querés,{'\n'}
          <Serif size={40} italic>
            donde querés.
          </Serif>
        </Serif>

        <Text
          style={{
            fontSize: 15,
            color: T.muted,
            marginTop: 16,
            lineHeight: 23,
            letterSpacing: -0.1,
          }}
        >
          Barberos, dentistas, esteticistas y más. Un solo lugar para encontrar al profesional perfecto.
        </Text>

        {/* Bottom row */}
        <View
          style={{
            position: 'absolute',
            left: 28,
            right: 28,
            bottom: 36,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <View style={{ width: 28, height: 6, borderRadius: 999, backgroundColor: T.ink }} />
            <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: T.hairlineDk }} />
            <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: T.hairlineDk }} />
          </View>
          <Btn
            variant="primary"
            size="lg"
            trailing={<IcArrowR size={18} color="#fff" />}
            onPress={() => router.push('/auth')}
          >
            Empezar
          </Btn>
        </View>
      </View>
    </View>
  );
}
