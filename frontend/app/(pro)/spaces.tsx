import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppBar,
  Btn,
  Card,
  Chip,
  IconBtn,
  Mono,
  PlaceholderImage,
} from '@/components/ui';
import { IcArrowR, IcMap, IcPin, IcStarFill } from '@/components/icons';
import { T, fonts } from '@/theme';
import { SPACES } from '@/data/mock';

const FILTERS = ['Hoy', 'Esta semana', '5 km', 'Barbería'] as const;
type SpaceFilter = (typeof FILTERS)[number];

export default function ProSpacesScreen() {
  const [filter, setFilter] = useState<SpaceFilter>('Hoy');

  const requestSpace = (name: string) =>
    Alert.alert(
      `Solicitar ${name}`,
      'Vamos a enviar tu solicitud al propietario del espacio.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar solicitud',
          onPress: () =>
            Alert.alert('Solicitud enviada', 'Te avisamos cuando responda el propietario.'),
        },
      ],
    );

  const openMap = () => Alert.alert('Vista de mapa', 'Próximamente vas a ver los espacios en un mapa.');

  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <SafeAreaView edges={['top']}>
        <AppBar
          title="Espacios"
          sub="Para alquilar"
          large
          right={<IconBtn icon={IcMap} onPress={openMap} />}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingBottom: 16 }}
        >
          {FILTERS.map((f) => (
            <Chip
              key={f}
              active={filter === f}
              onPress={() => setFilter(f)}
              leading={f === '5 km' ? <IcPin size={12} color={filter === f ? '#fff' : T.muted} /> : undefined}
            >
              {f}
            </Chip>
          ))}
        </ScrollView>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          {SPACES.map((s) => (
            <Card key={s.id} pad={0} radius={18} elevation="md" style={{ overflow: 'hidden' }}>
              <View style={{ position: 'relative' }}>
                <PlaceholderImage label={s.name.toLowerCase()} height={150} radius={0} tone={s.image} />
                <View
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 999,
                    backgroundColor: s.open ? 'rgba(255,255,255,0.95)' : T.warningSoft,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      backgroundColor: s.open ? T.success : T.warning,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 10.5,
                      fontWeight: '700',
                      color: s.open ? T.ink : T.warning,
                      letterSpacing: 0.3,
                      textTransform: 'uppercase',
                    }}
                  >
                    {s.open ? 'Disponible' : 'Solo jueves'}
                  </Text>
                </View>
              </View>
              <View style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: fonts.sansBold,
                        fontSize: 17,
                        letterSpacing: -0.3,
                      }}
                    >
                      {s.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        marginTop: 4,
                      }}
                    >
                      <IcPin size={11} color={T.muted} />
                      <Text style={{ fontSize: 12, color: T.muted }}>
                        {s.address} · {s.distance}
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Mono tnum style={{ fontSize: 18, fontWeight: '700', letterSpacing: -0.4 }}>
                      ${s.pricePerHour.toLocaleString('es-AR')}
                    </Mono>
                    <Text
                      style={{
                        fontSize: 10,
                        color: T.muted,
                        fontWeight: '600',
                        letterSpacing: 0.4,
                        textTransform: 'uppercase',
                        marginTop: 2,
                      }}
                    >
                      por hora
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 6,
                    marginTop: 12,
                  }}
                >
                  {s.equipment.map((e, j) => (
                    <View
                      key={j}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 999,
                        backgroundColor: T.pageAlt,
                      }}
                    >
                      <Text style={{ fontSize: 11, color: T.ink2, fontWeight: '500' }}>{e}</Text>
                    </View>
                  ))}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 16,
                    paddingTop: 14,
                    borderTopWidth: 1,
                    borderTopColor: T.hairline,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <IcStarFill size={12} />
                    <Mono tnum style={{ fontSize: 13, fontWeight: '700' }}>
                      {s.rating}
                    </Mono>
                  </View>
                  <Btn
                    variant="primary"
                    size="sm"
                    trailing={<IcArrowR size={13} color="#fff" />}
                    onPress={() => requestSpace(s.name)}
                  >
                    Solicitar
                  </Btn>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
