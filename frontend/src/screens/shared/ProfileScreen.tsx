import { Alert, ScrollView, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar, Avatar, Card, IconBtn } from '@/components/ui';
import {
  IcBell,
  IcCard,
  IcChevR,
  IcDoc,
  IcLogout,
  IcSettings,
  IcShield,
  IcSparkle,
  IcUser,
  type IconComponent,
} from '@/components/icons';
import { T, fonts } from '@/theme';
import { useAuth, routeForRole, type Role } from '@/auth/AuthContext';

type Row = {
  I: IconComponent;
  t: string;
  v?: string;
  danger?: boolean;
  onPress?: () => void;
  tone?: string;
};

const stub = (title: string, msg: string) => () => Alert.alert(title, msg);

const ROLE_LABELS: Record<Role, string> = {
  client: 'Cliente',
  pro: 'Profesional',
  owner: 'Propietario',
};

const ALL_ROLES: Role[] = ['client', 'pro', 'owner'];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, switchRole, approveRoleForDemo } = useAuth();

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: T.page, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: T.muted, fontSize: 14 }}>Iniciá sesión para ver tu perfil.</Text>
      </View>
    );
  }

  const goToRole = (role: Role) => {
    if (role === 'client') {
      switchRole('client');
    } else if (user.roles.includes(role)) {
      switchRole(role);
    } else {
      approveRoleForDemo(role);
    }
    router.replace(routeForRole(role));
  };

  const accountRows: Row[] = [
    { I: IcUser, t: 'Editar perfil', onPress: stub('Editar perfil', 'Modificá tu nombre, foto y datos personales.'), tone: T.ink },
    { I: IcCard, t: 'Métodos de pago', v: '2 tarjetas', onPress: stub('Métodos de pago', 'Mastercard ••• 4421\nVisa ••• 8807'), tone: '#3F4A2E' },
    { I: IcBell, t: 'Notificaciones', v: 'Todas', onPress: stub('Notificaciones', 'Configurá qué notificaciones recibir.'), tone: '#A1664A' },
    { I: IcShield, t: 'Privacidad y seguridad', onPress: () => router.push('/verification'), tone: '#2854C5' },
  ];

  const handleLogout = () =>
    Alert.alert('Cerrar sesión', '¿Querés cerrar tu sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/');
        },
      },
    ]);

  const otherRows: Row[] = [
    { I: IcSparkle, t: 'Ayuda y FAQ', onPress: stub('Ayuda', 'Escribinos a soporte@tuhora.app'), tone: T.accent },
    { I: IcDoc, t: 'Términos y condiciones', onPress: stub('Términos', 'Versión 1.0 · mayo 2026'), tone: '#75716A' },
    { I: IcLogout, t: 'Cerrar sesión', danger: true, onPress: handleLogout },
  ];

  const openSettings = () =>
    Alert.alert('Ajustes', 'Próximamente vas a poder cambiar tema, idioma y preferencias.');

  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <SafeAreaView edges={['top']}>
        <AppBar title="Perfil" large right={<IconBtn icon={IcSettings} onPress={openSettings} />} />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Profile hero */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 22 }}>
          <Card pad={22} radius={22} elevation="md">
            <View style={{ alignItems: 'center' }}>
              <Avatar name={user.name} tone="ink" size={84} verified />
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 22,
                  letterSpacing: -0.4,
                  marginTop: 14,
                }}
              >
                {user.name}
              </Text>
              <Text style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{user.email}</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: T.accentSoft,
                  }}
                >
                  <IcSparkle size={11} color={T.accent} />
                  <Text style={{ fontSize: 12, color: T.accentInk, fontWeight: '700' }}>
                    Nivel {user.level}
                  </Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: T.pageAlt,
                  }}
                >
                  <Text style={{ fontSize: 12, color: T.ink, fontWeight: '700' }}>
                    {user.points} pts
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Role switcher (demo): siempre muestra los 3 roles para poder probar la app */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 22 }}>
          <SectionLabel>Cambiar rol</SectionLabel>
          <Card pad={6} radius={14} elevation="sm">
            <View style={{ flexDirection: 'row' }}>
              {ALL_ROLES.map((r) => {
                const active = user.activeRole === r;
                return (
                  <Pressable
                    key={r}
                    onPress={() => goToRole(r)}
                    style={{
                      flex: 1,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: active ? T.ink : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12.5,
                        fontWeight: active ? '700' : '500',
                        color: active ? '#fff' : T.muted,
                        letterSpacing: -0.1,
                      }}
                    >
                      {ROLE_LABELS[r]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>
          <Text
            style={{
              fontSize: 11,
              color: T.muted,
              marginTop: 8,
              paddingHorizontal: 4,
              lineHeight: 16,
            }}
          >
            Modo demo: podés cambiar de rol libremente. En producción los roles se desbloquean
            tras la verificación de identidad.
          </Text>
        </View>

        {/* Account */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 18 }}>
          <SectionLabel>Cuenta</SectionLabel>
          <ProfileList rows={accountRows} />
        </View>

        {/* Other */}
        <View style={{ paddingHorizontal: 20 }}>
          <SectionLabel>Más</SectionLabel>
          <ProfileList rows={otherRows} />
        </View>
      </ScrollView>
    </View>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontFamily: fonts.mono,
        fontSize: 10.5,
        color: T.muted,
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 10,
        paddingHorizontal: 4,
      }}
    >
      {children}
    </Text>
  );
}

function ProfileList({ rows }: { rows: Row[] }) {
  return (
    <Card pad={0} radius={16} elevation="sm">
      {rows.map((r, i) => (
        <Pressable
          key={i}
          onPress={r.onPress}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderBottomWidth: i < rows.length - 1 ? 1 : 0,
            borderBottomColor: T.hairline,
            backgroundColor: pressed ? T.pageAlt : 'transparent',
          })}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              backgroundColor: r.danger ? T.dangerSoft : r.tone ?? T.pageAlt,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <r.I size={16} color={r.danger ? T.danger : '#fff'} />
          </View>
          <Text
            style={{
              flex: 1,
              fontFamily: fonts.sansSemi,
              fontSize: 14,
              color: r.danger ? T.danger : T.ink,
              letterSpacing: -0.15,
            }}
          >
            {r.t}
          </Text>
          {r.v && (
            <Text style={{ fontSize: 12.5, color: T.muted, fontWeight: '500' }}>{r.v}</Text>
          )}
          {!r.danger && <IcChevR size={14} color={T.hint} />}
        </Pressable>
      ))}
    </Card>
  );
}
