import { useState } from 'react';
import { Alert, View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, Field, Serif, Card, IconBtn } from '@/components/ui';
import { IcCam, IcChevL, IcDoc, IcShield, IcStore } from '@/components/icons';
import { T, fonts } from '@/theme';
import { useAuth, routeForRole } from '@/auth/AuthContext';

export default function BecomeOwnerScreen() {
  const router = useRouter();
  const { user, requestRole, approveRoleForDemo } = useAuth();
  const [fullName, setFullName] = useState(user?.name ?? '');
  const [dni, setDni] = useState('');
  const [cuit, setCuit] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [docDni, setDocDni] = useState(false);
  const [docAfip, setDocAfip] = useState(false);
  const [docHabilitacion, setDocHabilitacion] = useState(false);

  const isPending = user?.ownerStatus === 'pending';
  const allDocsUploaded = docDni && docAfip && docHabilitacion;
  const canSubmit =
    fullName.trim() &&
    dni.trim() &&
    cuit.trim() &&
    businessName.trim() &&
    address.trim() &&
    allDocsUploaded;

  const handleSubmit = () => {
    if (!canSubmit) return;
    requestRole('owner');
    Alert.alert(
      'Solicitud enviada',
      'Vamos a revisar tus datos y la documentación del local en 24-48 hs. Te avisamos cuando esté aprobado.',
      [{ text: 'Listo', onPress: () => router.back() }],
    );
  };

  const handleApproveDemo = () => {
    Alert.alert(
      'Aprobar ahora (demo)',
      'Esto activa tu rol de propietario al toque, sin revisión real. Solo para demostración.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprobar',
          onPress: () => {
            approveRoleForDemo('owner');
            router.replace(routeForRole('owner'));
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
          <IcStore size={22} color="#fff" />
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
          Registro de propietario
        </Text>
        <Serif size={32} style={{ marginTop: 10, lineHeight: 36 }}>
          Registrá{'\n'}
          <Serif size={32} italic>
            tu local.
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
          Validamos la habilitación del local y tus datos fiscales para que puedas alquilar
          espacios a profesionales. Tardamos 24-48 hs.
        </Text>

        {isPending && (
          <Card pad={14} radius={14} elevation="sm" style={{ marginTop: 20, backgroundColor: T.accentSoft }}>
            <Text style={{ fontSize: 13, color: T.accentInk, fontWeight: '700' }}>
              Tu solicitud está en revisión
            </Text>
            <Text style={{ fontSize: 12.5, color: T.accentInk, marginTop: 4, lineHeight: 18 }}>
              Te avisamos por notificación cuando esté lista.
            </Text>
          </Card>
        )}

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
          <Field
            label="CUIT"
            placeholder="20-12345678-3"
            value={cuit}
            onChangeText={setCuit}
            keyboardType="number-pad"
          />
        </View>

        <SectionTitle>Datos del local</SectionTitle>
        <View style={{ gap: 14 }}>
          <Field
            label="Nombre del local"
            placeholder="Ej. Barba & Co"
            value={businessName}
            onChangeText={setBusinessName}
          />
          <Field
            label="Dirección"
            placeholder="Calle, número, ciudad"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <SectionTitle>Documentación</SectionTitle>
        <Card pad={0} radius={16} elevation="sm">
          <DocRow
            label="Foto del DNI (frente y dorso)"
            done={docDni}
            onPress={() => setDocDni(true)}
            withDivider
          />
          <DocRow
            label="Constancia de inscripción AFIP"
            done={docAfip}
            onPress={() => setDocAfip(true)}
            withDivider
          />
          <DocRow
            label="Habilitación municipal del local"
            done={docHabilitacion}
            onPress={() => setDocHabilitacion(true)}
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
            Tus documentos se almacenan cifrados y se usan únicamente para verificar tu identidad
            y la del local.
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
