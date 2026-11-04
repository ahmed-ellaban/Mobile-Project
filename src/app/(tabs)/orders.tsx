import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { OrderCard } from '@/components/OrderCard';
import { Bounce, EmptyState, Screen, Text } from '@/components/ui';
import { colors, radius } from '@/lib/theme';
import { useStore } from '@/store/useStore';

const DONE = ['picked', 'cancelled'];

export default function Orders() {
  const orders = useStore((s) => s.orders);
  const [tab, setTab] = useState<'active' | 'past'>('active');

  const list = useMemo(
    () => orders.filter((o) => (tab === 'active' ? !DONE.includes(o.status) : DONE.includes(o.status))),
    [orders, tab]
  );

  return (
    <Screen title="طلباتي" subtitle="حجوزاتك من مطابخ الأمهات">
      <View style={styles.segment}>
        {(['active', 'past'] as const).map((k) => (
          <Bounce
            key={k}
            onPress={() => setTab(k)}
            style={[styles.segBtn, tab === k && styles.segActive]}
            haptic={false}>
            <Text weight="bold" size={14} color={tab === k ? colors.white : colors.muted}>
              {k === 'active' ? 'الحالية' : 'السابقة'}
            </Text>
          </Bounce>
        ))}
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 110, paddingTop: 6 }} showsVerticalScrollIndicator={false}>
        <Animated.View layout={LinearTransition}>
          {list.length === 0 ? (
            <EmptyState
              emoji={tab === 'active' ? '🍛' : '📜'}
              title={tab === 'active' ? 'مافيش طلبات حالياً' : 'مافيش طلبات سابقة'}
              body={
                tab === 'active'
                  ? 'اختار أم من الرئيسية، واحجز أكلك واستلمه في نفس اليوم.'
                  : 'طلباتك اللي استلمتها هتظهر هنا.'
              }
              actionLabel={tab === 'active' ? 'اكتشف المطابخ' : undefined}
              onAction={() => router.push('/(tabs)')}
            />
          ) : (
            list.map((o, i) => <OrderCard key={o.id} order={o} index={i} />)
          )}
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  segBtn: { flex: 1, paddingVertical: 8, borderRadius: radius.pill, alignItems: 'center' },
  segActive: { backgroundColor: colors.primary },
});
