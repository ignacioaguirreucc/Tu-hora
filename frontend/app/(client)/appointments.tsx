import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar, Avatar, Btn, Card, Mono } from '@/components/ui';
import { IcPin } from '@/components/icons';
import { T, fonts } from '@/theme';

const UPCOMING = [
  {
    id: '1',
    proId: 'lr',
    date: 'MIÉ 14 MAY',
    time: '10:30',
    proName: 'Lucía Romero',
    proTone: 'ink' as const,
    service: 'Corte + Barba',
    location: 'Barba & Co · Palermo',
    status: 'confirmado',
    price: 8200,
  },
  {
    id: '2',
    proId: 'at',
    date: 'VIE 16 MAY',
    time: '14:00',
    proName: 'Andrés Torres',
    proTone: 'olive' as const,
    service: 'Limpieza dental',
    location: 'Clínica Norte · Belgrano',
    status: 'pendiente',
    price: 13000,
  },
];

const PAST_DATA = [
  {
    id: '3',
    proId: 'ms',
    date: '02 MAY',
    proName: 'Mía Sosa',
    proTone: 'plum' as const,
    service: 'Limpieza facial',
    price: 9500,
    rated: true,
  },
  {
    id: '4',
    proId: 'lr',
    date: '28 ABR',
    proName: 'Lucía Romero',
    proTone: 'ink' as const,
    service: 'Corte cabello',
    price: 5500,
    rated: false,
  },
];

export default function AppointmentsScreen() {
  const router = useRouter();
  const [past, setPast] = useState(PAST_DATA);

  const handleReview = (id: string, proName: string) => {
    Alert.alert(`Reseña para ${proName}`, '¿Cómo estuvo tu experiencia?', [
      { text: 'Más tarde', style: 'cancel' },
      {
        text: 'Calificar 5★',
        onPress: () => {
          setPast((items) => items.map((a) => (a.id === id ? { ...a, rated: true } : a)));
          Alert.alert('¡Gracias!', 'Tu reseña fue publicada · +15 puntos');
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <SafeAreaView edges={['top']}>
        <AppBar title="Tus turnos" sub={`${UPCOMING.length} próximos`} large />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={{ paddingHorizontal: 20, paddingBottom: 18 }}>
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 10.5,
              color: T.muted,
              fontWeight: '600',
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginBottom: 12,
              paddingHorizontal: 4,
            }}
          >
            Próximos
          </Text>

          <View style={{ gap: 12 }}>
            {UPCOMING.map((a) => (
              <Pressable
                key={a.id}
                onPress={() => router.push(`/pro/${a.proId}`)}
                style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.99 : 1 }] })}
              >
                <Card pad={0} radius={18} elevation="md" style={{ overflow: 'hidden' }}>
                  <View
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: T.pageAlt,
                    }}
                  >
                    <Mono tnum style={{ fontSize: 12, fontWeight: '700', letterSpacing: 0.2 }}>
                      {a.date} · {a.time} HS
                    </Mono>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 999,
                        backgroundColor: a.status === 'confirmado' ? T.successSoft : T.warningSoft,
                      }}
                    >
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 999,
                          backgroundColor: a.status === 'confirmado' ? T.success : T.warning,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 10.5,
                          color: a.status === 'confirmado' ? T.success : T.warning,
                          fontWeight: '700',
                          letterSpacing: 0.3,
                          textTransform: 'uppercase',
                        }}
                      >
                        {a.status}
                      </Text>
                    </View>
                  </View>
                  <View style={{ padding: 16, flexDirection: 'row', gap: 14 }}>
                    <Avatar name={a.proName} tone={a.proTone} size={48} verified />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: fonts.sansBold,
                          fontSize: 15,
                          letterSpacing: -0.2,
                        }}
                      >
                        {a.proName}
                      </Text>
                      <Text style={{ fontSize: 12.5, color: T.muted, marginTop: 3 }}>
                        {a.service}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                          marginTop: 5,
                        }}
                      >
                        <IcPin size={11} color={T.muted} />
                        <Text style={{ fontSize: 11.5, color: T.muted }}>{a.location}</Text>
                      </View>
                    </View>
                    <Mono tnum style={{ fontSize: 15, fontWeight: '700', letterSpacing: -0.3 }}>
                      ${a.price.toLocaleString('es-AR')}
                    </Mono>
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 10.5,
              color: T.muted,
              fontWeight: '600',
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginBottom: 12,
              paddingHorizontal: 4,
            }}
          >
            Historial
          </Text>
          <Card pad={0} radius={16} elevation="sm">
            {past.map((a, i) => (
              <Pressable
                key={a.id}
                onPress={() => router.push(`/pro/${a.proId}`)}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  padding: 16,
                  borderBottomWidth: i < past.length - 1 ? 1 : 0,
                  borderBottomColor: T.hairline,
                  backgroundColor: pressed ? T.pageAlt : 'transparent',
                })}
              >
                <Avatar name={a.proName} tone={a.proTone} size={40} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: fonts.sansSemi,
                      fontSize: 13.5,
                      letterSpacing: -0.15,
                    }}
                  >
                    {a.service}
                  </Text>
                  <Text style={{ fontSize: 11.5, color: T.muted, marginTop: 3 }}>
                    {a.proName} · {a.date} · ${a.price.toLocaleString('es-AR')}
                  </Text>
                </View>
                {!a.rated && (
                  <Btn variant="secondary" size="sm" onPress={() => handleReview(a.id, a.proName)}>
                    Reseñar
                  </Btn>
                )}
              </Pressable>
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
