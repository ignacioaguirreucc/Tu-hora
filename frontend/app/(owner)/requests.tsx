import { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar, Avatar, Btn, Card, Chip, Mono, Pill } from '@/components/ui';
import { IcClock } from '@/components/icons';
import { T, fonts, type AvatarTone } from '@/theme';

type ReqStatus = 'pending' | 'accepted' | 'rejected';

type Req = {
  id: string;
  n: string;
  s: string;
  when: string;
  p: number;
  tone: AvatarTone;
  status: ReqStatus;
};

const INITIAL: Req[] = [
  { id: 'r1', n: 'Andrés Torres', s: 'Odontólogo · Consultorio 2', when: 'Mañana · 14:00-18:00', p: 13000, tone: 'olive', status: 'pending' },
  { id: 'r2', n: 'Mía Sosa', s: 'Esteticista · Camilla 1', when: 'Sáb · 09:00-13:00', p: 9500, tone: 'plum', status: 'pending' },
  { id: 'r3', n: 'Pablo Iglesias', s: 'Barbero · Sillón 2', when: 'Jue · 15:00-19:00', p: 8000, tone: 'plum', status: 'pending' },
];

const TABS: { label: string; value: ReqStatus }[] = [
  { label: 'Pendientes', value: 'pending' },
  { label: 'Aceptadas', value: 'accepted' },
  { label: 'Rechazadas', value: 'rejected' },
];

export default function OwnerRequestsScreen() {
  const [items, setItems] = useState<Req[]>(INITIAL);
  const [tab, setTab] = useState<ReqStatus>('pending');

  const visible = useMemo(() => items.filter((r) => r.status === tab), [items, tab]);
  const pendingCount = items.filter((r) => r.status === 'pending').length;

  const updateStatus = (id: string, status: ReqStatus, name: string) => {
    setItems((arr) => arr.map((r) => (r.id === id ? { ...r, status } : r)));
    Alert.alert(
      status === 'accepted' ? 'Solicitud aceptada' : 'Solicitud rechazada',
      status === 'accepted' ? `Le avisamos a ${name}.` : `Notificamos a ${name}.`,
    );
  };

  const confirm = (id: string, name: string, accept: boolean) =>
    Alert.alert(
      accept ? `Aceptar a ${name}` : `Rechazar a ${name}`,
      accept ? '¿Confirmás aceptar?' : '¿Querés rechazar?',
      [
        { text: 'Volver', style: 'cancel' },
        {
          text: accept ? 'Aceptar' : 'Rechazar',
          style: accept ? 'default' : 'destructive',
          onPress: () => updateStatus(id, accept ? 'accepted' : 'rejected', name),
        },
      ],
    );

  return (
    <View style={{ flex: 1, backgroundColor: T.page }}>
      <SafeAreaView edges={['top']}>
        <AppBar title="Solicitudes" sub={`${pendingCount} pendientes`} large />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingBottom: 16 }}
        >
          {TABS.map((t) => (
            <Chip key={t.value} active={tab === t.value} onPress={() => setTab(t.value)}>
              {t.label}
            </Chip>
          ))}
        </ScrollView>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {visible.length === 0 ? (
            <Card pad={28} radius={16}>
              <Text style={{ fontSize: 14, color: T.muted, textAlign: 'center', fontWeight: '500' }}>
                No hay solicitudes en esta categoría.
              </Text>
            </Card>
          ) : (
            visible.map((r) => (
              <Card key={r.id} pad={16} radius={16} elevation="sm">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Avatar name={r.n} tone={r.tone} size={44} verified />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: fonts.sansSemi,
                        fontSize: 14.5,
                        letterSpacing: -0.2,
                      }}
                    >
                      {r.n}
                    </Text>
                    <Text style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{r.s}</Text>
                  </View>
                  <Mono tnum style={{ fontSize: 15, fontWeight: '700', letterSpacing: -0.3 }}>
                    ${r.p.toLocaleString('es-AR')}
                  </Mono>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 12,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: T.hairline,
                  }}
                >
                  <IcClock size={12} color={T.muted} />
                  <Text style={{ flex: 1, fontSize: 12, color: T.muted }}>{r.when}</Text>
                  {r.status === 'pending' ? (
                    <>
                      <Btn variant="secondary" size="sm" onPress={() => confirm(r.id, r.n, false)}>
                        Rechazar
                      </Btn>
                      <Btn variant="primary" size="sm" onPress={() => confirm(r.id, r.n, true)}>
                        Aceptar
                      </Btn>
                    </>
                  ) : (
                    <Pill tone={r.status === 'accepted' ? 'success' : 'danger'} size="sm" dot>
                      {r.status === 'accepted' ? 'Aceptada' : 'Rechazada'}
                    </Pill>
                  )}
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
