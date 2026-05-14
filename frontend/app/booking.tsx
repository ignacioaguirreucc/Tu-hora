import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Btn, Card, IconBtn, Mono } from '@/components/ui';
import { IcArrowR, IcChevL, IcChevR } from '@/components/icons';
import { T, fonts } from '@/theme';
import { PROS } from '@/data/mock';

type Day = { d: string; n: number; full?: boolean };

const MONTHS = ['Marzo 2026', 'Abril 2026', 'Mayo 2026', 'Junio 2026'];

const MONTH_DAYS: Record<string, Day[]> = {
  'Marzo 2026': [
    { d: 'L', n: 30 },
    { d: 'M', n: 31 },
    { d: 'M', n: 1, full: true },
    { d: 'J', n: 2 },
    { d: 'V', n: 3 },
    { d: 'S', n: 4 },
    { d: 'D', n: 5, full: true },
  ],
  'Abril 2026': [
    { d: 'L', n: 6 },
    { d: 'M', n: 7 },
    { d: 'M', n: 8 },
    { d: 'J', n: 9 },
    { d: 'V', n: 10, full: true },
    { d: 'S', n: 11 },
    { d: 'D', n: 12, full: true },
  ],
  'Mayo 2026': [
    { d: 'L', n: 12 },
    { d: 'M', n: 13 },
    { d: 'M', n: 14 },
    { d: 'J', n: 15 },
    { d: 'V', n: 16, full: true },
    { d: 'S', n: 17 },
    { d: 'D', n: 18, full: true },
  ],
  'Junio 2026': [
    { d: 'L', n: 1 },
    { d: 'M', n: 2 },
    { d: 'M', n: 3 },
    { d: 'J', n: 4 },
    { d: 'V', n: 5 },
    { d: 'S', n: 6 },
    { d: 'D', n: 7, full: true },
  ],
};

const SLOTS = [
  { t: '09:00' },
  { t: '09:30' },
  { t: '10:00', dis: true },
  { t: '10:30' },
  { t: '11:00' },
  { t: '11:30' },
  { t: '14:00' },
  { t: '14:30', dis: true },
  { t: '15:00' },
  { t: '15:30' },
  { t: '16:00' },
  { t: '17:00' },
];

const DAY_NAMES: Record<string, string> = {
  L: 'Lunes',
  M: 'Martes',
  J: 'Jueves',
  V: 'Viernes',
  S: 'Sábado',
  D: 'Domingo',
};

export default function BookingScreen() {
  const router = useRouter();
  const { proId } = useLocalSearchParams<{ proId?: string }>();
  const pro = PROS.find((p) => p.id === proId) ?? PROS[0];
  const [monthIdx, setMonthIdx] = useState(2);
  const [dayIdx, setDayIdx] = useState(1);
  const [slotIdx, setSlotIdx] = useState(3);

  const month = MONTHS[monthIdx];
  const days = MONTH_DAYS[month];

  const goPrevMonth = () => {
    if (monthIdx === 0) return;
    setMonthIdx(monthIdx - 1);
    setDayIdx(0);
  };
  const goNextMonth = () => {
    if (monthIdx === MONTHS.length - 1) return;
    setMonthIdx(monthIdx + 1);
    setDayIdx(0);
  };

  const openEditService = () =>
    Alert.alert('Cambiar servicio', '¿Querés volver al perfil?', [
      { text: 'Ver perfil', onPress: () => router.replace(`/pro/${pro.id}`) },
      { text: 'Cerrar', style: 'cancel' },
    ]);

  const selectedSlot = SLOTS[slotIdx];
  const dayName = useMemo(() => DAY_NAMES[days[dayIdx].d] ?? 'Miércoles', [days, dayIdx]);

  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <SafeAreaView edges={['top']}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 4,
            paddingBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <IconBtn icon={IcChevL} size={42} onPress={() => router.back()} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: fonts.sansBold,
                fontSize: 15,
                letterSpacing: -0.2,
              }}
            >
              Reservar turno
            </Text>
            <Text style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>Paso 2 de 3</Text>
          </View>
          <View style={{ width: 42 }} />
        </View>

        {/* Progress */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 14,
            paddingBottom: 18,
            flexDirection: 'row',
            gap: 6,
          }}
        >
          <View style={{ flex: 1, height: 4, backgroundColor: T.ink, borderRadius: 999 }} />
          <View style={{ flex: 1, height: 4, backgroundColor: T.ink, borderRadius: 999 }} />
          <View style={{ flex: 1, height: 4, backgroundColor: T.hairlineDk, borderRadius: 999 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Pro card */}
        <View style={{ paddingHorizontal: 20 }}>
          <Card pad={14} radius={16} elevation="sm">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Avatar name={pro.name} tone={pro.tone} size={44} verified={pro.verified} />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: fonts.sansSemi,
                    fontSize: 14,
                    letterSpacing: -0.2,
                  }}
                >
                  {pro.name}
                </Text>
                <Text style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                  {pro.services[1]?.name ?? pro.services[0].name} ·{' '}
                  {pro.services[1]?.duration ?? pro.services[0].duration}
                </Text>
              </View>
              <Pressable
                onPress={openEditService}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: T.accentSoft,
                }}
              >
                <Text style={{ fontSize: 12, color: T.accentInk, fontWeight: '700' }}>Editar</Text>
              </Pressable>
            </View>
          </Card>
        </View>

        {/* Date */}
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <View>
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
                Elegí día
              </Text>
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 19,
                  letterSpacing: -0.4,
                  marginTop: 4,
                }}
              >
                {month}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <IconBtn
                icon={IcChevL}
                size={38}
                onPress={goPrevMonth}
                style={{ opacity: monthIdx === 0 ? 0.4 : 1 }}
              />
              <IconBtn
                icon={IcChevR}
                size={38}
                onPress={goNextMonth}
                style={{ opacity: monthIdx === MONTHS.length - 1 ? 0.4 : 1 }}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 6 }}>
            {days.map((day, i) => {
              const sel = i === dayIdx;
              return (
                <Pressable
                  key={i}
                  onPress={() => !day.full && setDayIdx(i)}
                  style={({ pressed }) => ({
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 14,
                    backgroundColor: sel ? T.ink : T.surface,
                    borderWidth: 1,
                    borderColor: sel ? T.ink : T.hairline,
                    opacity: day.full ? 0.35 : 1,
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
                      marginTop: 4,
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

        {/* Slots */}
        <View style={{ paddingHorizontal: 20, paddingTop: 28 }}>
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
            Horario · {dayName} {days[dayIdx].n}
          </Text>
          <View
            style={{
              marginTop: 14,
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            {SLOTS.map((s, i) => {
              const sel = i === slotIdx;
              const dis = s.dis;
              return (
                <Pressable
                  key={i}
                  onPress={() => !dis && setSlotIdx(i)}
                  style={({ pressed }) => ({
                    width: '31.5%',
                    height: 46,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: sel ? T.ink : dis ? T.pageAlt : T.surface,
                    borderWidth: 1,
                    borderColor: sel ? T.ink : T.hairline,
                    transform: [{ scale: pressed && !dis ? 0.97 : 1 }],
                  })}
                >
                  <Mono
                    tnum
                    style={{
                      fontSize: 13.5,
                      fontWeight: '700',
                      color: sel ? '#fff' : dis ? T.hint : T.ink,
                      textDecorationLine: dis ? 'line-through' : 'none',
                    }}
                  >
                    {s.t}
                  </Mono>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingTop: 16,
          paddingHorizontal: 20,
          paddingBottom: 32,
          backgroundColor: 'rgba(251,250,247,0.96)',
          borderTopWidth: 1,
          borderTopColor: T.hairline,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 10,
              color: T.muted,
              fontWeight: '600',
              letterSpacing: 0.6,
              textTransform: 'uppercase',
            }}
          >
            {dayName} {days[dayIdx].n} · {selectedSlot.t} hs
          </Text>
          <Mono tnum style={{ fontSize: 22, fontWeight: '700', letterSpacing: -0.6, marginTop: 2 }}>
            ${(pro.services[1]?.price ?? pro.services[0].price).toLocaleString('es-AR')}
          </Mono>
        </View>
        <Btn
          variant="primary"
          size="lg"
          trailing={<IcArrowR size={16} color="#fff" />}
          onPress={() => router.replace('/confirmation')}
        >
          Continuar
        </Btn>
      </View>
    </View>
  );
}
