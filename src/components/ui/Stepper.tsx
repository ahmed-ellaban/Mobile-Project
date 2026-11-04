import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';

import { colors, radius } from '@/lib/theme';

import { Bounce } from './Bounce';
import { Text } from './Text';

type Props = { qty: number; onChange: (qty: number) => void; addLabel?: string };

/** عدّاد كمية: زر «أضف» يتحول لعدّاد (+ / -) بحركة. */
export function Stepper({ qty, onChange, addLabel = 'أضف' }: Props) {
  if (qty <= 0) {
    return (
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
        <Bounce onPress={() => onChange(1)} style={styles.add}>
          <Ionicons name="add" size={18} color={colors.white} />
          <Text weight="bold" size={14} color={colors.white}>
            {addLabel}
          </Text>
        </Bounce>
      </Animated.View>
    );
  }
  return (
    <Animated.View entering={ZoomIn.duration(220)} style={styles.stepper}>
      <Bounce onPress={() => onChange(qty + 1)} style={styles.btn} scaleTo={0.85}>
        <Ionicons name="add" size={18} color={colors.primary} />
      </Bounce>
      <View style={styles.count}>
        <Animated.View key={qty} entering={ZoomIn.duration(180)}>
          <Text weight="black" size={16} color={colors.text}>
            {qty}
          </Text>
        </Animated.View>
      </View>
      <Bounce onPress={() => onChange(qty - 1)} style={styles.btn} scaleTo={0.85}>
        <Ionicons name={qty === 1 ? 'trash-outline' : 'remove'} size={18} color={colors.primary} />
      </Bounce>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  add: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: radius.pill,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    height: 38,
    paddingHorizontal: 4,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: { minWidth: 30, alignItems: 'center' },
});
