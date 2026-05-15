import { useState } from 'react';
import { Alert, View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, Field, Serif, Card, IconBtn } from '@/components/ui';
import { IcBriefcase, IcCam, IcChevL, IcDoc, IcShield } from '@/components/icons';
import { T, fonts } from '@/theme';
import { useAuth, routeForRole } from '@/auth/AuthContext';

const CATEGORIES = ['Barbería', 'Estética', 'Odontología', 'Manicura', 'Masajes', 'Otro'];

export default function BecomeProScreen() {
  const router = useRouter();
  const { user, requestRole, approveRoleForDemo } = useAuth();
  const [fullName, setFullName] = useState(user?.name ?? '');
  const [dni, setDni] = useState('');
  const [license, setLicense] = useState('');
  const [category, setCategory] = useState<string>('Barbería');
  const [docDni, setDocDni] = useState(false);
  const [docSelfie, setDocSelfie] = useState(false);
  const [docLicense, setDocLicense] = useState(false);

  const isPending = user?.proStatus === 'pending';
  const allDocsUploaded = docDni && docSelfie && docLicense;
  const canSubmit = fullName.trim() && dni.trim() && license.trim() && allDocsUploaded;

  const handleSubmit = () => {
    if (!canSubmit) return;
    requestRole('pro');
    Alert.alert(
      'Solicitud enviada',
      'Vamos a revisar tus datos en 24-48 hs. Te avisamos cuando tu cuenta de profesional esté activa.',
      [{ text: 'Listo', onPress: () => router.back() }],
    );
  };

  const handleApproveDemo = () => {
    Alert.alert(
      'Aprobar ahora (demo)',
      'Esto activa tu rol de profesional al toque, sin revisión real. Solo para demostración.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprobar',
          onPress: () => {
            approveRoleForDemo('pro');
            router.replace(routeForRole('pro'));
          },
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <SafeAreaView edges={['top']}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 4,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <IconBtn icon={IcChevL} onPress={() => router.back()} />
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 36 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: T.ink,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 8,
            marginBottom: 18,
          }}
        >
          <IcBriefcase size={22} color="#fff" />
        </View>

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
          Verificación de identidad
        </Text>
        <Serif size={32} style={{ marginTop: 10, lineHeight: 36 }}>
          Convertite en{'\n'}
          <Serif size={32} italic>
            profesional.
          </Serif>
        </Serif>
        <Text
          style={{
            fontSize: 14,
            color: T.muted,
            marginTop: 12,
            lineHeight: 21,
            letterSpacing: -0.1,
          }}
        >
          Validamos tu identidad y tu habilitación para que los clientes te encuentren con
          confianza. Tardamos 24-48 hs.
        </Text>

        {isPending && (
          <Card pad={14} radius={14} elevation="sm" style={{ marginTop: 20, backgroundColor: T.accentSoft }}>
            <Text style={{ fontSize: 13, color: T.accentInk, fontWeight: '700' }}>
              Tu solicitud está en revisión
            </Text>
            <Text style={{ fontSize: 12.5, color: T.accentInk, marginTop: 4, lineHeight: 18 }}>
              Te avisamos por notificación cuando esté lista. Podés volver a esta pantalla para ver
              el estado.
            </Text>
          </Card>
        )}

        {/* Datos personales */}
        <SectionTitle>Datos personales</SectionTitle>
        <View style={{ gap: 14 }}>
          <Field label="Nombre y apellido" value={fullName} onChangeText={setFullName} />
          <Field
            label="DNI"
            placeholder="12.345.678"
            value={dni}
            onChangeText={setDni}
            keyboardType="number-pad"
          />
        </View>

        {/* Categoría */}
        <SectionTitle>Categoría</SectionTitle>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  borderRadius: 999,
                  backgroundColor: active ? T.ink : T.surface,
                  borderWidth: 1,
                  borderColor: active ? T.ink : T.hairlineDk,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: active ? '700' : '500',
                    color: active ? '#fff' : T.ink,
                    letterSpacing: -0.1,
                  }}
                >
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Matrícula */}
        <SectionTitle>Matrícula o habilitación</SectionTitle>
        <Field
          label="Nº de matrícula o habilitación municipal"
          placeholder="Ej. MN 12345 / Habilitación CABA 2024"
          value={license}
          onChangeText={setLicense}
        />

        {/* Documentación */}
        <SectionTitle>Documentación</SectionTitle>
        <Card pad={0} radius={16} elevation="sm">
          <DocRow
            label="Foto del DNI (frente y dorso)"
            done={docDni}
            onPress={() => setDocDni(true)}
            withDivider
          />
          <DocRow
            label="Selfie con DNI en mano"
            done={docSelfie}
            onPress={() => setDocSelfie(true)}
            withDivider
          />
          <DocRow
            label="Foto de matrícula o habilitación"
            done={docLicense}
            onPress={() => setDocLicense(true)}
          />
        </Card>

        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            marginTop: 18,
            paddingHorizontal: 2,
          }}
        >
          <IcShield size={14} color={T.muted} />
          <Text style={{ flex: 1, fontSize: 12, color: T.muted, lineHeight: 18 }}>
            Tus documentos se almacenan cifrados y se usan únicamente para verificar tu identidad.
          </Text>
        </View>

        <Btn
          variant="primary"
          size="lg"
          full
          disabled={!canSubmit || isPending}
          style={{ marginTop: 22 }}
          onPress={handleSubmit}
        >
          {isPending ? 'En revisión' : 'Enviar solicitud'}
        </Btn>

        {/* Demo helper — quitar cuando haya backend */}
        <Pressable onPress={handleApproveDemo} hitSlop={6} style={{ marginTop: 14 }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: T.muted,
              fontWeight: '600',
              letterSpacing: -0.1,
            }}
          >
            Aprobar ahora (solo demo)
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontFamily: fonts.mono,
        fontSize: 10.5,
        color: T.muted,
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginTop: 26,
        marginBottom: 12,
        paddingHorizontal: 2,
      }}
    >
      {children}
    </Text>
  );
}

function DocRow({
  label,
  done,
  onPress,
  withDivider = false,
}: {
  label: string;
  done: boolean;
  onPress: () => void;
  withDivider?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: withDivider ? 1 : 0,
        borderBottomColor: T.hairline,
        backgroundColor: pressed ? T.pageAlt : 'transparent',
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 11,
          backgroundColor: done ? T.ink : T.pageAlt,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {done ? <IcDoc size={16} color="#fff" /> : <IcCam size={16} color={T.ink} />}
      </View>
      <Text
        style={{
          flex: 1,
          fontFamily: fonts.sansSemi,
          fontSize: 14,
          color: T.ink,
          letterSpacing: -0.15,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '700',
          color: done ? T.accentInk : T.muted,
        }}
      >
        {done ? 'Subido' : 'Subir'}
      </Text>
    </Pressable>
  );
}
