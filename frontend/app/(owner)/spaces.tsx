import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppBar,
  Btn,
  Card,
  IconBtn,
  Mono,
  PlaceholderImage,
} from '@/components/ui';
import { IcPlus, IcStarFill } from '@/components/icons';
import { T, fonts } from '@/theme';

const SPACES = [
  { n: 'Sillón 1', s: 'Barbería', img: 'sand' as const, occ: 92, pricePerHour: 2500, pro: 'Lucía Romero', rating: 4.8 },
  { n: 'Sillón 2', s: 'Barbería', img: 'olive' as const, occ: 74, pricePerHour: 2300, pro: 'Mateo Vidal', rating: 4.6 },
  { n: 'Camilla 1', s: 'Estética', img: 'blush' as const, occ: 48, pricePerHour: 3500, pro: 'Disponible', rating: 4.9 },
  { n: 'Consultorio 2', s: 'Salud', img: 'stone' as const, occ: 78, pricePerHour: 5000, pro: 'Andrés Torres', rating: 4.7 },
];

export default function OwnerSpacesScreen() {
  const newSpace = () =>
    Alert.alert('Nuevo espacio', '¿Querés crear un nuevo espacio de alquiler?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Crear', onPress: () => Alert.alert('Listo', 'Espacio creado en modo borrador.') },
    ]);

  const editSpace = (name: string) =>
    Alert.alert(`Editar ${name}`, '¿Qué querés modificar?', [
      { text: 'Cambiar precio' },
      { text: 'Modificar disponibilidad' },
      { text: 'Pausar' },
      { text: 'Cerrar', style: 'cancel' },
    ]);

  const openSpace = (name: string) =>
    Alert.alert(name, 'Acá vas a ver la disponibilidad y métricas del espacio.');

  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <SafeAreaView edges={['top']}>
        <AppBar
          title="Tus espacios"
          sub={`${SPACES.length} activos`}
          large
          right={<IconBtn icon={IcPlus} variant="dark" onPress={newSpace} />}
        />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          {SPACES.map((sp, i) => (
            <Pressable
              key={i}
              onPress={() => openSpace(sp.n)}
              style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.99 : 1 }] })}
            >
              <Card pad={0} radius={18} elevation="md" style={{ overflow: 'hidden' }}>
                <View style={{ position: 'relative' }}>
                  <PlaceholderImage label={sp.n.toLowerCase()} height={140} radius={0} tone={sp.img} />
                  <View
                    style={{
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 999,
                      backgroundColor: 'rgba(255,255,255,0.95)',
                    }}
                  >
                    <IcStarFill size={10} />
                    <Mono tnum style={{ fontSize: 11, fontWeight: '700' }}>
                      {sp.rating}
                    </Mono>
                  </View>
                </View>
                <View style={{ padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text
                          style={{
                            fontFamily: fonts.sansBold,
                            fontSize: 17,
                            letterSpacing: -0.3,
                          }}
                        >
                          {sp.n}
                        </Text>
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 999,
                            backgroundColor: T.pageAlt,
                          }}
                        >
                          <Text style={{ fontSize: 10.5, color: T.ink2, fontWeight: '600' }}>
                            {sp.s}
                          </Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>
                        Hoy · {sp.pro}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Mono tnum style={{ fontSize: 17, fontWeight: '700', letterSpacing: -0.3 }}>
                        ${sp.pricePerHour.toLocaleString('es-AR')}
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
                      alignItems: 'center',
                      gap: 10,
                      marginTop: 12,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        height: 5,
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
                    <Mono tnum style={{ fontSize: 12, fontWeight: '700' }}>
                      {sp.occ}%
                    </Mono>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      marginTop: 14,
                      paddingTop: 14,
                      borderTopWidth: 1,
                      borderTopColor: T.hairline,
                    }}
                  >
                    <Btn variant="secondary" size="sm" onPress={() => editSpace(sp.n)}>
                      Editar
                    </Btn>
                  </View>
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
