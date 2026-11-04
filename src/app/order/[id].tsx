import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StatusBadge } from '@/components/StatusBadge';
import { SuccessCheck } from '@/components/SuccessCheck';
import { Avatar, Bounce, Button, EmptyState, Screen, Text, toast } from '@/components/ui';
import { success } from '@/components/ui/haptics';
import { type OrderStatus } from '@/data/types';
import { egp } from '@/lib/format';
import { colors, radius, shadow } from '@/lib/theme';
import { useMother, useStore } from '@/store/useStore';

const STEPS: { key: OrderStatus; label: string; hint: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'pending', label: 'الطلب وصل للأم', hint: 'بتراجع الطلب وهتوافق خلال دقايق', icon: 'paper-plane-outline' },
  { key: 'accepted', label: 'الأم وافقت', hint: 'بدأت تجهّز المكونات', icon: 'thumbs-up-outline' },
  { key: 'cooking', label: 'الأكل على النار', hint: 'ريحته وصلت لحد عندنا 😋', icon: 'flame-outline' },
  { key: 'ready', label: 'جاهز للاستلام', hint: 'روح استلم في معادك وقول كود الاستلام', icon: 'bag-check-outline' },
];
const ORDER: OrderStatus[] = ['pending', 'accepted', 'cooking', 'ready', 'picked'];

export default function OrderDetails() {
  const { id, fresh } = useLocalSearchParams<{ id: string; fresh?: string }>();
  const insets = useSafeAreaInsets();
  const order = useStore((s) => s.orders.find((o) => o.id === id));
  const setOrderStatus = useStore((s) => s.setOrderStatus);
  const mother = useMother(order?.motherId);

  // محاكاة تقدّم الطلب في النسخة التجريبية (لو الطلب لمطبخ أم أخرى، مش مطبخي)
  useEffect(() => {
    if (!order || mother?.isMine) return;
    const idx = ORDER.indexOf(order.status);
    if (idx < 0 || idx >= 3) return;
    const t = setTimeout(() => setOrderStatus(order.id, ORDER[idx + 1]), 7000);
    return () => clearTimeout(t);
  }, [order, mother?.isMine, setOrderStatus]);

  if (!order) {
    return (
      <Screen title="الطلب" back>
        <EmptyState
          emoji="🔍"
          title="مالقيناش الطلب"
          body="يمكن اتمسح أو الرابط غلط."
          actionLabel="طلباتي"
          onAction={() => router.replace('/(tabs)/orders')}
        />
      </Screen>
    );
  }

  const stepIndex = ORDER.indexOf(order.status);
  const done = order.status === 'picked' || order.status === 'cancelled';

  return (
    <Screen title={fresh ? 'تم الحجز 🎉' : 'تفاصيل الطلب'} back>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 120, paddingTop: 6 }}
        showsVerticalScrollIndicator={false}>
        {fresh && (
          <Animated.View entering={FadeInDown} style={styles.success}>
            <SuccessCheck size={110} />
            <Text weight="black" size={22} center>
              تمام يا {mother?.name ? 'بطل' : ''}! حجزك وصل 🎉
            </Text>
            <Text size={14} color={colors.muted} center lineHeight={22}>
              {mother?.name} استلمت طلبك وهتوافق خلال {mother?.responseMinutes ?? 5} دقايق.
            </Text>
          </Animated.View>
        )}

        {/* كود الاستلام */}
        <Animated.View entering={FadeInDown.delay(150)} style={[styles.card, shadow.card, styles.codeCard]}>
          <View style={{ flex: 1 }}>
            <Text size={12} color="rgba(255,255,255,0.85)">
              كود الاستلام · قوله للأم
            </Text>
            <Text weight="black" size={34} color={colors.white} lineHeight={44}>
              {order.code}
            </Text>
          </View>
          <View style={styles.codeTime}>
            <Ionicons name="time" size={18} color={colors.white} />
            <Text weight="bold" size={13} color={colors.white}>
              {order.pickupDay}
            </Text>
            <Text size={12} color="rgba(255,255,255,0.9)">
              {order.pickupLabel}
            </Text>
          </View>
        </Animated.View>

        {/* الحالة */}
        <Animated.View entering={FadeInDown.delay(220)} style={[styles.card, shadow.card]}>
          <View style={styles.rowBetween}>
            <Text weight="black" size={16}>
              حالة الطلب
            </Text>
            <StatusBadge status={order.status} />
          </View>
          {order.status === 'cancelled' ? (
            <Text size={14} color={colors.muted}>
              الطلب ده اتلغى.
            </Text>
          ) : (
            <View style={{ gap: 2 }}>
              {STEPS.map((s, i) => {
                const reached = stepIndex >= i;
                const current = stepIndex === i && !done;
                return (
                  <Animated.View key={s.key} layout={LinearTransition} style={styles.step}>
                    <View style={styles.stepLine}>
                      <View style={[styles.stepDot, reached && styles.stepDotOn, current && styles.stepDotNow]}>
                        <Ionicons
                          name={reached && !current ? 'checkmark' : s.icon}
                          size={14}
                          color={reached ? colors.white : colors.faint}
                        />
                      </View>
                      {i < STEPS.length - 1 && <View style={[styles.stepBar, stepIndex > i && styles.stepBarOn]} />}
                    </View>
                    <View style={{ flex: 1, paddingBottom: 14 }}>
                      <Text weight={current ? 'black' : 'bold'} size={14} color={reached ? colors.text : colors.faint}>
                        {s.label}
                      </Text>
                      {(current || (i === 3 && done)) && (
                        <Text size={12} color={colors.muted}>
                          {s.hint}
                        </Text>
                      )}
                    </View>
                  </Animated.View>
                );
              })}
            </View>
          )}
          {order.status === 'ready' && (
            <Button
              title="استلمت الأكل ✅"
              variant="primary"
              onPress={() => {
                setOrderStatus(order.id, 'picked');
                success();
                toast('بالهنا والشفا! 🍽️', 'success');
              }}
            />
          )}
        </Animated.View>

        {/* الأم */}
        {mother && (
          <Animated.View entering={FadeInDown.delay(280)} style={[styles.card, shadow.card, styles.motherRow]}>
            <Avatar emoji={mother.emoji} paletteIndex={mother.paletteIndex} size={50} />
            <View style={{ flex: 1 }}>
              <Text weight="bold" size={15}>
                {mother.name}
              </Text>
              <Text size={12} color={colors.muted}>
                <Ionicons name="location-outline" size={12} /> الاستلام من {mother.area}
              </Text>
            </View>
            <Bounce
              onPress={() => router.push({ pathname: '/chat/[id]', params: { id: mother.id } })}
              style={styles.chatBtn}>
              <Ionicons name="chatbubble-ellipses" size={20} color={colors.white} />
            </Bounce>
          </Animated.View>
        )}

        {/* الأصناف */}
        <Animated.View entering={FadeInDown.delay(340)} style={[styles.card, shadow.card]}>
          <Text weight="black" size={16}>
            الأكل
          </Text>
          {order.items.map((i) => (
            <View key={i.dishId} style={styles.item}>
              <Text size={20} lineHeight={26}>
                {i.emoji}
              </Text>
              <Text weight="semibold" size={14} style={{ flex: 1 }}>
                {i.name} <Text color={colors.muted}>×{i.qty}</Text>
              </Text>
              <Text weight="bold" size={14}>
                {egp(i.price * i.qty)}
              </Text>
            </View>
          ))}
          {order.note && (
            <View style={styles.note}>
              <Ionicons name="chatbox-ellipses-outline" size={16} color={colors.muted} />
              <Text size={13} color={colors.muted} style={{ flex: 1 }}>
                {order.note}
              </Text>
            </View>
          )}
          <View style={styles.sep} />
          <View style={styles.rowBetween}>
            <Text weight="black" size={16}>
              الإجمالي (كاش عند الاستلام)
            </Text>
            <Text weight="black" size={18} color={colors.primary}>
              {egp(order.subtotal)}
            </Text>
          </View>
        </Animated.View>

        {/* الأثر */}
        <Animated.View entering={FadeInDown.delay(400)} style={[styles.card, shadow.card, styles.impact]}>
          <View style={styles.heart}>
            <Ionicons name="heart" size={24} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text weight="black" size={15} color={colors.white}>
              أثر طلبك ده
            </Text>
            <Text size={13} color="rgba(255,255,255,0.92)" lineHeight={21}>
              {egp(order.motherShare)} هيوصلوا لـ {mother?.name ?? 'الأم'} في نفس يوم الاستلام. ده دخل بيتها من شغل
              إيدها. شكراً 💛
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {fresh && (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <Button title="ارجع للرئيسية" variant="secondary" onPress={() => router.replace('/(tabs)')} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  success: { alignItems: 'center', gap: 6, paddingHorizontal: 30, paddingBottom: 10 },
  card: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: radius.lg,
    padding: 16,
    gap: 10,
  },
  codeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.text, gap: 12 },
  codeTime: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 0,
  },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  step: { flexDirection: 'row', gap: 12 },
  stepLine: { alignItems: 'center', width: 28 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotOn: { backgroundColor: colors.green },
  stepDotNow: { backgroundColor: colors.primary },
  stepBar: { width: 3, flex: 1, backgroundColor: colors.border, marginVertical: 2, borderRadius: 2 },
  stepBarOn: { backgroundColor: colors.green },
  motherRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chatBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    padding: 10,
  },
  sep: { height: 1, backgroundColor: colors.border },
  impact: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.primary },
  heart: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { position: 'absolute', bottom: 0, start: 0, end: 0, padding: 16, backgroundColor: colors.bg },
});
