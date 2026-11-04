import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { Avatar, Bounce, Text } from '@/components/ui';
import type { Dish } from '@/data/types';
import { egp } from '@/lib/format';
import { colors, radius, shadow } from '@/lib/theme';
import { useMother } from '@/store/useStore';

/** كارت طبق صغير في شريط «الأكثر طلباً» الأفقي. */
export function DishCardSmall({ dish, index = 0 }: { dish: Dish; index?: number }) {
  const mother = useMother(dish.motherId);
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 70)
        .springify()
        .damping(18)}>
      <Bounce
        onPress={() => router.push({ pathname: '/mother/[id]', params: { id: dish.motherId } })}
        style={[styles.card, shadow.card]}>
        <Avatar emoji={dish.emoji} paletteIndex={(mother?.paletteIndex ?? 0) + index} size={132} radius={radius.md} />
        <View style={styles.body}>
          <Text weight="bold" size={14} numberOfLines={1}>
            {dish.name}
          </Text>
          <Text size={12} color={colors.muted} numberOfLines={1}>
            {mother?.name} · {mother?.area}
          </Text>
          <Text weight="black" size={15} color={colors.primary}>
            {egp(dish.price)}
            <Text size={11} color={colors.faint}>
              {' '}
              / {dish.unit}
            </Text>
          </Text>
        </View>
      </Bounce>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { width: 156, backgroundColor: colors.card, borderRadius: radius.lg, padding: 12, gap: 8 },
  body: { gap: 0 },
});
