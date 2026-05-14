import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import {
  AppBar,
  Card,
  IconBtn,
  Mono,
  SectionHead,
} from '@/components/ui';
import { IcShare } from '@/components/icons';
import { T, fonts } from '@/theme';

const KPIS = [
  { l: 'Ocupación', v: '74%', d: '+8 pts' },
  { l: 'Reservas', v: '312', d: '+24' },
  { l: 'Ticket', v: '$6.4k', d: '+2%' },
  { l: 'No-shows', v: '4', d: '−2' },
];

const TOP = [
  { n: 'Sillón 1', s: 'Barbería', rev: '$248k', occ: 92 },
  { n: 'Sillón 2', s: 'Barbería', rev: '$201k', occ: 84 },
  { n: 'Consultorio 1', s: 'Salud', rev: '$176k', occ: 78 },
  { n: 'Camilla 1', s: 'Estética', rev: '$98k', occ: 48 },
];

const PERIODS = ['7 días', '30 días', '90 días', 'Año'] as const;
type Period = (typeof PERIODS)[number];

export default function OwnerAnalyticsScreen() {
  const [period, setPeriod] = useState<Period>('30 días');

  const handleShare = () =>
    Alert.alert('Compartir reporte', '¿Cómo querés compartirlo?', [
      { text: 'Enviar por email' },
      { text: 'Generar PDF' },
      { text: 'Copiar enlace' },
      { text: 'Cancelar', style: 'cancel' },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <SafeAreaView edges={['top']}>
        <AppBar
          title="Métricas"
          sub={`Últimos ${period.toLowerCase()}`}
          large
          right={<IconBtn icon={IcShare} onPress={handleShare} />}
        />

        {/* Range tabs */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
          <View
            style={{
              padding: 4,
              backgroundColor: T.pageAlt,
              borderRadius: 14,
              flexDirection: 'row',
            }}
          >
            {PERIODS.map((p) => {
              const on = period === p;
              return (
                <Pressable
                  key={p}
                  onPress={() => setPeriod(p)}
                  style={{
                    flex: 1,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: on ? T.surface : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12.5,
                      fontWeight: on ? '700' : '500',
                      color: on ? T.ink : T.muted,
                      letterSpacing: -0.1,
                    }}
                  >
                    {p}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Hero card */}
        <View style={{ paddingHorizontal: 20 }}>
          <Card pad={22} radius={22} elevation="md">
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
              Ingresos netos
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
              <Mono tnum style={{ fontSize: 38, fontWeight: '700', letterSpacing: -1.2, lineHeight: 42 }}>
                $782.350
              </Mono>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 999,
                  backgroundColor: T.successSoft,
                }}
              >
                <Mono tnum style={{ fontSize: 11, color: T.success, fontWeight: '700' }}>
                  ↑ 18%
                </Mono>
              </View>
            </View>
            <Text style={{ fontSize: 12.5, color: T.muted, marginTop: 4 }}>
              vs 30 días previos · luego de comisión
            </Text>

            <View style={{ marginTop: 20, height: 100 }}>
              <Svg width="100%" height={100} viewBox="0 0 320 100" preserveAspectRatio="none">
                {[20, 40, 60, 80].map((y) => (
                  <Line key={y} x1="0" x2="320" y1={y} y2={y} stroke={T.hairline} strokeWidth="1" strokeDasharray="3 3" />
                ))}
                <Path
                  d="M0 80 L20 70 L40 75 L60 60 L80 65 L100 50 L120 52 L140 40 L160 46 L180 32 L200 38 L220 28 L240 36 L260 28 L280 24 L300 20 L320 22 L320 100 L0 100 Z"
                  fill={T.accent}
                  fillOpacity={0.14}
                />
                <Path
                  d="M0 80 L20 70 L40 75 L60 60 L80 65 L100 50 L120 52 L140 40 L160 46 L180 32 L200 38 L220 28 L240 36 L260 28 L280 24 L300 20 L320 22"
                  stroke={T.ink}
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <Circle cx="280" cy="24" r="5" fill={T.accent} stroke="#fff" strokeWidth="2.5" />
              </Svg>
            </View>
          </Card>
        </View>

        {/* KPI grid */}
        <View style={{ paddingHorizontal: 20, paddingTop: 14 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {KPIS.map((k, i) => (
              <Card key={i} pad={16} radius={16} style={{ width: '48%' }} elevation="sm">
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
                <Mono tnum style={{ fontSize: 24, fontWeight: '700', marginTop: 6, letterSpacing: -0.5 }}>
                  {k.v}
                </Mono>
                <Mono tnum style={{ fontSize: 11.5, color: T.success, fontWeight: '700', marginTop: 4 }}>
                  ↑ {k.d}
                </Mono>
              </Card>
            ))}
          </View>
        </View>

        {/* Top spaces */}
        <View style={{ paddingTop: 24 }}>
          <SectionHead title="Espacios más rentables" />
          <View style={{ paddingHorizontal: 20 }}>
            <Card pad={0} radius={16} elevation="sm">
              {TOP.map((s, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: i < TOP.length - 1 ? 1 : 0,
                    borderBottomColor: T.hairline,
                  }}
                >
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 999,
                      backgroundColor: i === 0 ? T.ink : T.pageAlt,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Mono
                      tnum
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: i === 0 ? '#fff' : T.ink,
                      }}
                    >
                      {i + 1}
                    </Mono>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: fonts.sansSemi,
                        fontSize: 14,
                        letterSpacing: -0.2,
                      }}
                    >
                      {s.n}
                    </Text>
                    <Text style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>
                      {s.s} · {s.occ}% ocup.
                    </Text>
                  </View>
                  <Mono tnum style={{ fontSize: 15, fontWeight: '700', letterSpacing: -0.3 }}>
                    {s.rev}
                  </Mono>
                </View>
              ))}
            </Card>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
