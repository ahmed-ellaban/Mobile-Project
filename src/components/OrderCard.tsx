import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { StatusBadge } from '@/components/StatusBadge';
import { Avatar, Bounce, Text } from '@/components/ui';
import type { Order } from '@/data/types';
import { egp } from '@/lib/format';
import { colors, radius, shadow } from '@/lib/theme';
import { useMother } from '@/store/useStore';

export function OrderCard({ order, index = 0 }: { order: Order; index?: number }) {
  const mother = useMother(order.motherId);
  const count = order.items.reduce((n, i) => n + i.qty, 0);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60)
        .springify()
        .damping(18)}>
      <Bounce
        onPress={() => router.push({ pathname: '/order/[id]', params: { id: order.id } })}
        style={[styles.card, shadow.card]}>
        <View style={styles.top}>
          {mother && <Avatar emoji={mother.emoji} paletteIndex={mother.paletteIndex} size={46} />}
          <View style={{ flex: 1 }}>
            <Text weight="bold" size={15}>
              {mother?.name ?? 'أم'}
            </Text>
            <Text size={12} color={colors.muted}>
              {count} صنف · {egp(order.subtotal)}
            </Text>
          </View>
          <StatusBadge status={order.status} />
        </View>
        <View style={styles.items}>
          {order.items.slice(0, 3).map((i) => (
            <Text key={i.dishId} size={12} color={colors.muted}>
              {i.emoji} {i.name} ×{i.qty}
            </Text>
          ))}
          {order.items.length > 3 && (
            <Text size={12} color={colors.faint}>
              +{order.items.length - 3} أصناف
            </Text>
          )}
        </View>
        <View style={styles.bottom}>
          <Ionicons name="time-outline" size={15} color={colors.primary} />
          <Text weight="semibold" size={13} color={colors.primary}>
            الاستلام {order.pickupDay} {order.pickupLabel}
          </Text>
          <View style={{ flex: 1 }} />
          <Ionicons name="chevron-back" size={16} color={colors.faint} />
        </View>
      </Bounce>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 12,
    gap: 10,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  items: { gap: 1 },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
});
