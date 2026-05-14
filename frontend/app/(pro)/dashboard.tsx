import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Avatar,
  Card,
  Mono,
  Pill,
  SectionHead,
} from '@/components/ui';
import { IcArrowR, IcBell, IcCheck } from '@/components/icons';
import { T, fonts, shadows } from '@/theme';
import { PRO_AGENDA } from '@/data/mock';

const KPIS = [
  { l: 'Ocupación', v: '82%', d: '+6%', up: true },
  { l: 'Ingresos sem.', v: '$184k', d: '+12%', up: true },
  { l: 'Cancelados', v: '2', d: '−1', up: true },
];

export default function ProDashboardScreen() {
  const router = useRouter();
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
          <Pressable onPress={() => router.push('/(pro)/profile')}>
            <Avatar name="Lucía Romero" tone="ink" size={42} verified />
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
              Modo profesional
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 17,
                  letterSpacing: -0.3,
                }}
              >
                Lucía Romero
              </Text>
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  backgroundColor: T.success,
                }}
              />
            </View>
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
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>2</Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Hero card */}
        <View style={{ paddingHorizontal: 20, paddingTop: 22 }}>
          <Card
            pad={22}
            radius={22}
            bg={T.ink}
            elevation="lg"
            bordered={false}
            style={{ overflow: 'hidden' }}
          >
            <View
              style={{
                position: 'absolute',
                top: -60,
                right: -50,
                width: 220,
                height: 220,
                borderRadius: 999,
                backgroundColor: T.accent,
                opacity: 0.18,
              }}
            />
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: 10.5,
                color: 'rgba(255,255,255,0.6)',
                fontWeight: '600',
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              Hoy · {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
              <Mono
                tnum
                style={{
                  fontSize: 48,
                  fontWeight: '700',
                  color: '#fff',
                  letterSpacing: -1.5,
                  lineHeight: 50,
                }}
              >
                5
              </Mono>
              <Text
                style={{
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: '500',
                }}
              >
                turnos
              </Text>
              <View style={{ flex: 1 }} />
              <Mono
                tnum
                style={{
                  fontSize: 22,
                  fontWeight: '700',
                  color: '#fff',
                  letterSpacing: -0.5,
                }}
              >
                $42.5k
              </Mono>
            </View>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 6 }}>
              Ingresos estimados del día
            </Text>
          </Card>
        </View>

        {/* KPIs */}
        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {KPIS.map((k, i) => (
              <Card key={i} pad={14} radius={16} style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 9.5,
                    color: T.muted,
                    textTransform: 'uppercase',
                    letterSpacing: 0.6,
                    fontWeight: '600',
                  }}
                >
                  {k.l}
                </Text>
                <Mono
                  tnum
                  style={{
                    fontSize: 22,
                    fontWeight: '700',
                    letterSpacing: -0.4,
                    marginTop: 6,
                  }}
                >
                  {k.v}
                </Mono>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 3,
                    marginTop: 4,
                  }}
                >
                  <Mono
                    tnum
                    style={{
                      fontSize: 11,
                      color: T.success,
                      fontWeight: '700',
                    }}
                  >
                    ↑ {k.d}
                  </Mono>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Agenda */}
        <View style={{ paddingTop: 28 }}>
          <SectionHead
            title="Tu agenda · Hoy"
            action="Ver semana →"
            onActionPress={() => router.push('/(pro)/agenda')}
          />
          <View style={{ paddingHorizontal: 20, gap: 10 }}>
            {PRO_AGENDA.map((a) => {
              const isNext = a.status === 'next';
              const done = a.status === 'done';
              return (
                <Pressable key={a.id} onPress={() => router.push('/(pro)/agenda')}>
                  <Card
                    pad={0}
                    radius={16}
                    bg={isNext ? T.ink : T.surface}
                    elevation={isNext ? 'md' : 'sm'}
                    bordered={!isNext}
                    style={{
                      overflow: 'hidden',
                      opacity: done ? 0.55 : 1,
                      flexDirection: 'row',
                    }}
                  >
                    <View
                      style={{
                        width: 78,
                        paddingVertical: 16,
                        paddingHorizontal: 10,
                        alignItems: 'center',
                        backgroundColor: isNext ? 'rgba(255,255,255,0.04)' : T.pageAlt,
                      }}
                    >
                      <Mono
                        tnum
                        style={{
                          fontSize: 18,
                          fontWeight: '700',
                          letterSpacing: -0.3,
                          color: isNext ? '#fff' : T.ink,
                        }}
                      >
                        {a.time}
                      </Mono>
                      <Text
                        style={{
                          fontSize: 10.5,
                          color: isNext ? 'rgba(255,255,255,0.55)' : T.muted,
                          marginTop: 3,
                          fontWeight: '500',
                        }}
                      >
                        {a.duration} min
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        paddingVertical: 14,
                        paddingHorizontal: 14,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <Avatar name={a.client} tone={isNext ? 'accent' : 'soft'} size={38} />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontFamily: fonts.sansSemi,
                            fontSize: 14,
                            color: isNext ? '#fff' : T.ink,
                            letterSpacing: -0.2,
                          }}
                        >
                          {a.client}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11.5,
                            color: isNext ? 'rgba(255,255,255,0.65)' : T.muted,
                            marginTop: 2,
                          }}
                        >
                          {a.service} · {a.location}
                        </Text>
                      </View>
                      {done && (
                        <View
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 999,
                            backgroundColor: T.successSoft,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IcCheck size={13} color={T.success} strokeWidth={2.5} />
                        </View>
                      )}
                      {isNext && (
                        <View
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 999,
                            backgroundColor: T.accent,
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
                            PRÓXIMO
                          </Text>
                        </View>
                      )}
                    </View>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
