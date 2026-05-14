import { useState } from 'react';
import { Alert, View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, Field, Serif } from '@/components/ui';
import { T, fonts } from '@/theme';

type Tab = 'login' | 'register';

export default function AuthScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('leo@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar contraseña',
      `Te enviaremos un enlace de recuperación a ${email || 'tu email'}.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Enviar', onPress: () => Alert.alert('Listo', 'Revisá tu casilla en unos minutos.') },
      ],
    );
  };

  const handleSocial = (provider: 'Google' | 'Apple') => {
    Alert.alert(
      `Continuar con ${provider}`,
      `Ingresá con tu cuenta de ${provider} para acceder.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Continuar', onPress: () => router.replace('/(client)/home') },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.page }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: 20, paddingBottom: 36 }}>
          {/* Brand mark */}
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor: T.ink,
              marginBottom: 36,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <View
              style={{
                width: 3,
                height: 18,
                backgroundColor: '#fff',
                borderRadius: 2,
                transform: [{ translateY: -2 }],
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: 26,
                left: 24,
                width: 10,
                height: 3,
                backgroundColor: T.accent,
                borderRadius: 2,
                transform: [{ translateX: -1.5 }],
              }}
            />
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
            {tab === 'login' ? 'Bienvenido de vuelta' : 'Únete a TuHora'}
          </Text>
          <Serif size={36} style={{ marginTop: 10, lineHeight: 40 }}>
            {tab === 'login' ? (
              <>
                Iniciá sesión{'\n'}en tu{' '}
                <Serif size={36} italic>
                  cuenta.
                </Serif>
              </>
            ) : (
              <>
                Empezá tu{'\n'}
                <Serif size={36} italic>
                  experiencia.
                </Serif>
              </>
            )}
          </Serif>

          {/* Segmented tab */}
          <View
            style={{
              marginTop: 32,
              padding: 4,
              backgroundColor: T.pageAlt,
              borderRadius: 14,
              flexDirection: 'row',
            }}
          >
            {(['login', 'register'] as Tab[]).map((t) => (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: 10,
                  backgroundColor: tab === t ? T.surface : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: tab === t ? T.ink : 'transparent',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                }}
              >
                <Text
                  style={{
                    fontSize: 13.5,
                    fontWeight: tab === t ? '700' : '500',
                    color: tab === t ? T.ink : T.muted,
                    letterSpacing: -0.1,
                  }}
                >
                  {t === 'login' ? 'Iniciar sesión' : 'Registrarse'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Fields */}
          <View style={{ marginTop: 28, gap: 14 }}>
            <Field label="Email" value={email} onChangeText={setEmail} focused />
            <Field
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secure={!showPassword}
              trailing={
                <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: T.ink, letterSpacing: -0.1 }}>
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </Pressable>
              }
            />
            {tab === 'login' && (
              <Pressable onPress={handleForgotPassword} hitSlop={6}>
                <Text
                  style={{ textAlign: 'right', fontSize: 13, color: T.ink, fontWeight: '600' }}
                >
                  ¿Olvidaste tu contraseña?
                </Text>
              </Pressable>
            )}
          </View>

          <Btn
            variant="primary"
            size="lg"
            full
            style={{ marginTop: 22 }}
            onPress={() => router.replace('/(client)/home')}
          >
            {tab === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </Btn>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginVertical: 26 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: T.hairline }} />
            <Text style={{ fontSize: 11, color: T.muted, fontWeight: '600', letterSpacing: 0.4 }}>
              o continuá con
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: T.hairline }} />
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              onPress={() => handleSocial('Google')}
              style={({ pressed }) => ({
                flex: 1,
                height: 52,
                borderRadius: 14,
                backgroundColor: T.surface,
                borderWidth: 1,
                borderColor: T.hairlineDk,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 10,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: T.hairline,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#4285F4' }}>G</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: T.ink }}>Google</Text>
            </Pressable>
            <Pressable
              onPress={() => handleSocial('Apple')}
              style={({ pressed }) => ({
                flex: 1,
                height: 52,
                borderRadius: 14,
                backgroundColor: T.ink,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 10,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text style={{ fontSize: 16, color: '#fff' }}></Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>Apple</Text>
            </Pressable>
          </View>

          <Text
            style={{
              fontSize: 11.5,
              color: T.muted,
              textAlign: 'center',
              marginTop: 28,
              lineHeight: 17,
            }}
          >
            Al continuar aceptás nuestros{' '}
            <Text style={{ color: T.ink, fontWeight: '600' }}>Términos</Text> y{' '}
            <Text style={{ color: T.ink, fontWeight: '600' }}>Política de privacidad</Text>.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
