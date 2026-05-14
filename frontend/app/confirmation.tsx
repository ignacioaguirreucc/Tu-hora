import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Btn, Card, Mono, Serif } from '@/components/ui';
import {
  IcCal,
  IcCard,
  IcCheck,
  IcDoc,
  IcPin,
  IcSparkle,
  type IconComponent,
} from '@/components/icons';
import { T, fonts } from '@/theme';

const ROWS: { l: string; v: string; I: IconComponent; mono?: boolean }[] = [
  { l: 'Fecha', v: 'Mar 13 may · 10:30 hs', I: IcCal },
  { l: 'Dirección', v: 'Barba & Co · Palermo', I: IcPin },
  { l: 'Pago', v: 'Mastercard ••• 4421 · $8.200', I: IcCard },
  { l: 'Reserva', v: 'TH-2026-04412', I: IcDoc, mono: true },
];

export default function ConfirmationScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <SafeAreaView edges={['top']}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 4,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <Pressable
            onPress={() => router.replace('/(client)/home')}
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: T.surface,
              borderWidth: 1,
              borderColor: T.hairline,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 20, color: T.muted, fontWeight: '600' }}>×</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Success icon */}
        <View style={{ alignItems: 'center', paddingTop: 30 }}>
          <View
            style={{
              width: 108,
              height: 108,
              borderRadius: 999,
              backgroundColor: T.successSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: 76,
                height: 76,
                borderRadius: 999,
                backgroundColor: T.success,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IcCheck size={36} color="#fff" strokeWidth={2.5} />
            </View>
          </View>
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 11,
              color: T.muted,
              fontWeight: '600',
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginTop: 24,
            }}
          >
            Confirmación
          </Text>
          <Serif size={34} style={{ marginTop: 10, textAlign: 'center', lineHeight: 38 }}>
            Tu turno está{'\n'}
            <Serif size={34} italic>
              confirmado.
            </Serif>
          </Serif>
          <Text
            style={{
              fontSize: 14,
              color: T.muted,
              marginTop: 12,
              lineHeight: 21,
              maxWidth: 300,
              textAlign: 'center',
            }}
          >
            Te enviamos los detalles a tu email. Recibirás un recordatorio el día anterior.
          </Text>
        </View>

        {/* Details card */}
        <View style={{ paddingHorizontal: 20, paddingTop: 28 }}>
          <Card pad={0} radius={20} elevation="md" style={{ overflow: 'hidden' }}>
            <View
              style={{
                padding: 18,
                flexDirection: 'row',
                gap: 14,
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: T.hairline,
              }}
            >
              <Avatar name="Lucía Romero" tone="ink" size={48} verified />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: fonts.sansBold,
                    fontSize: 15.5,
                    letterSpacing: -0.3,
                  }}
                >
                  Lucía Romero
                </Text>
                <Text style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>
                  Corte + Barba · 45 min
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                  backgroundColor: T.successSoft,
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: T.success,
                  }}
                />
                <Text style={{ fontSize: 10.5, fontWeight: '700', color: T.success, letterSpacing: 0.4 }}>
                  PAGADO
                </Text>
              </View>
            </View>
            <View style={{ padding: 18, gap: 14 }}>
              {ROWS.map((r, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      backgroundColor: T.pageAlt,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <r.I size={14} color={T.ink} />
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      color: T.muted,
                      fontWeight: '500',
                    }}
                  >
                    {r.l}
                  </Text>
                  {r.mono ? (
                    <Mono tnum style={{ fontSize: 13, fontWeight: '700', color: T.ink }}>
                      {r.v}
                    </Mono>
                  ) : (
                    <Text style={{ fontSize: 13, fontWeight: '600', color: T.ink, letterSpacing: -0.1 }}>
                      {r.v}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </Card>

          <View
            style={{
              marginTop: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 16,
              backgroundColor: T.accentSoft,
            }}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                backgroundColor: T.accent,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IcSparkle size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13.5, fontWeight: '700', color: T.accentInk, letterSpacing: -0.1 }}>
                +82 puntos en tu cuenta
              </Text>
              <Text style={{ fontSize: 11.5, color: T.accentInk, opacity: 0.75, marginTop: 2 }}>
                Total: 422 pts · Faltan 78 para 20% OFF
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingTop: 14,
          paddingHorizontal: 20,
          paddingBottom: 32,
          backgroundColor: 'rgba(251,250,247,0.96)',
          borderTopWidth: 1,
          borderTopColor: T.hairline,
          flexDirection: 'row',
          gap: 10,
        }}
      >
        <Btn
          variant="secondary"
          size="lg"
          full
          style={{ flex: 1 }}
          leading={<IcCal size={16} color={T.ink} />}
          onPress={() =>
            Alert.alert('Agregar al calendario', 'Sumamos tu turno al calendario del teléfono.', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Agregar', onPress: () => Alert.alert('Listo', 'Lo guardamos en tu calendario.') },
            ])
          }
        >
          Calendario
        </Btn>
        <Btn
          variant="primary"
          size="lg"
          full
          style={{ flex: 1.2 }}
          onPress={() => router.replace('/(client)/appointments')}
        >
          Ver turno
        </Btn>
      </View>
    </View>
  );
}
