import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Counter } from '@/components/Counter';
import { SectionHeader } from '@/components/SectionHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { Bounce, Button, ConfirmModal, Screen, Text, toast } from '@/components/ui';
import { type Order, type OrderStatus } from '@/data/types';
import { egp, relativeTime } from '@/lib/format';
import { colors, radius, shadow } from '@/lib/theme';
import { useDishesOf, useStore } from '@/store/useStore';

const NEXT: Partial<Record<OrderStatus, { to: OrderStatus; label: string }>> = {
  pending: { to: 'accepted', label: 'وافقي على الطلب' },
  accepted: { to: 'cooking', label: 'بدأت أطبخ 🔥' },
  cooking: { to: 'ready', label: 'الأكل جاهز ✅' },
  ready: { to: 'picked', label: 'العميل استلم' },
};

export default function ChefDashboard() {
  const insets = useSafeAreaInsets();
  const { chef, orders, setOrderStatus, toggleDishAvailability, removeDish } = useStore();
  const dishes = useDishesOf(chef?.motherId);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const mine = useMemo(() => orders.filter((o) => o.motherId === chef?.motherId), [orders, chef]);
  const active = mine.filter((o) => !['picked', 'cancelled'].includes(o.status));
  const earned = mine.filter((o) => o.status === 'picked').reduce((n, o) => n + o.motherShare, 0);
  const pendingValue = active.reduce((n, o) => n + o.motherShare, 0);

  if (!chef) return <Redirect href="/chef/register" />;

  return (
    <Screen title={chef.kitchen} subtitle={`لوحة مطبخ ${chef.name}`} back>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingTop: 6 }}
        showsVerticalScrollIndicator={false}>
        {/* الأرباح */}
        <Animated.View entering={FadeInDown} style={[styles.heroWrap, shadow.card]}>
          <LinearGradient
            colors={[colors.teal, '#1F5F60']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}>
            <View style={{ flex: 1 }}>
              <Text size={13} color="rgba(255,255,255,0.85)">
                دخلك اللي استلمتيه
              </Text>
              <Counter to={earned} suffix=" ج.م" size={30} color={colors.white} />
              <Text size={12} color="rgba(255,255,255,0.85)">
                + {egp(pendingValue)} في طلبات شغالة
              </Text>
            </View>
            <View style={styles.heroStats}>
              <Text weight="black" size={22} color={colors.white} lineHeight={28}>
                {active.length}
              </Text>
              <Text size={11} color="rgba(255,255,255,0.85)">
                طلب حالي
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* الطلبات الواردة */}
        <SectionHeader
          title="الطلبات الواردة 📥"
          subtitle={active.length ? 'حدّثي حالة كل طلب أول بأول' : 'أول ما حد يحجز هيظهر هنا'}
        />
        {active.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text size={13} color={colors.muted} center lineHeight={21}>
              مافيش طلبات حالياً. تأكدي إن أكلك متاح وأسعارك واضحة، وشاركي مطبخك مع جيرانك 🙂
            </Text>
          </View>
        ) : (
          active.map((o, i) => (
            <IncomingOrder key={o.id} order={o} index={i} onAdvance={(to) => setOrderStatus(o.id, to)} />
          ))
        )}

        {/* القائمة */}
        <View style={{ marginTop: 16 }}>
          <SectionHeader
            title="أكلك وأسعارك 🍲"
            subtitle={`${dishes.length} طبق`}
            actionLabel="أضيفي طبق"
            onAction={() => router.push('/chef/dish')}
          />
          {dishes.length === 0 && (
            <View style={styles.emptyBox}>
              <Text size={13} color={colors.muted} center>
                ابدئي بإضافة أول طبق: الاسم، السعر، والكمية اللي تكفي كام فرد.
              </Text>
              <Button
                title="أضيفي أول طبق"
                small
                onPress={() => router.push('/chef/dish')}
                style={{ alignSelf: 'center', marginTop: 8 }}
              />
            </View>
          )}
          <Animated.View layout={LinearTransition}>
            {dishes.map((d, i) => (
              <Animated.View
                key={d.id}
                entering={FadeInDown.delay(i * 50)}
                layout={LinearTransition}
                style={[styles.dish, shadow.card]}>
                <View style={[styles.dishInner, !d.available && { opacity: 0.55 }]}>
                  <Text size={28} lineHeight={36}>
                    {d.emoji}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text weight="bold" size={14} numberOfLines={1}>
                      {d.name}
                    </Text>
                    <Text size={12} color={colors.muted}>
                      {egp(d.price)} / {d.unit} · {d.category}
                    </Text>
                  </View>
                  <Switch
                    value={d.available}
                    onValueChange={() => {
                      toggleDishAvailability(d.id);
                      toast(d.available ? 'اتخفى من القائمة النهارده' : 'رجع متاح للطلب', 'info');
                    }}
                    trackColor={{ true: colors.green, false: colors.border }}
                    thumbColor={colors.white}
                  />
                  <Bounce
                    onPress={() => router.push({ pathname: '/chef/dish', params: { id: d.id } })}
                    style={styles.smallBtn}>
                    <Ionicons name="create-outline" size={18} color={colors.primary} />
                  </Bounce>
                  <Bounce onPress={() => setToDelete(d.id)} style={styles.smallBtn}>
                    <Ionicons name="trash-outline" size={18} color={colors.danger} />
                  </Bounce>
                </View>
              </Animated.View>
            ))}
          </Animated.View>
        </View>
      </ScrollView>

      <View style={[styles.fabWrap, { bottom: insets.bottom + 16 }]}>
        <Button
          title="أضيفي طبق جديد"
          icon="add-circle"
          onPress={() => router.push('/chef/dish')}
          style={shadow.float}
        />
      </View>

      <ConfirmModal
        visible={!!toDelete}
        emoji="🗑️"
        title="تمسحي الطبق ده؟"
        body="هيتشال من قائمتك نهائياً. لو عايزة تخفيه النهارده بس، استخدمي زر الإتاحة."
        confirmLabel="أيوه امسحيه"
        onConfirm={() => {
          if (toDelete) removeDish(toDelete);
          setToDelete(null);
          toast('اتمسح الطبق', 'info');
        }}
        onCancel={() => setToDelete(null)}
      />
    </Screen>
  );
}

function IncomingOrder({
  order,
  index,
  onAdvance,
}: {
  order: Order;
  index: number;
  onAdvance: (to: OrderStatus) => void;
}) {
  const userName = useStore((s) => s.userName);
  const next = NEXT[order.status];
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60)}
      layout={LinearTransition}
      style={[styles.order, shadow.card]}>
      <View style={styles.rowBetween}>
        <View>
          <Text weight="bold" size={15}>
            {userName || 'عميل'} · كود {order.code}
          </Text>
          <Text size={12} color={colors.muted}>
            {relativeTime(order.createdAt)} · الاستلام {order.pickupDay} {order.pickupLabel}
          </Text>
        </View>
        <StatusBadge status={order.status} />
      </View>
      <View style={{ gap: 2 }}>
        {order.items.map((i) => (
          <Text key={i.dishId} size={13}>
            {i.emoji} {i.name} <Text color={colors.muted}>×{i.qty}</Text>
          </Text>
        ))}
        {order.note && (
          <Text size={12} color={colors.primaryDark}>
            📝 {order.note}
          </Text>
        )}
      </View>
      <View style={styles.rowBetween}>
        <Text weight="black" size={15} color={colors.green}>
          نصيبك {egp(order.motherShare)}
        </Text>
        {next && <Button title={next.label} small onPress={() => onAdvance(next.to)} />}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  heroWrap: { marginHorizontal: 20, marginBottom: 20, borderRadius: radius.lg },
  hero: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.lg, padding: 18, gap: 12 },
  heroStats: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: radius.md,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: 'center',
  },
  emptyBox: {
    marginHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  order: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: radius.lg,
    padding: 14,
    gap: 10,
  },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  dish: { backgroundColor: colors.card, marginHorizontal: 20, marginBottom: 10, borderRadius: radius.md },
  dishInner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  smallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabWrap: { position: 'absolute', start: 20, end: 20 },
});
