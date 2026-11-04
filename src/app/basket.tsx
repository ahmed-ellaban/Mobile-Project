import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { success } from '@/components/ui/haptics';
import { Avatar, Bounce, Button, EmptyState, Field, Screen, Stepper, Text, toast } from '@/components/ui';
import { PLATFORM_STATS } from '@/data/mock';
import { egp } from '@/lib/format';
import { pickupSlots } from '@/lib/slots';
import { colors, radius, shadow } from '@/lib/theme';
import { useBasketSummary, useMother, useStore } from '@/store/useStore';

export default function Basket() {
  const insets = useSafeAreaInsets();
  const summary = useBasketSummary();
  const { basketMotherId, setQty, placeOrder } = useStore();
  const mother = useMother(basketMotherId ?? undefined);
  const slots = useMemo(() => pickupSlots(), []);
  const [slotId, setSlotId] = useState<string | null>(slots[0]?.id ?? null);
  const [note, setNote] = useState('');

  if (summary.count === 0 || !mother) {
    return (
      <Screen title="سلتك" back>
        <EmptyState
          emoji="🧺"
          title="السلة فاضية"
          body="اختار أم من الرئيسية وضيف الأكل اللي نفسك فيه."
          actionLabel="اكتشف المطابخ"
          onAction={() => router.replace('/(tabs)')}
        />
      </Screen>
    );
  }

  const slot = slots.find((s) => s.id === slotId);
  const confirm = () => {
    if (!slot) return toast('اختار وقت الاستلام الأول', 'error');
    const order = placeOrder(slot, note);
    success();
    router.replace({ pathname: '/order/[id]', params: { id: order.id, fresh: '1' } });
  };

  return (
    <Screen title="تأكيد الحجز" subtitle={`من مطبخ ${mother.name}`} back>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 180, paddingTop: 6 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* الأم */}
          <Animated.View entering={FadeInDown.duration(350)} style={[styles.card, shadow.card, styles.motherRow]}>
            <Avatar emoji={mother.emoji} paletteIndex={mother.paletteIndex} size={48} />
            <View style={{ flex: 1 }}>
              <Text weight="bold" size={15}>
                {mother.name} · {mother.kitchen}
              </Text>
              <Text size={12} color={colors.muted}>
                <Ionicons name="location-outline" size={12} /> الاستلام من {mother.area}
              </Text>
            </View>
          </Animated.View>

          {/* الأصناف */}
          <Animated.View layout={LinearTransition} entering={FadeInDown.delay(60)} style={[styles.card, shadow.card]}>
            <Text weight="black" size={16}>
              الأكل اللي اختارته
            </Text>
            {summary.lines.map(({ line, dish }) => (
              <Animated.View key={dish.id} layout={LinearTransition} style={styles.line}>
                <Text size={22} lineHeight={28}>
                  {dish.emoji}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text weight="bold" size={14} numberOfLines={1}>
                    {dish.name}
                  </Text>
                  <Text size={12} color={colors.muted}>
                    {egp(dish.price)} / {dish.unit}
                  </Text>
                </View>
                <Stepper qty={line.qty} onChange={(q) => setQty(dish.id, q)} />
              </Animated.View>
            ))}
          </Animated.View>

          {/* وقت الاستلام */}
          <Animated.View entering={FadeInDown.delay(120)} style={[styles.card, shadow.card]}>
            <View style={styles.rowBetween}>
              <Text weight="black" size={16}>
                هتستلم إمتى؟ ⏰
              </Text>
              <View style={styles.dayTag}>
                <Text weight="bold" size={12} color={colors.primary}>
                  {slots[0]?.day}
                </Text>
              </View>
            </View>
            <Text size={12} color={colors.muted}>
              الأكل بيتعمل طازة، فأقرب موعد بعد ساعتين من دلوقتي.
            </Text>
            <View style={styles.slots}>
              {slots.map((s) => {
                const active = s.id === slotId;
                return (
                  <Bounce
                    key={s.id}
                    onPress={() => setSlotId(s.id)}
                    style={[styles.slot, active && styles.slotActive]}
                    scaleTo={0.94}>
                    <Text weight={active ? 'bold' : 'semibold'} size={13} color={active ? colors.white : colors.text}>
                      {s.label}
                    </Text>
                  </Bounce>
                );
              })}
            </View>
          </Animated.View>

          {/* ملاحظات */}
          <Animated.View entering={FadeInDown.delay(180)} style={[styles.card, shadow.card]}>
            <Field
              label="ملاحظات للأم (اختياري)"
              value={note}
              onChangeText={setNote}
              placeholder="مثال: من غير شطة، أو زوّدي الأرز لو سمحتي"
              multiline
            />
          </Animated.View>

          {/* ملخص */}
          <Animated.View entering={FadeInDown.delay(240)} style={[styles.card, shadow.card]}>
            <Row label="إجمالي الأكل" value={egp(summary.total)} />
            <Row
              label={`نصيب ${mother.name} (${PLATFORM_STATS.motherSharePercent}%)`}
              value={egp(summary.motherShare)}
              tone={colors.green}
            />
            <Row label="تشغيل المنصة" value={egp(summary.total - summary.motherShare)} muted />
            <View style={styles.sep} />
            <Row label="الدفع عند الاستلام" value={egp(summary.total)} big />
            <View style={styles.impact}>
              <Ionicons name="heart" size={18} color={colors.primary} />
              <Text size={13} color={colors.primaryDark} style={{ flex: 1 }} lineHeight={20}>
                بالطلب ده {mother.name} هتكسب {egp(summary.motherShare)} النهارده. شكراً إنك بتدعم مطبخ بيتي 💛
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Button title={`أكّد الحجز · ${egp(summary.total)}`} icon="checkmark-circle" onPress={confirm} />
      </View>
    </Screen>
  );
}

function Row({
  label,
  value,
  tone,
  muted,
  big,
}: {
  label: string;
  value: string;
  tone?: string;
  muted?: boolean;
  big?: boolean;
}) {
  return (
    <View style={styles.rowBetween}>
      <Text weight={big ? 'black' : 'medium'} size={big ? 16 : 14} color={muted ? colors.muted : colors.text}>
        {label}
      </Text>
      <Text weight={big ? 'black' : 'bold'} size={big ? 18 : 14} color={tone ?? (muted ? colors.muted : colors.text)}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: radius.lg,
    padding: 16,
    gap: 10,
  },
  motherRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dayTag: { backgroundColor: colors.primarySoft, paddingHorizontal: 10, paddingVertical: 2, borderRadius: radius.pill },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  slotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sep: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  impact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: 12,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    padding: 16,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
