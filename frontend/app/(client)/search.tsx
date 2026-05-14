import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Card, Chip, MapPreview, Mono, Pill, PlaceholderImage } from '@/components/ui';
import {
  IcArrowR,
  IcFilter,
  IcPin,
  IcSearch,
  IcStarFill,
} from '@/components/icons';
import { T, fonts, shadows } from '@/theme';
import { CATEGORIES, PROS } from '@/data/mock';

type Sort = 'distance' | 'rating' | 'price';

export default function SearchScreen() {
  const router = useRouter();
  const [category, setCategory] = useState('Todos');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('distance');

  const filtered = useMemo(() => {
    const base = category === 'Todos' ? PROS : PROS.filter((p) => p.category === category);
    const q = query.trim().toLowerCase();
    const searched = q
      ? base.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.spec.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q),
        )
      : base;
    const sorted = [...searched];
    if (sort === 'distance') sorted.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    if (sort === 'price') sorted.sort((a, b) => a.basePrice - b.basePrice);
    return sorted;
  }, [category, query, sort]);

  const sortLabel =
    sort === 'distance' ? 'Más cercanos' : sort === 'rating' ? 'Mejor puntuados' : 'Precio menor';

  const openFilters = () => {
    Alert.alert('Ordenar', 'Elegí cómo ordenar los resultados', [
      { text: 'Más cercanos', onPress: () => setSort('distance') },
      { text: 'Mejor puntuados', onPress: () => setSort('rating') },
      { text: 'Precio menor', onPress: () => setSort('price') },
      { text: 'Cerrar', style: 'cancel' },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <SafeAreaView edges={['top']}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 14 }}>
          <Text
            style={{
              fontSize: 11,
              fontFamily: fonts.mono,
              color: T.muted,
              fontWeight: '600',
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Descubrir
          </Text>
          <Text style={{ fontSize: 26, fontWeight: '700', marginTop: 4, letterSpacing: -0.5 }}>
            Buscar profesionales
          </Text>
        </View>

        {/* Search bar */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 14 }}>
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                height: 54,
                paddingLeft: 16,
                paddingRight: 6,
                borderRadius: 16,
                backgroundColor: T.surface,
                borderWidth: 1,
                borderColor: T.hairline,
              },
              shadows.sm,
            ]}
          >
            <IcSearch size={18} color={T.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Nombre, servicio o zona…"
              placeholderTextColor={T.hint}
              style={{ flex: 1, fontSize: 14.5, color: T.ink, letterSpacing: -0.1 }}
            />
            <Pressable
              onPress={openFilters}
              style={({ pressed }) => ({
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: T.ink,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <IcFilter size={15} color="#fff" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingBottom: 16 }}
        >
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              active={category === c}
              onPress={() => setCategory(c)}
              leading={c === 'Cerca' ? <IcPin size={12} color={category === c ? '#fff' : T.muted} /> : undefined}
            >
              {c}
            </Chip>
          ))}
        </ScrollView>

        {/* Map preview */}
        <View style={{ paddingHorizontal: 20 }}>
          <Card pad={0} radius={20} elevation="md" style={{ overflow: 'hidden' }}>
            <MapPreview height={190} radius={0}>
              {/* Top-left counter */}
              <View
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  paddingHorizontal: 11,
                  paddingVertical: 7,
                  borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.96)',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 3,
                }}
              >
                <IcPin size={11} color={T.ink} />
                <Text style={{ fontSize: 11.5, fontWeight: '700', color: T.ink }}>
                  {filtered.length} cerca tuyo
                </Text>
              </View>

              {/* Pins */}
              <View
                style={{
                  position: 'absolute',
                  left: '18%',
                  top: '24%',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                  backgroundColor: T.ink,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.25,
                  shadowRadius: 5,
                  elevation: 4,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>$8k</Text>
              </View>
              {/* Pin tail */}
              <View
                style={{
                  position: 'absolute',
                  left: '22%',
                  top: '37%',
                  width: 0,
                  height: 0,
                  borderLeftWidth: 4,
                  borderRightWidth: 4,
                  borderTopWidth: 6,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderTopColor: T.ink,
                }}
              />

              <View
                style={{
                  position: 'absolute',
                  left: '52%',
                  top: '50%',
                  paddingHorizontal: 11,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: T.accent,
                  shadowColor: T.accent,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.45,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 11.5, fontWeight: '800' }}>$12k</Text>
              </View>
              <View
                style={{
                  position: 'absolute',
                  left: '57%',
                  top: '64%',
                  width: 0,
                  height: 0,
                  borderLeftWidth: 5,
                  borderRightWidth: 5,
                  borderTopWidth: 7,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderTopColor: T.accent,
                }}
              />

              <View
                style={{
                  position: 'absolute',
                  left: '76%',
                  top: '22%',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                  backgroundColor: '#fff',
                  borderWidth: 1.5,
                  borderColor: T.ink,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text style={{ color: T.ink, fontSize: 11, fontWeight: '700' }}>$5k</Text>
              </View>

              {/* Recenter / zoom buttons */}
              <View
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  gap: 6,
                }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 11,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.12,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Text style={{ fontSize: 16, color: T.ink, fontWeight: '700' }}>＋</Text>
                </View>
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 11,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.12,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Text style={{ fontSize: 16, color: T.ink, fontWeight: '700' }}>−</Text>
                </View>
              </View>

              {/* CTA full map */}
              <Pressable
                onPress={() => Alert.alert('Mapa', 'Vista de mapa completa próximamente.')}
                style={({ pressed }) => ({
                  position: 'absolute',
                  bottom: 14,
                  right: 14,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: T.ink,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 5,
                  elevation: 4,
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: -0.1 }}>
                  Ver mapa
                </Text>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>→</Text>
              </Pressable>
            </MapPreview>
          </Card>
        </View>

        {/* Results header */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 22,
            paddingBottom: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ fontSize: 17, fontWeight: '700', letterSpacing: -0.3 }}>
            {filtered.length} profesionales
          </Text>
          <Pressable
            onPress={openFilters}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: T.surface,
              borderWidth: 1,
              borderColor: T.hairline,
            }}
          >
            <Text style={{ fontSize: 12, color: T.ink, fontWeight: '600' }}>{sortLabel}</Text>
            <Text style={{ fontSize: 10, color: T.muted }}>▼</Text>
          </Pressable>
        </View>

        {/* Results */}
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {filtered.length === 0 ? (
            <Card pad={28} radius={16}>
              <Text style={{ fontSize: 14, color: T.muted, textAlign: 'center', fontWeight: '500' }}>
                No encontramos profesionales para "{query}".
              </Text>
            </Card>
          ) : (
            filtered.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => router.push(`/pro/${p.id}`)}
                style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.99 : 1 }] })}
              >
                <Card pad={0} radius={18} elevation="sm" style={{ overflow: 'hidden' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <PlaceholderImage
                      tone={p.tone === 'ink' ? 'ink' : p.tone === 'olive' ? 'olive' : p.tone === 'plum' ? 'blush' : 'sand'}
                      width={110}
                      height={130}
                      radius={0}
                    />
                    <View style={{ flex: 1, padding: 14, justifyContent: 'space-between' }}>
                      <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={{ fontSize: 15, fontWeight: '700', letterSpacing: -0.2 }}>
                            {p.name}
                          </Text>
                          {p.verified && (
                            <View
                              style={{
                                width: 14,
                                height: 14,
                                borderRadius: 999,
                                backgroundColor: T.info,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Text style={{ fontSize: 8, color: '#fff', fontWeight: '700' }}>✓</Text>
                            </View>
                          )}
                        </View>
                        <Text style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                          {p.spec} · {p.distance}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                            marginTop: 8,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 3,
                              paddingHorizontal: 8,
                              paddingVertical: 3,
                              borderRadius: 999,
                              backgroundColor: T.pageAlt,
                            }}
                          >
                            <IcStarFill size={10} />
                            <Mono tnum style={{ fontSize: 11, fontWeight: '700' }}>
                              {p.rating}
                            </Mono>
                          </View>
                          <Pill tone={p.available === 'Hoy' ? 'success' : 'warning'} dot size="sm">
                            {p.available}
                          </Pill>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'baseline',
                          justifyContent: 'space-between',
                          marginTop: 10,
                        }}
                      >
                        <View>
                          <Text style={{ fontSize: 10, color: T.muted, fontWeight: '500' }}>
                            desde
                          </Text>
                          <Mono tnum style={{ fontSize: 15, fontWeight: '700', letterSpacing: -0.3 }}>
                            ${p.basePrice.toLocaleString('es-AR')}
                          </Mono>
                        </View>
                        <View
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 12,
                            backgroundColor: T.ink,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IcArrowR size={15} color="#fff" />
                        </View>
                      </View>
                    </View>
                  </View>
                </Card>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
