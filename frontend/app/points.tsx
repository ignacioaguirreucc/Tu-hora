import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar, Btn, Card, Eyebrow, IconBtn, Mono, SectionHead } from '@/components/ui';
import {
  IcArrowR,
  IcChevL,
  IcMore,
  IcPlus,
  IcSparkle,
} from '@/components/icons';
import { T, fonts } from '@/theme';

const REWARDS = [
  { t: '20% OFF', s: 'En tu próximo corte', cost: '500', bd: T.accent },
  { t: '50% OFF', s: 'Solo este mes', cost: '1.200', bd: T.ink },
  { t: 'Gratis', s: 'Limpieza dental', cost: '900', bd: '#3F4A2E' },
];

const INITIAL_HISTORY = [
  { d: 'Hoy', t: 'Corte + Barba con Lucía', pts: '+82', pos: true },
  { d: 'Hace 3 días', t: 'Ruleta — 2x puntos', pts: '+40', pos: true },
  { d: '02 mayo', t: 'Canje · 20% descuento', pts: '-500', pos: false },
  { d: '28 abr', t: 'Reseña 5★ a Andrés', pts: '+15', pos: true },
];

type RoulettePrize = {
  label: string;
  short: string;
  color: string;
  pts: number;
};

const ROULETTE: RoulettePrize[] = [
  { label: '+50 puntos bonus', short: '+50', color: '#E97A3A', pts: 50 },
  { label: '2x puntos próximo turno', short: '2X', color: '#1F2A22', pts: 0 },
  { label: '10% OFF servicio', short: '10%', color: '#3F4A2E', pts: 0 },
  { label: '+100 puntos', short: '+100', color: '#C57F4A', pts: 100 },
  { label: 'Café gratis', short: '☕', color: '#7A5C3E', pts: 0 },
  { label: '+25 puntos', short: '+25', color: '#5C6E48', pts: 25 },
  { label: 'Sorpresa secreta', short: '?', color: '#1F2A22', pts: 0 },
  { label: '+200 puntos jackpot', short: '+200', color: '#E97A3A', pts: 200 },
];

const SEG_ANGLE = 360 / ROULETTE.length;

export default function PointsScreen() {
  const router = useRouter();
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [points, setPoints] = useState(340);
  const [spinsLeft, setSpinsLeft] = useState(1);
  const [showRoulette, setShowRoulette] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<RoulettePrize | null>(null);
  const rotation = useRef(new Animated.Value(0)).current;
  const rotationDeg = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const openRoulette = () => {
    if (spinsLeft <= 0) {
      Alert.alert('Sin giros', 'Vuelve mañana o completá un turno para conseguir más giros.');
      return;
    }
    setPrize(null);
    rotation.setValue(0);
    setShowRoulette(true);
  };

  const closeRoulette = () => {
    if (spinning) return;
    setShowRoulette(false);
  };

  const spin = () => {
    if (spinning || prize) return;
    setSpinning(true);
    const winnerIdx = Math.floor(Math.random() * ROULETTE.length);
    const fullSpins = 5;
    const targetDeg = fullSpins * 360 + (360 - winnerIdx * SEG_ANGLE - SEG_ANGLE / 2);
    Animated.timing(rotation, {
      toValue: targetDeg / 360,
      duration: 3200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      const won = ROULETTE[winnerIdx];
      setPrize(won);
      setSpinning(false);
      setSpinsLeft((n) => Math.max(0, n - 1));
      if (won.pts > 0) {
        setPoints((p) => p + won.pts);
      }
      setHistory((h) => [
        { d: 'Ahora', t: `Ruleta — ${won.label}`, pts: won.pts > 0 ? `+${won.pts}` : 'Premio', pos: true },
        ...h,
      ]);
    });
  };

  useEffect(() => {
    if (!showRoulette) {
      rotation.setValue(0);
    }
  }, [showRoulette, rotation]);

  const claim = (reward: { t: string; s: string; cost: string }) => {
    const cost = parseInt(reward.cost.replace(/\./g, ''), 10);
    if (points < cost) {
      Alert.alert('Puntos insuficientes', `Necesitás ${reward.cost} pts y tenés ${points}.`);
      return;
    }
    Alert.alert(
      `Canjear ${reward.t}`,
      `${reward.s}\nCosto: ${reward.cost} pts`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Canjear',
          onPress: () => {
            setPoints((p) => p - cost);
            setHistory((h) => [
              { d: 'Ahora', t: `Canje · ${reward.t}`, pts: `-${reward.cost}`, pos: false },
              ...h,
            ]);
            Alert.alert('Canje exitoso', `Aplicamos ${reward.t} en tu próximo turno.`);
          },
        },
      ],
    );
  };

  const moreOptions = () =>
    Alert.alert('Opciones', '¿Qué querés ver?', [
      { text: 'Cómo funcionan los puntos' },
      { text: 'Ver términos' },
      { text: 'Cerrar', style: 'cancel' },
    ]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.page }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <AppBar
          title="Puntos"
          left={<IconBtn icon={IcChevL} size={36} onPress={() => router.back()} />}
          right={<IconBtn icon={IcMore} onPress={moreOptions} />}
        />

        <View style={{ paddingHorizontal: 20 }}>
          <Card pad={0} radius={20} bg={T.ink} style={{ overflow: 'hidden', borderColor: T.ink }}>
            <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 18 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Eyebrow color="rgba(255,255,255,0.55)">Tu balance</Eyebrow>
                <Text
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.55)',
                  }}
                >
                  NIVEL 2 · STAR
                </Text>
              </View>
              <Mono
                tnum
                style={{
                  fontSize: 64,
                  fontWeight: '600',
                  letterSpacing: -2,
                  marginTop: 6,
                  lineHeight: 64,
                  color: '#fff',
                }}
              >
                {points}
              </Mono>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 5 }}>
                Puntos TuHora · acumulados este mes
              </Text>

              <View style={{ marginTop: 16 }}>
                <View
                  style={{
                    height: 5,
                    borderRadius: 999,
                    backgroundColor: 'rgba(255,255,255,0.14)',
                    overflow: 'hidden',
                  }}
                >
                  <View style={{ width: '68%', height: '100%', backgroundColor: T.accent }} />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 8,
                  }}
                >
                  <Text style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)' }}>
                    160 pts → descuento 20%
                  </Text>
                  <Mono tnum style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)' }}>
                    500 pts
                  </Mono>
                </View>
              </View>

              <Btn
                variant="accent"
                size="md"
                full
                style={{ marginTop: 16, opacity: spinsLeft > 0 ? 1 : 0.5 }}
                leading={<IcSparkle size={15} color="#fff" />}
                onPress={openRoulette}
              >
                {spinsLeft > 0
                  ? `Girar la ruleta · ${spinsLeft} disponible${spinsLeft === 1 ? '' : 's'}`
                  : 'Sin giros disponibles'}
              </Btn>
            </View>
          </Card>
        </View>

        {/* Rewards */}
        <View style={{ paddingTop: 22 }}>
          <SectionHead
            title="Recompensas disponibles"
            action="Ver todas →"
            onActionPress={() => Alert.alert('Recompensas', 'Próximamente vas a ver el catálogo completo.')}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20 }}>
              {REWARDS.map((r, i) => (
                <Pressable
                  key={i}
                  onPress={() => claim(r)}
                  style={{
                    width: 172,
                    padding: 16,
                    borderRadius: 14,
                    backgroundColor: T.surface,
                    borderWidth: 1,
                    borderColor: T.hairline,
                    borderLeftWidth: 3,
                    borderLeftColor: r.bd,
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: '700', letterSpacing: -0.4 }}>
                    {r.t}
                  </Text>
                  <Text style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{r.s}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 14,
                    }}
                  >
                    <Mono tnum style={{ fontSize: 12, fontWeight: '600' }}>
                      {r.cost} pts
                    </Mono>
                    <IcArrowR size={15} color={T.ink} />
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* History */}
        <View style={{ paddingHorizontal: 20, paddingTop: 22 }}>
          <SectionHead title="Historial reciente" style={{ paddingHorizontal: 0 }} />
          <Card pad={0} radius={14}>
            {history.map((h, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 13,
                  borderBottomWidth: i < history.length - 1 ? 1 : 0,
                  borderBottomColor: T.hairline,
                }}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    backgroundColor: h.pos ? T.successSoft : T.dangerSoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {h.pos ? (
                    <IcPlus size={13} color={T.success} />
                  ) : (
                    <Text style={{ fontSize: 14, color: T.danger, fontWeight: '700' }}>−</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '500' }}>{h.t}</Text>
                  <Text style={{ fontSize: 11.5, color: T.muted, marginTop: 1 }}>{h.d}</Text>
                </View>
                <Mono
                  tnum
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: h.pos ? T.success : T.danger,
                  }}
                >
                  {h.pts}
                </Mono>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>

      {/* Modal Ruleta */}
      <Modal visible={showRoulette} animationType="fade" transparent onRequestClose={closeRoulette}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 360,
              backgroundColor: T.surface,
              borderRadius: 24,
              padding: 22,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 11, color: T.muted, fontWeight: '600', letterSpacing: 1 }}>
              RULETA TUHORA
            </Text>
            <Text style={{ fontSize: 22, fontWeight: '700', marginTop: 6, letterSpacing: -0.4 }}>
              Probá tu suerte
            </Text>

            <View style={{ marginTop: 22, width: 260, height: 260, alignItems: 'center', justifyContent: 'center' }}>
              {/* Indicador */}
              <View
                style={{
                  position: 'absolute',
                  top: -6,
                  zIndex: 5,
                  width: 0,
                  height: 0,
                  borderLeftWidth: 12,
                  borderRightWidth: 12,
                  borderTopWidth: 18,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderTopColor: T.ink,
                }}
              />
              {/* Rueda */}
              <Animated.View
                style={{
                  width: 240,
                  height: 240,
                  borderRadius: 999,
                  borderWidth: 6,
                  borderColor: T.ink,
                  overflow: 'hidden',
                  transform: [{ rotate: rotationDeg }],
                  position: 'relative',
                }}
              >
                {ROULETTE.map((p, i) => (
                  <View
                    key={i}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      width: 120,
                      height: 120,
                      transformOrigin: '0% 100%',
                      transform: [{ rotate: `${i * SEG_ANGLE}deg` }, { skewY: `${SEG_ANGLE - 90}deg` }],
                      backgroundColor: p.color,
                      borderRightWidth: 1,
                      borderRightColor: 'rgba(255,255,255,0.2)',
                    }}
                  />
                ))}
                {ROULETTE.map((p, i) => {
                  const angle = i * SEG_ANGLE + SEG_ANGLE / 2;
                  return (
                    <View
                      key={`l-${i}`}
                      pointerEvents="none"
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: 0,
                        height: 0,
                        transform: [{ rotate: `${angle}deg` }, { translateY: -82 }],
                      }}
                    >
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: 12,
                          textAlign: 'center',
                          width: 60,
                          marginLeft: -30,
                        }}
                      >
                        {p.short}
                      </Text>
                    </View>
                  );
                })}
                {/* Centro */}
                <View
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 44,
                    height: 44,
                    marginTop: -22,
                    marginLeft: -22,
                    borderRadius: 999,
                    backgroundColor: T.surface,
                    borderWidth: 4,
                    borderColor: T.ink,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IcSparkle size={18} color={T.ink} />
                </View>
              </Animated.View>
            </View>

            {prize ? (
              <View style={{ marginTop: 22, alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: T.muted, fontWeight: '600' }}>¡GANASTE!</Text>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '700',
                    marginTop: 4,
                    color: T.accent,
                    letterSpacing: -0.3,
                    textAlign: 'center',
                  }}
                >
                  {prize.label}
                </Text>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
                  <Btn variant="secondary" size="md" onPress={closeRoulette}>
                    Cerrar
                  </Btn>
                  <Btn variant="primary" size="md" onPress={() => { closeRoulette(); }}>
                    Ver puntos
                  </Btn>
                </View>
              </View>
            ) : (
              <View style={{ marginTop: 22, width: '100%' }}>
                <Btn
                  variant="primary"
                  size="lg"
                  full
                  onPress={spin}
                  leading={<IcSparkle size={16} color="#fff" />}
                >
                  {spinning ? 'Girando…' : 'Girar la ruleta'}
                </Btn>
                <Pressable onPress={closeRoulette} disabled={spinning} style={{ marginTop: 10, alignSelf: 'center' }}>
                  <Text style={{ fontSize: 13, color: T.muted, fontWeight: '500' }}>
                    {spinning ? ' ' : 'Cancelar'}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
