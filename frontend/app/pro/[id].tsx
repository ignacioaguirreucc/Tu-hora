import { Alert, ScrollView, Share, Text, View, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';
import {
  Avatar,
  Btn,
  Card,
  Mono,
  PlaceholderImage,
  Pill,
} from '@/components/ui';
import {
  IcArrowR,
  IcChevL,
  IcHeart,
  IcPin,
  IcScissors,
  IcShare,
  IcStarFill,
} from '@/components/icons';
import { T, fonts, shadows } from '@/theme';
import { PROS } from '@/data/mock';

export default function ProDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const pro = PROS.find((p) => p.id === id) ?? PROS[0];
  const [tab, setTab] = useState<'Servicios' | 'Disponibilidad' | 'Reseñas'>('Servicios');
  const [selected, setSelected] = useState<Set<number>>(() => new Set([0, 1]));
  const [favorite, setFavorite] = useState(false);

  const total = useMemo(() => {
    let sum = 0;
    selected.forEach((idx) => {
      sum += pro.services[idx]?.price ?? 0;
    });
    return sum;
  }, [selected, pro.services]);

  const selectedList = useMemo(() => {
    return Array.from(selected).sort((a, b) => a - b);
  }, [selected]);

  const toggleService = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Mirá a ${pro.name} en TuHora · ${pro.spec} · ${pro.rating}★`,
      });
    } catch {
      Alert.alert('No se pudo compartir', 'Intentá de nuevo en unos segundos.');
    }
  };

  const toggleFavorite = () => {
    setFavorite((v) => !v);
  };

  const heroTone = pro.tone === 'ink' ? 'ink' : pro.tone === 'olive' ? 'olive' : pro.tone === 'plum' ? 'blush' : 'sand';

  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        {/* Cover */}
        <View style={{ position: 'relative', height: 320 }}>
          <PlaceholderImage label={pro.address.toLowerCase()} tone={heroTone} height={320} radius={0} />

          {/* Top bar */}
          <SafeAreaView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
            edges={['top']}
          >
            <View
              style={{
                paddingHorizontal: 16,
                paddingTop: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Pressable
                onPress={() => router.back()}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...shadows.sm,
                }}
              >
                <IcChevL size={20} color={T.ink} />
              </Pressable>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable
                  onPress={handleShare}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...shadows.sm,
                  }}
                >
                  <IcShare size={17} color={T.ink} />
                </Pressable>
                <Pressable
                  onPress={toggleFavorite}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    backgroundColor: favorite ? T.accent : 'rgba(255,255,255,0.95)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...shadows.sm,
                  }}
                >
                  <IcHeart size={17} color={favorite ? '#fff' : T.ink} />
                </Pressable>
              </View>
            </View>
          </SafeAreaView>

          {/* Hero label */}
          <View
            style={{
              position: 'absolute',
              bottom: 60,
              left: 24,
              right: 24,
            }}
          >
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.18)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.25)',
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  backgroundColor: '#36C97D',
                }}
              />
              <Text
                style={{
                  fontSize: 10.5,
                  color: '#fff',
                  fontFamily: fonts.mono,
                  fontWeight: '600',
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                }}
              >
                Disponible hoy
              </Text>
            </View>
          </View>
        </View>

        {/* Header card overlapping cover */}
        <View style={{ marginTop: -36, paddingHorizontal: 20 }}>
          <Card pad={20} radius={22} elevation="lg">
            <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
              <Avatar name={pro.name} tone={pro.tone} size={64} verified={pro.verified} />
              <View style={{ flex: 1, paddingTop: 4 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', letterSpacing: -0.4 }}>
                  {pro.name}
                </Text>
                <Text style={{ fontSize: 13, color: T.muted, marginTop: 3 }}>{pro.spec}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 6,
                  }}
                >
                  <IcPin size={11} color={T.muted} />
                  <Text style={{ fontSize: 11.5, color: T.muted }}>{pro.address}</Text>
                </View>
              </View>
            </View>

            {/* Stats row */}
            <View
              style={{
                flexDirection: 'row',
                gap: 0,
                marginTop: 18,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: T.hairline,
              }}
            >
              {[
                { l: 'Rating', v: pro.rating.toString(), sub: `${pro.reviews} reseñas` },
                { l: 'Experiencia', v: pro.experience.split(' ')[0], sub: 'años' },
                { l: 'Tiempo', v: '~45', sub: 'min promedio' },
              ].map((s, i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    borderLeftWidth: i > 0 ? 1 : 0,
                    borderLeftColor: T.hairline,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: T.muted,
                      fontFamily: fonts.mono,
                      letterSpacing: 0.6,
                      textTransform: 'uppercase',
                      fontWeight: '600',
                    }}
                  >
                    {s.l}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                    {s.l === 'Rating' && <IcStarFill size={14} />}
                    <Mono tnum style={{ fontSize: 18, fontWeight: '700', letterSpacing: -0.3 }}>
                      {s.v}
                    </Mono>
                  </View>
                  <Text style={{ fontSize: 10.5, color: T.muted, marginTop: 2 }}>{s.sub}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Tabs */}
        <View style={{ paddingHorizontal: 20, paddingTop: 22 }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 4,
              padding: 4,
              backgroundColor: T.pageAlt,
              borderRadius: 14,
            }}
          >
            {(['Servicios', 'Disponibilidad', 'Reseñas'] as const).map((t) => {
              const on = tab === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => setTab(t)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 10,
                    backgroundColor: on ? T.surface : 'transparent',
                    alignItems: 'center',
                    ...(on ? shadows.sm : {}),
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: on ? '700' : '500',
                      color: on ? T.ink : T.muted,
                      letterSpacing: -0.1,
                    }}
                  >
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Tab content */}
        {tab === 'Servicios' && (
          <View style={{ paddingHorizontal: 20, paddingTop: 18, gap: 10 }}>
            {pro.services.map((s, i) => {
              const isSel = selected.has(i);
              return (
                <Pressable
                  key={i}
                  onPress={() => toggleService(i)}
                  style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.99 : 1 }] })}
                >
                  <Card
                    pad={16}
                    radius={16}
                    elevation="sm"
                    bg={isSel ? T.ink : T.surface}
                    bordered={!isSel}
                    style={{
                      borderColor: isSel ? T.ink : T.hairline,
                      borderWidth: isSel ? 2 : 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 14,
                    }}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: isSel ? 'rgba(255,255,255,0.12)' : T.pageAlt,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IcScissors size={18} color={isSel ? '#fff' : T.ink} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: '700',
                            letterSpacing: -0.2,
                            color: isSel ? '#fff' : T.ink,
                          }}
                        >
                          {s.name}
                        </Text>
                        {s.popular && (
                          <Pill tone="accent" size="sm">
                            Popular
                          </Pill>
                        )}
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: isSel ? 'rgba(255,255,255,0.65)' : T.muted,
                          marginTop: 3,
                        }}
                      >
                        {s.duration}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Mono
                        tnum
                        style={{
                          fontSize: 15,
                          fontWeight: '700',
                          letterSpacing: -0.3,
                          color: isSel ? '#fff' : T.ink,
                        }}
                      >
                        ${s.price.toLocaleString('es-AR')}
                      </Mono>
                      <View
                        style={{
                          marginTop: 8,
                          width: 26,
                          height: 26,
                          borderRadius: 999,
                          backgroundColor: isSel ? T.accent : 'transparent',
                          borderWidth: isSel ? 0 : 1.5,
                          borderColor: T.hairlineDk,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          style={{
                            color: isSel ? '#fff' : T.muted,
                            fontSize: 14,
                            fontWeight: '700',
                            lineHeight: 16,
                          }}
                        >
                          {isSel ? '✓' : '+'}
                        </Text>
                      </View>
                    </View>
                  </Card>
                </Pressable>
              );
            })}

            {/* Live total preview */}
            <View
              style={{
                marginTop: 6,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: T.pageAlt,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text style={{ fontSize: 11, color: T.muted, fontWeight: '600', letterSpacing: 0.3, textTransform: 'uppercase' }}>
                  Seleccionados
                </Text>
                <Text style={{ fontSize: 13, fontWeight: '600', marginTop: 2 }}>
                  {selectedList.length === 0
                    ? 'Tocá un servicio para empezar'
                    : selectedList
                        .map((idx) => pro.services[idx]?.name)
                        .filter(Boolean)
                        .join(' · ')}
                </Text>
              </View>
              <Mono tnum style={{ fontSize: 18, fontWeight: '700', letterSpacing: -0.4 }}>
                ${total.toLocaleString('es-AR')}
              </Mono>
            </View>
          </View>
        )}

        {tab === 'Disponibilidad' && (
          <View style={{ paddingHorizontal: 20, paddingTop: 18, gap: 10 }}>
            {[
              { d: 'Hoy', slots: 4, color: T.success },
              { d: 'Mañana', slots: 7, color: T.success },
              { d: 'Pasado', slots: 2, color: T.warning },
              { d: 'Próximos días', slots: 22, color: T.muted },
            ].map((d, i) => (
              <Card key={i} pad={16} radius={16} elevation="sm">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: T.pageAlt,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>📅</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', letterSpacing: -0.2 }}>
                      {d.d}
                    </Text>
                    <Text style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                      {d.slots} horarios libres
                    </Text>
                  </View>
                  <Pill tone="neutral" size="sm">
                    Ver →
                  </Pill>
                </View>
              </Card>
            ))}
          </View>
        )}

        {tab === 'Reseñas' && (
          <View style={{ paddingHorizontal: 20, paddingTop: 18, gap: 10 }}>
            {[
              { n: 'Leo Messi', r: 5, c: 'Excelente atención, súper recomendable. Volveré sin dudas.' },
              { n: 'Mateo Vidal', r: 5, c: 'Puntual y profesional. El local impecable.' },
              { n: 'Diego Filippin', r: 4, c: 'Muy buen trabajo, ambiente prolijo y trato amable.' },
            ].map((rv, i) => (
              <Card key={i} pad={16} radius={16} elevation="sm">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Avatar name={rv.n} tone="soft" size={36} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700' }}>{rv.n}</Text>
                    <View style={{ flexDirection: 'row', gap: 2, marginTop: 2 }}>
                      {Array.from({ length: rv.r }).map((_, j) => (
                        <IcStarFill key={j} size={11} />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={{ fontSize: 13, color: T.ink2, marginTop: 10, lineHeight: 19 }}>
                  {rv.c}
                </Text>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View
        style={[
          {
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
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 10,
              color: T.muted,
              fontFamily: fonts.mono,
              fontWeight: '600',
              letterSpacing: 0.6,
              textTransform: 'uppercase',
            }}
          >
            {selected.size} {selected.size === 1 ? 'servicio' : 'servicios'}
          </Text>
          <Mono tnum style={{ fontSize: 22, fontWeight: '700', letterSpacing: -0.6, marginTop: 2 }}>
            ${total.toLocaleString('es-AR')}
          </Mono>
        </View>
        <Btn
          variant="primary"
          size="lg"
          onPress={() => {
            if (selected.size === 0) {
              Alert.alert('Elegí un servicio', 'Tocá al menos uno para reservar.');
              return;
            }
            router.push(`/booking?proId=${pro.id}`);
          }}
          trailing={<IcArrowR size={16} color="#fff" />}
        >
          Reservar
        </Btn>
      </View>
    </View>
  );
}
