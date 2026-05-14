import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Avatar,
  Btn,
  Card,
  Mono,
  PlaceholderImage,
  SectionHead,
} from '@/components/ui';
import { IcArrowR, IcBell, IcChevR, IcClock } from '@/components/icons';
import { T, fonts } from '@/theme';

const BARS = [42, 58, 35, 70, 48, 88, 62];
const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const REQUESTS = [
  {
    n: 'Andrés Torres',
    s: 'Odontólogo · Consultorio 2',
    when: 'Mañana · 14:00-18:00',
    p: '$13.000',
    tone: 'olive' as const,
  },
  {
    n: 'Mía Sosa',
    s: 'Esteticista · Camilla 1',
    when: 'Sáb · 09:00-13:00',
    p: '$9.500',
    tone: 'plum' as const,
  },
];

const SPACES = [
  { n: 'Sillón 1', s: 'Barbería', occ: 92, pro: 'Lucía R.', tone: 'sand' as const },
  { n: 'Sillón 2', s: 'Barbería', occ: 74, pro: 'Mateo V.', tone: 'olive' as const },
  { n: 'Camilla 1', s: 'Estética', occ: 48, pro: 'Disponible', tone: 'blush' as const },
];

export default function OwnerDashboardScreen() {
  const router = useRouter();

  const respond = (name: string, accept: boolean) =>
    Alert.alert(
      accept ? `Aceptar a ${name}` : `Rechazar a ${name}`,
      accept ? '¿Confirmás aceptar esta solicitud?' : '¿Querés rechazar esta solicitud?',
      [
        { text: 'Volver', style: 'cancel' },
        {
          text: accept ? 'Aceptar' : 'Rechazar',
          style: accept ? 'default' : 'destructive',
          onPress: () =>
            Alert.alert(
              accept ? 'Solicitud aceptada' : 'Solicitud rechazada',
              accept ? `Le avisamos a ${name}.` : `Notificamos a ${name}.`,
            ),
        },
      ],
    );

  const newSpace = () =>
    Alert.alert('Nuevo espacio', '¿Querés crear un nuevo espacio?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Continuar', onPress: () => router.push('/(owner)/spaces') },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <SafeAreaView edges={['top']}>
        <View
          style={{
            paddingTop: 4,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Pressable onPress={() => router.push('/profile')}>
            <Avatar name="Mario Cabanilla" tone="olive" size={42} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: 10.5,
                color: T.muted,
                fontWeight: '600',
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              Modo propietario
            </Text>
            <Text
              style={{
                fontFamily: fonts.sansBold,
                fontSize: 17,
                letterSpacing: -0.3,
                marginTop: 2,
              }}
            >
              Barba & Co
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
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>4</Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Revenue card - hero */}
        <View style={{ paddingHorizontal: 20, paddingTop: 22 }}>
          <Card pad={22} radius={22} elevation="md">
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <View>
                <Text
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 10.5,
                    color: T.muted,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontWeight: '600',
                  }}
                >
                  Ingresos · Esta semana
                </Text>
                <View
                  style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 8 }}
                >
                  <Mono
                    tnum
                    style={{
                      fontSize: 30,
                      fontWeight: '700',
                      letterSpacing: -0.8,
                    }}
                  >
                    $184.500
                  </Mono>
                  <Mono
                    tnum
                    style={{
                      fontSize: 12,
                      color: T.success,
                      fontWeight: '700',
                    }}
                  >
                    ↑ 12%
                  </Mono>
                </View>
              </View>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                  backgroundColor: T.ink,
                }}
              >
                <Text
                  style={{
                    fontSize: 10.5,
                    color: '#fff',
                    fontWeight: '700',
                    letterSpacing: 0.4,
                  }}
                >
                  7 DÍAS
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 7, alignItems: 'flex-end', height: 72 }}>
              {BARS.map((h, i) => (
                <View key={i} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                  <View
                    style={{
                      width: '100%',
                      height: `${h}%`,
                      borderRadius: 6,
                      backgroundColor: i === 5 ? T.accent : T.ink,
                      opacity: i === 5 ? 1 : 0.78,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 10,
                      color: i === 5 ? T.accent : T.muted,
                      fontWeight: '600',
                    }}
                  >
                    {DAYS[i]}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Pending requests */}
        <View style={{ paddingTop: 28 }}>
          <SectionHead
            title="Solicitudes pendientes"
            action="Ver todas →"
            onActionPress={() => router.push('/(owner)/requests')}
          />
          <View style={{ paddingHorizontal: 20, gap: 12 }}>
            {REQUESTS.map((r, i) => (
              <Card key={i} pad={16} radius={16} elevation="sm">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Avatar name={r.n} tone={r.tone} size={44} verified />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: fonts.sansSemi,
                        fontSize: 14.5,
                        letterSpacing: -0.2,
                      }}
                    >
                      {r.n}
                    </Text>
                    <Text style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{r.s}</Text>
                  </View>
                  <Mono tnum style={{ fontSize: 15, fontWeight: '700', letterSpacing: -0.3 }}>
                    {r.p}
                  </Mono>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 12,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: T.hairline,
                  }}
                >
                  <IcClock size={12} color={T.muted} />
                  <Text style={{ flex: 1, fontSize: 12, color: T.muted }}>{r.when}</Text>
                  <Btn variant="secondary" size="sm" onPress={() => respond(r.n, false)}>
                    Rechazar
                  </Btn>
                  <Btn variant="primary" size="sm" onPress={() => respond(r.n, true)}>
                    Aceptar
                  </Btn>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Spaces */}
        <View style={{ paddingTop: 28 }}>
          <SectionHead title="Tus espacios" action="+ Nuevo" onActionPress={newSpace} />
          <View style={{ paddingHorizontal: 20, gap: 10 }}>
            {SPACES.map((sp, i) => (
              <Pressable
                key={i}
                onPress={() => router.push('/(owner)/spaces')}
                style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.99 : 1 }] })}
              >
                <Card pad={0} radius={16} elevation="sm" style={{ overflow: 'hidden' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <PlaceholderImage width={72} height={72} radius={0} tone={sp.tone} />
                    <View style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 14 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text
                          style={{
                            fontFamily: fonts.sansBold,
                            fontSize: 14.5,
                            letterSpacing: -0.2,
                          }}
                        >
                          {sp.n}
                        </Text>
                        <Text style={{ fontSize: 11, color: T.muted }}>· {sp.s}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                          marginTop: 8,
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            height: 4,
                            backgroundColor: T.pageAlt,
                            borderRadius: 999,
                            overflow: 'hidden',
                          }}
                        >
                          <View
                            style={{
                              width: `${sp.occ}%`,
                              height: '100%',
                              backgroundColor:
                                sp.occ > 80 ? T.success : sp.occ > 60 ? T.accent : T.warning,
                              borderRadius: 999,
                            }}
                          />
                        </View>
                        <Mono tnum style={{ fontSize: 11.5, fontWeight: '700' }}>
                          {sp.occ}%
                        </Mono>
                      </View>
                      <Text style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
                        Hoy · {sp.pro}
                      </Text>
                    </View>
                    <View style={{ paddingRight: 14 }}>
                      <IcChevR size={16} color={T.muted} />
                    </View>
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
