import { Alert, View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Avatar,
  Btn,
  Card,
  Mono,
  Pill,
  PlaceholderImage,
  SectionHead,
  Serif,
} from '@/components/ui';
import {
  IcArrowR,
  IcBell,
  IcCal,
  IcClock,
  IcGift,
  IcHeart,
  IcMore,
  IcPin,
  IcSearch,
  IcSparkle,
  IcStarFill,
  type IconComponent,
} from '@/components/icons';
import { T, fonts, shadows } from '@/theme';
import { CURRENT_USER, PROS } from '@/data/mock';

export default function HomeScreen() {
  const router = useRouter();

  const handleCancel = () => {
    Alert.alert('Cancelar turno', '¿Querés cancelar tu turno con Lucía Romero?', [
      { text: 'Volver', style: 'cancel' },
      {
        text: 'Cancelar turno',
        style: 'destructive',
        onPress: () => Alert.alert('Turno cancelado', 'Te enviamos el comprobante a tu email.'),
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <SafeAreaView edges={['top']}>
        {/* Header */}
        <View
          style={{
            paddingTop: 4,
            paddingHorizontal: 20,
            paddingBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Pressable onPress={() => router.push('/(client)/profile')}>
            <Avatar name={CURRENT_USER.name} tone="ink" size={42} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 11,
                color: T.muted,
                fontFamily: fonts.mono,
                letterSpacing: 0.6,
                textTransform: 'uppercase',
                fontWeight: '600',
              }}
            >
              Buen día
            </Text>
            <Text style={{ fontSize: 17, fontWeight: '600', letterSpacing: -0.3, marginTop: 2 }}>
              {CURRENT_USER.name.split(' ')[0]} 👋
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/notifications')}
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: T.surface,
              borderWidth: 1,
              borderColor: T.hairline,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <IcBell size={19} color={T.ink} />
            <View
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                minWidth: 18,
                height: 18,
                paddingHorizontal: 5,
                borderRadius: 999,
                backgroundColor: T.accent,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: T.page,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>3</Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Hero greeting */}
        <View style={{ paddingHorizontal: 20, paddingTop: 18 }}>
          <Serif size={36} style={{ lineHeight: 40, letterSpacing: -0.6 }}>
            ¿Con quién{'\n'}reservás{' '}
            <Serif size={36} italic>
              hoy?
            </Serif>
          </Serif>
        </View>

        {/* Search */}
        <Pressable
          onPress={() => router.push('/(client)/search')}
          style={({ pressed }) => [
            {
              marginHorizontal: 20,
              marginTop: 22,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              height: 56,
              paddingHorizontal: 16,
              borderRadius: 16,
              backgroundColor: T.surface,
              borderWidth: 1,
              borderColor: T.hairline,
              opacity: pressed ? 0.9 : 1,
            },
            shadows.sm,
          ]}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              backgroundColor: T.pageAlt,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IcSearch size={16} color={T.ink} />
          </View>
          <Text style={{ flex: 1, fontSize: 14.5, color: T.hint, letterSpacing: -0.1 }}>
            Barbero, dentista, esteticista…
          </Text>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 999,
              backgroundColor: T.ink,
            }}
          >
            <Text style={{ fontSize: 11, color: '#fff', fontWeight: '600', letterSpacing: 0.2 }}>
              ⌘ K
            </Text>
          </View>
        </Pressable>

        {/* Quick actions */}
        <View style={{ paddingHorizontal: 20, paddingTop: 18 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {(
              [
                { i: IcCal, l: 'Reservar', tone: T.ink, go: () => router.push('/(client)/search') },
                {
                  i: IcClock,
                  l: 'Turnos',
                  tone: '#3F4A2E',
                  go: () => router.push('/(client)/appointments'),
                },
                {
                  i: IcHeart,
                  l: 'Favoritos',
                  tone: '#A1664A',
                  go: () => Alert.alert('Favoritos', 'Acá vas a ver tus profesionales favoritos.'),
                },
                { i: IcGift, l: 'Puntos', tone: T.accent, go: () => router.push('/points') },
              ] as { i: IconComponent; l: string; tone: string; go: () => void }[]
            ).map((a, i) => (
              <Pressable
                key={i}
                onPress={a.go}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    paddingVertical: 16,
                    paddingHorizontal: 10,
                    borderRadius: 16,
                    backgroundColor: T.surface,
                    borderWidth: 1,
                    borderColor: T.hairline,
                    alignItems: 'center',
                    gap: 10,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                  shadows.sm,
                ]}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: a.tone,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <a.i size={18} color="#fff" />
                </View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: T.ink, letterSpacing: -0.15 }}>
                  {a.l}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Next appointment - featured card */}
        <View style={{ paddingHorizontal: 20, paddingTop: 28 }}>
          <SectionHead
            title="Tu próximo turno"
            action="Ver todos →"
            onActionPress={() => router.push('/(client)/appointments')}
            style={{ paddingHorizontal: 0, marginBottom: 12 }}
          />

          <Card pad={0} radius={20} elevation="md" style={{ overflow: 'hidden' }}>
            {/* Image header */}
            <View style={{ position: 'relative' }}>
              <PlaceholderImage tone="ink" height={120} radius={0} />
              <View
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  right: 14,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 999,
                    backgroundColor: T.accent,
                  }}
                >
                  <Text style={{ fontSize: 10.5, color: '#fff', fontWeight: '700', letterSpacing: 0.4 }}>
                    EN 2 DÍAS
                  </Text>
                </View>
                <Pressable
                  hitSlop={8}
                  onPress={() =>
                    Alert.alert('Opciones del turno', undefined, [
                      { text: 'Reagendar', onPress: () => router.push('/booking?proId=lr') },
                      { text: 'Compartir' },
                      { text: 'Cancelar turno', style: 'destructive', onPress: handleCancel },
                      { text: 'Cerrar', style: 'cancel' },
                    ])
                  }
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.25)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IcMore size={15} color="#fff" />
                </Pressable>
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: 14,
                  left: 14,
                }}
              >
                <Mono
                  tnum
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: '600',
                    letterSpacing: 0.6,
                  }}
                >
                  MIÉ 14 MAY · 10:30 HS
                </Mono>
              </View>
            </View>

            <Pressable onPress={() => router.push('/pro/lr')}>
              <View style={{ padding: 18, flexDirection: 'row', gap: 14 }}>
                <Avatar name="Lucía Romero" tone="ink" size={56} verified />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', letterSpacing: -0.3 }}>
                    Lucía Romero
                  </Text>
                  <Text style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>
                    Corte + Barba · 45 min
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      marginTop: 8,
                    }}
                  >
                    <IcPin size={12} color={T.muted} />
                    <Text style={{ fontSize: 12, color: T.muted }}>
                      Barba & Co · Palermo, 1.2 km
                    </Text>
                  </View>
                </View>
                <Mono tnum style={{ fontSize: 16, fontWeight: '700', letterSpacing: -0.3 }}>
                  $8.200
                </Mono>
              </View>
            </Pressable>

            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                padding: 18,
                paddingTop: 0,
              }}
            >
              <Btn
                variant="secondary"
                size="md"
                full
                style={{ flex: 1 }}
                onPress={handleCancel}
              >
                Cancelar
              </Btn>
              <Btn
                variant="primary"
                size="md"
                full
                style={{ flex: 1.4 }}
                onPress={() => router.push('/pro/lr')}
                trailing={<IcArrowR size={14} color="#fff" />}
              >
                Ver detalle
              </Btn>
            </View>
          </Card>
        </View>

        {/* Pros carousel */}
        <View style={{ marginTop: 28 }}>
          <SectionHead
            title="Tus profesionales"
            action="Ver todos →"
            onActionPress={() => router.push('/(client)/search')}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingBottom: 4 }}>
              {PROS.slice(0, 4).map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => router.push(`/pro/${p.id}`)}
                  style={({ pressed }) => ({
                    width: 180,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  })}
                >
                  <Card pad={0} radius={18} elevation="md" style={{ overflow: 'hidden' }}>
                    <PlaceholderImage tone={p.tone === 'ink' ? 'ink' : p.tone === 'olive' ? 'olive' : 'blush'} height={140} radius={0} />
                    <View style={{ padding: 14 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '700',
                          letterSpacing: -0.2,
                        }}
                      >
                        {p.name}
                      </Text>
                      <Text style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>
                        {p.spec} · {p.distance}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 10,
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <IcStarFill size={11} />
                          <Mono tnum style={{ fontSize: 11.5, fontWeight: '700' }}>
                            {p.rating}
                          </Mono>
                          <Text style={{ fontSize: 10.5, color: T.muted }}>
                            ({p.reviews})
                          </Text>
                        </View>
                        <Mono
                          tnum
                          style={{
                            fontSize: 11.5,
                            fontWeight: '700',
                            color: T.ink,
                          }}
                        >
                          ${(p.basePrice / 1000).toFixed(1)}k
                        </Mono>
                      </View>
                    </View>
                  </Card>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Points card - premium */}
        <View style={{ paddingHorizontal: 20, paddingTop: 28 }}>
          <Card
            pad={0}
            radius={22}
            bg={T.ink}
            elevation="lg"
            bordered={false}
            style={{ overflow: 'hidden' }}
          >
            {/* Decorative glow */}
            <View
              style={{
                position: 'absolute',
                top: -60,
                right: -40,
                width: 200,
                height: 200,
                borderRadius: 999,
                backgroundColor: T.accent,
                opacity: 0.18,
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: -40,
                left: -30,
                width: 140,
                height: 140,
                borderRadius: 999,
                backgroundColor: T.accent,
                opacity: 0.08,
              }}
            />

            <View style={{ padding: 22 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: fonts.mono,
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: '600',
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                    }}
                  >
                    TuHora Rewards
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
                    <Mono
                      tnum
                      style={{
                        fontSize: 52,
                        fontWeight: '700',
                        letterSpacing: -2,
                        lineHeight: 56,
                        color: '#fff',
                      }}
                    >
                      {CURRENT_USER.points}
                    </Mono>
                    <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>
                      pts
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: T.accent,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IcSparkle size={22} color="#fff" />
                </View>
              </View>

              <View style={{ marginTop: 18 }}>
                <View
                  style={{
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <View style={{ width: '68%', height: '100%', backgroundColor: T.accent, borderRadius: 999 }} />
                </View>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}
                >
                  <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
                    160 pts → 20% OFF
                  </Text>
                  <Mono tnum style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>
                    500 pts
                  </Mono>
                </View>
              </View>

              <Btn
                variant="accent"
                size="md"
                full
                style={{ marginTop: 18 }}
                onPress={() => router.push('/points')}
                trailing={<IcArrowR size={14} color="#fff" />}
                leading={<IcSparkle size={14} color="#fff" />}
              >
                Girar la ruleta
              </Btn>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
