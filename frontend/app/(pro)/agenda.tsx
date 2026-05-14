import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar, Card, IconBtn, Mono } from '@/components/ui';
import { IcCheck, IcFilter, IcPlus } from '@/components/icons';
import { T, fonts } from '@/theme';

const DAYS = [
  { d: 'L', n: 12 },
  { d: 'M', n: 13 },
  { d: 'M', n: 14 },
  { d: 'J', n: 15 },
  { d: 'V', n: 16 },
  { d: 'S', n: 17 },
  { d: 'D', n: 18 },
];

const HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

export default function ProAgendaScreen() {
  const [dayIdx, setDayIdx] = useState(1);

  const openFilters = () =>
    Alert.alert('Filtrar agenda', 'Elegí qué ver', [
      { text: 'Todos los turnos' },
      { text: 'Solo confirmados' },
      { text: 'Solo cancelados' },
      { text: 'Cerrar', style: 'cancel' },
    ]);

  const openNew = () =>
    Alert.alert('Nuevo turno', '¿Qué querés agregar?', [
      { text: 'Nuevo turno' },
      { text: 'Bloquear horario' },
      { text: 'Cancelar', style: 'cancel' },
    ]);

  const openEvent = (name: string) =>
    Alert.alert(name, 'Acciones disponibles', [
      { text: 'Ver detalle' },
      { text: 'Reagendar' },
      { text: 'Cancelar turno', style: 'destructive' },
      { text: 'Cerrar', style: 'cancel' },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <SafeAreaView edges={['top']}>
        <AppBar
          title="Agenda"
          sub="Mayo 2026"
          large
          right={
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <IconBtn icon={IcFilter} onPress={openFilters} />
              <IconBtn icon={IcPlus} variant="dark" onPress={openNew} />
            </View>
          }
        />

        {/* Day strip */}
        <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {DAYS.map((day, i) => {
              const sel = i === dayIdx;
              return (
                <Pressable
                  key={i}
                  onPress={() => setDayIdx(i)}
                  style={({ pressed }) => ({
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 14,
                    backgroundColor: sel ? T.ink : T.surface,
                    borderWidth: 1,
                    borderColor: sel ? T.ink : T.hairline,
                    alignItems: 'center',
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                  })}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: sel ? 'rgba(255,255,255,0.65)' : T.muted,
                      fontWeight: '700',
                      letterSpacing: 0.4,
                      textTransform: 'uppercase',
                    }}
                  >
                    {day.d}
                  </Text>
                  <Mono
                    tnum
                    style={{
                      fontSize: 17,
                      fontWeight: '700',
                      marginTop: 3,
                      color: sel ? '#fff' : T.ink,
                    }}
                  >
                    {day.n}
                  </Mono>
                </Pressable>
              );
            })}
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Summary */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
          <Card pad={16} radius={16} elevation="sm">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: T.successSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IcCheck size={18} color={T.success} strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: fonts.sansBold,
                    fontSize: 15,
                    letterSpacing: -0.2,
                  }}
                >
                  5 turnos confirmados
                </Text>
                <Text style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>
                  2.5 hs ocupadas · 3.5 hs libres
                </Text>
              </View>
              <Mono tnum style={{ fontSize: 17, fontWeight: '700', letterSpacing: -0.3 }}>
                $42.5k
              </Mono>
            </View>
          </Card>
        </View>

        {/* Timeline */}
        <View style={{ paddingHorizontal: 20 }}>
          {HOURS.map((label) => (
            <View key={label} style={{ flexDirection: 'row', gap: 14, paddingBottom: 10 }}>
              <Mono
                tnum
                style={{
                  width: 42,
                  paddingTop: 8,
                  fontSize: 11,
                  color: T.muted,
                  textAlign: 'right',
                  letterSpacing: 0.2,
                  fontWeight: '600',
                }}
              >
                {label}
              </Mono>
              <View
                style={{
                  flex: 1,
                  minHeight: 56,
                  borderTopWidth: 1,
                  borderTopColor: T.hairline,
                  position: 'relative',
                }}
              >
                {label === '09:00' && (
                  <Pressable
                    onPress={() => openEvent('Joaquín Mendez')}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 8,
                      borderRadius: 12,
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      backgroundColor: T.pageAlt,
                      borderWidth: 1,
                      borderColor: T.hairline,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <View
                      style={{ width: 3, height: 22, backgroundColor: T.success, borderRadius: 2 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 12.5,
                          fontWeight: '600',
                          textDecorationLine: 'line-through',
                          color: T.muted,
                        }}
                      >
                        Joaquín M. · Corte
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 999,
                        backgroundColor: T.successSoft,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IcCheck size={11} color={T.success} strokeWidth={2.5} />
                    </View>
                  </Pressable>
                )}
                {label === '10:00' && (
                  <Pressable
                    onPress={() => openEvent('Leo Messi')}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 8,
                      borderRadius: 14,
                      paddingVertical: 12,
                      paddingHorizontal: 14,
                      backgroundColor: T.ink,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View
                        style={{ width: 3, height: 18, backgroundColor: T.accent, borderRadius: 2 }}
                      />
                      <Text
                        style={{
                          fontFamily: fonts.sansBold,
                          fontSize: 13.5,
                          color: '#fff',
                          letterSpacing: -0.2,
                        }}
                      >
                        Leo Messi
                      </Text>
                      <View style={{ flex: 1 }} />
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 999,
                          backgroundColor: T.accent,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            color: '#fff',
                            fontWeight: '700',
                            letterSpacing: 0.4,
                          }}
                        >
                          PRÓXIMO
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.7)',
                        marginTop: 6,
                        marginLeft: 13,
                      }}
                    >
                      Corte + Barba · 45 min · Barba & Co
                    </Text>
                  </Pressable>
                )}
                {label === '12:00' && (
                  <Pressable
                    onPress={() => openEvent('Diego Filippin')}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 8,
                      borderRadius: 14,
                      paddingVertical: 12,
                      paddingHorizontal: 14,
                      backgroundColor: T.surface,
                      borderWidth: 1,
                      borderColor: T.hairlineDk,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View
                        style={{ width: 3, height: 18, backgroundColor: '#3F4A2E', borderRadius: 2 }}
                      />
                      <Text
                        style={{
                          fontFamily: fonts.sansBold,
                          fontSize: 13.5,
                          letterSpacing: -0.2,
                        }}
                      >
                        Diego Filippin
                      </Text>
                      <View style={{ flex: 1 }} />
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 999,
                          backgroundColor: T.warningSoft,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            color: T.warning,
                            fontWeight: '700',
                            letterSpacing: 0.3,
                          }}
                        >
                          OTRO LOCAL
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: T.muted,
                        marginTop: 6,
                        marginLeft: 13,
                      }}
                    >
                      Coloración · 60 min · Studio M, Recoleta
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
