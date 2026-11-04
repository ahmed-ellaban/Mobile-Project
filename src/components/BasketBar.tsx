import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Bounce, Text } from '@/components/ui';
import { egp } from '@/lib/format';
import { colors, radius, shadow } from '@/lib/theme';
import { useBasketSummary } from '@/store/useStore';

/** شريط السلة العائم في أسفل الشاشة، يظهر أول ما تضيف طبق. */
export function BasketBar() {
  const { count, total, motherShare } = useBasketSummary();
  const insets = useSafeAreaInsets();
  if (count === 0) return null;

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(18)}
      exiting={SlideOutDown.duration(220)}
      style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <Bounce onPress={() => router.push('/basket')} style={[styles.bar, shadow.float]} scaleTo={0.98}>
        <Animated.View key={count} entering={ZoomIn.duration(200)} style={styles.count}>
          <Text weight="black" size={15} color={colors.primary}>
            {count}
          </Text>
        </Animated.View>
        <View style={{ flex: 1 }}>
          <Text weight="bold" size={15} color={colors.white}>
            احجز الأكل · {egp(total)}
          </Text>
          <Text size={11} color="rgba(255,255,255,0.85)">
            💛 {egp(motherShare)} منهم بيروحوا للأم مباشرة
          </Text>
        </View>
        <Ionicons name="arrow-back" size={22} color={colors.white} />
      </Bounce>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', bottom: 0, start: 0, end: 0, paddingHorizontal: 16, paddingTop: 8 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: 12,
  },
  count: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
