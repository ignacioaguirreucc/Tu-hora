import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar, Chip, IconBtn } from '@/components/ui';
import {
  IcCard,
  IcCheck,
  IcChevL,
  IcClock,
  IcGift,
  IcSparkle,
  IcStarFill,
  type IconComponent,
} from '@/components/icons';
import { T, fonts } from '@/theme';

type Tone = 'success' | 'accent' | 'info';
type Cat = 'Todas' | 'Turnos' | 'Pagos' | 'Puntos';

type Notif = {
  I: IconComponent;
  tone: Tone;
  title: string;
  sub: string;
  when: string;
  unread?: boolean;
  cat: Exclude<Cat, 'Todas'>;
};

const TODAY: Notif[] = [
  { I: IcCheck, tone: 'success', title: 'Turno confirmado', sub: 'Lucía Romero · Martes 13 a las 10:30', when: '12 min', unread: true, cat: 'Turnos' },
  { I: IcSparkle, tone: 'accent', title: '+82 puntos en tu cuenta', sub: 'Por completar corte con Lucía', when: '12 min', unread: true, cat: 'Puntos' },
  { I: IcCard, tone: 'info', title: 'Pago recibido · $8.200', sub: 'Mastercard ••• 4421', when: '12 min', cat: 'Pagos' },
];

const WEEK: Notif[] = [
  { I: IcClock, tone: 'info', title: 'Recordatorio · turno mañana', sub: 'Andrés Torres a las 09:30', when: 'Ayer', cat: 'Turnos' },
  { I: IcGift, tone: 'accent', title: 'Nuevo nivel: Star', sub: 'Desbloqueaste descuentos exclusivos', when: '2 días', cat: 'Puntos' },
  { I: IcStarFill, tone: 'accent', title: '¿Cómo estuvo tu corte?', sub: 'Dejá tu reseña a Lucía Romero', when: '3 días', cat: 'Turnos' },
];

const toneToColors = (t: Tone) =>
  t === 'success'
    ? { bg: T.successSoft, fg: T.success }
    : t === 'accent'
    ? { bg: T.accentSoft, fg: T.accent }
    : { bg: T.infoSoft, fg: T.info };

function Item({ n, onPress }: { n: Notif; onPress?: () => void }) {
  const c = toneToColors(n.tone);
  const I = n.I;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        gap: 14,
        padding: 14,
        borderRadius: 14,
        backgroundColor: n.unread ? T.surface : 'transparent',
        borderWidth: n.unread ? 1 : 0,
        borderColor: n.unread ? T.hairline : 'transparent',
        position: 'relative',
        transform: [{ scale: pressed ? 0.99 : 1 }],
      })}
    >
      {n.unread && (
        <View
          style={{
            position: 'absolute',
            top: 18,
            right: 14,
            width: 8,
            height: 8,
            borderRadius: 999,
            backgroundColor: T.accent,
          }}
        />
      )}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: c.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <I size={17} color={c.fg} />
      </View>
      <View style={{ flex: 1, paddingRight: 18 }}>
        <Text
          style={{
            fontFamily: fonts.sansSemi,
            fontSize: 13.5,
            letterSpacing: -0.15,
          }}
        >
          {n.title}
        </Text>
        <Text style={{ fontSize: 12, color: T.muted, marginTop: 3, lineHeight: 16 }}>{n.sub}</Text>
        <Text
          style={{
            fontSize: 10,
            color: T.hint,
            marginTop: 6,
            fontFamily: fonts.mono,
            letterSpacing: 0.4,
            fontWeight: '600',
          }}
        >
          {n.when}
        </Text>
      </View>
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [today, setToday] = useState<Notif[]>(TODAY);
  const [week, setWeek] = useState<Notif[]>(WEEK);
  const [cat, setCat] = useState<Cat>('Todas');

  const visibleToday = useMemo(
    () => (cat === 'Todas' ? today : today.filter((n) => n.cat === cat)),
    [today, cat],
  );
  const visibleWeek = useMemo(
    () => (cat === 'Todas' ? week : week.filter((n) => n.cat === cat)),
    [week, cat],
  );

  const markAllRead = () => {
    setToday((arr) => arr.map((n) => ({ ...n, unread: false })));
    setWeek((arr) => arr.map((n) => ({ ...n, unread: false })));
  };

  const handleNotifPress = (n: Notif) => {
    setToday((arr) => arr.map((x) => (x === n ? { ...x, unread: false } : x)));
    setWeek((arr) => arr.map((x) => (x === n ? { ...x, unread: false } : x)));
    if (n.cat === 'Turnos') router.push('/(client)/appointments');
    else if (n.cat === 'Puntos') router.push('/points');
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <SafeAreaView edges={['top']}>
        <AppBar
          title="Notificaciones"
          large
          left={<IconBtn icon={IcChevL} size={42} onPress={() => router.back()} />}
          right={
            <Pressable onPress={markAllRead} hitSlop={6}>
              <Text style={{ fontSize: 13, color: T.ink, fontWeight: '600' }}>Marcar leídas</Text>
            </Pressable>
          }
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingBottom: 14 }}
        >
          {(['Todas', 'Turnos', 'Pagos', 'Puntos'] as Cat[]).map((c) => (
            <Chip key={c} active={cat === c} onPress={() => setCat(c)}>
              {c}
            </Chip>
          ))}
        </ScrollView>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={{ paddingHorizontal: 20 }}>
          {visibleToday.length > 0 && (
            <>
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
                Hoy
              </Text>
              <View style={{ gap: 8 }}>
                {visibleToday.map((n, i) => (
                  <Item key={i} n={n} onPress={() => handleNotifPress(n)} />
                ))}
              </View>
            </>
          )}

          {visibleWeek.length > 0 && (
            <>
              <Text
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 10.5,
                  color: T.muted,
                  fontWeight: '600',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  marginTop: 20,
                  marginBottom: 12,
                  paddingHorizontal: 4,
                }}
              >
                Esta semana
              </Text>
              <View style={{ gap: 8 }}>
                {visibleWeek.map((n, i) => (
                  <Item key={i} n={n} onPress={() => handleNotifPress(n)} />
                ))}
              </View>
            </>
          )}

          {visibleToday.length === 0 && visibleWeek.length === 0 && (
            <Text style={{ fontSize: 13, color: T.muted, textAlign: 'center', marginTop: 40 }}>
              No tenés notificaciones en "{cat}".
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
