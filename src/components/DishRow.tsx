import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Avatar, Stepper, Text } from '@/components/ui';
import type { Dish } from '@/data/types';
import { egp } from '@/lib/format';
import { colors, radius, shadow } from '@/lib/theme';

type Props = {
  dish: Dish;
  qty: number;
  onChange: (qty: number) => void;
  index?: number;
  paletteIndex: number;
};

/** صف طبق في قائمة الأم: اسم، وصف، سعر، وعدّاد كمية. */
export function DishRow({ dish, qty, onChange, index = 0, paletteIndex }: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60)
        .springify()
        .damping(18)}
      style={[styles.rowWrap, shadow.card]}>
      <View style={[styles.row, !dish.available && styles.unavailable]}>
        <Avatar emoji={dish.emoji} paletteIndex={paletteIndex + index} size={74} radius={radius.md} />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text weight="bold" size={15} style={{ flex: 1 }} numberOfLines={2}>
              {dish.name}
            </Text>
            {dish.popular && (
              <View style={styles.popular}>
                <Text weight="bold" size={10} color={colors.accentDark}>
                  🔥 الأكثر طلباً
                </Text>
              </View>
            )}
          </View>
          <Text size={12} color={colors.muted} numberOfLines={2}>
            {dish.description}
          </Text>
          <View style={styles.bottom}>
            <View>
              <Text weight="black" size={16} color={colors.primary}>
                {egp(dish.price)}
              </Text>
              <Text size={11} color={colors.faint}>
                {dish.unit} · يكفي {dish.serves}
              </Text>
            </View>
            {dish.available ? (
              <Stepper qty={qty} onChange={onChange} />
            ) : (
              <View style={styles.soldOut}>
                <Text weight="bold" size={12} color={colors.muted}>
                  خلص النهارده
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rowWrap: { backgroundColor: colors.card, borderRadius: radius.lg, marginHorizontal: 20, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12, padding: 12 },
  unavailable: { opacity: 0.6 },
  info: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  popular: { backgroundColor: colors.accentSoft, paddingHorizontal: 8, borderRadius: radius.pill },
  bottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 6 },
  soldOut: {
    backgroundColor: colors.border,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: radius.pill,
    justifyContent: 'center',
  },
});
