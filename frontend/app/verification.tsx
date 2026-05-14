import { Alert, ScrollView, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar, Btn, Card, IconBtn } from '@/components/ui';
import { IcCam, IcCheck, IcChevL, IcDoc, IcShield } from '@/components/icons';
import { T, fonts } from '@/theme';

type StepStatus = 'done' | 'active' | 'pending';

const STEPS: { title: string; sub: string; status: StepStatus }[] = [
  { title: 'Datos personales', sub: 'Nombre, DNI, fecha de nacimiento', status: 'done' },
  { title: 'Documento de identidad', sub: 'Frente y dorso del DNI', status: 'done' },
  { title: 'Matrícula profesional', sub: 'Certificado del colegio', status: 'active' },
  { title: 'Selfie de validación', sub: 'Foto en vivo para cruce facial', status: 'pending' },
];

export default function Verification() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <SafeAreaView edges={['top']}>
        <AppBar
          title="Verificación"
          sub="KYC profesional"
          large
          left={<IconBtn icon={IcChevL} size={42} onPress={() => router.back()} />}
        />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Banner */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 22 }}>
          <Card pad={16} radius={16} elevation="sm">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: T.warningSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IcShield size={19} color={T.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: fonts.sansBold,
                    fontSize: 14.5,
                    letterSpacing: -0.2,
                  }}
                >
                  Verificación en proceso
                </Text>
                <Text style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>
                  2 de 4 pasos completos · 24-48 hs
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                  backgroundColor: T.pageAlt,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: T.ink }}>50%</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Steps */}
        <View style={{ paddingHorizontal: 20 }}>
          {STEPS.map((step, i) => {
            const isLast = i === STEPS.length - 1;
            const dotBg =
              step.status === 'done' ? T.success : step.status === 'active' ? T.ink : 'transparent';
            const dotBorder = step.status === 'pending' ? T.hairlineDk : 'transparent';
            return (
              <View key={i} style={{ flexDirection: 'row', gap: 16, paddingBottom: isLast ? 0 : 20 }}>
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 999,
                      backgroundColor: dotBg,
                      borderWidth: step.status === 'pending' ? 1.5 : 0,
                      borderColor: dotBorder,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {step.status === 'done' ? (
                      <IcCheck size={14} color="#fff" strokeWidth={2.5} />
                    ) : (
                      <Text
                        style={{
                          color: step.status === 'pending' ? T.muted : '#fff',
                          fontSize: 13,
                          fontWeight: '700',
                        }}
                      >
                        {i + 1}
                      </Text>
                    )}
                  </View>
                  {!isLast && (
                    <View
                      style={{
                        flex: 1,
                        width: 2,
                        backgroundColor: step.status === 'done' ? T.success : T.hairlineDk,
                        marginTop: 4,
                      }}
                    />
                  )}
                </View>
                <View style={{ flex: 1, paddingTop: 3 }}>
                  <Text
                    style={{
                      fontFamily: fonts.sansSemi,
                      fontSize: 14.5,
                      color: step.status === 'pending' ? T.muted : T.ink,
                      letterSpacing: -0.2,
                    }}
                  >
                    {step.title}
                  </Text>
                  <Text style={{ fontSize: 12.5, color: T.muted, marginTop: 3 }}>{step.sub}</Text>

                  {step.status === 'active' && (
                    <Card
                      pad={14}
                      radius={14}
                      elevation="sm"
                      style={{
                        marginTop: 12,
                        borderStyle: 'dashed',
                        borderColor: T.hairlineDk,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 11,
                            backgroundColor: T.pageAlt,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IcDoc size={16} color={T.ink} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontFamily: fonts.sansSemi,
                              fontSize: 13,
                            }}
                          >
                            matricula_lucia.pdf
                          </Text>
                          <Text
                            style={{
                              fontSize: 11,
                              color: T.muted,
                              marginTop: 2,
                              fontFamily: fonts.mono,
                            }}
                          >
                            2.3 MB · Subido hoy
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
                            backgroundColor: T.infoSoft,
                          }}
                        >
                          <View
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: 999,
                              backgroundColor: T.info,
                            }}
                          />
                          <Text style={{ fontSize: 10.5, color: T.info, fontWeight: '700' }}>
                            EN REVISIÓN
                          </Text>
                        </View>
                      </View>
                    </Card>
                  )}

                  {step.status === 'pending' && (
                    <Btn
                      variant="secondary"
                      size="sm"
                      style={{ marginTop: 10 }}
                      leading={<IcCam size={13} color={T.ink} />}
                      onPress={() =>
                        Alert.alert('Cámara', '¿Abrir la cámara para la selfie?', [
                          { text: 'Cancelar', style: 'cancel' },
                          { text: 'Abrir cámara', onPress: () => {} },
                        ])
                      }
                    >
                      Tomar foto
                    </Btn>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Info card */}
        <View style={{ paddingHorizontal: 20, paddingTop: 26 }}>
          <Card pad={16} radius={14} elevation="sm">
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <IcShield size={18} color={T.info} />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: fonts.sansSemi,
                    fontSize: 13,
                  }}
                >
                  Tus datos están protegidos
                </Text>
                <Text
                  style={{
                    fontSize: 11.5,
                    color: T.muted,
                    marginTop: 4,
                    lineHeight: 17,
                  }}
                >
                  Encriptamos toda la información y la usamos sólo para validar tu identidad.
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
