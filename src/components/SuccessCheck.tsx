import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/lib/theme';

function Ring({ delay }: { delay: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withRepeat(withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }), -1));
  }, [delay, p]);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + p.value * 0.9 }],
    opacity: 0.45 * (1 - p.value),
  }));
  return <Animated.View style={[styles.ring, style]} />;
}

/** علامة صح كبيرة تظهر بقفزة مع حلقات تنتشر حولها (شاشة تأكيد الحجز). */
export function SuccessCheck({ size = 120 }: { size?: number }) {
  const scale = useSharedValue(0);
  const rotate = useSharedValue(-20);
  useEffect(() => {
    scale.value = withDelay(120, withSpring(1, { damping: 10, stiffness: 160 }));
    rotate.value = withDelay(120, withSequence(withSpring(8), withSpring(0)));
  }, [scale, rotate]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }] }));

  return (
    <View style={[styles.box, { width: size * 1.6, height: size * 1.6 }]}>
      <Ring delay={0} />
      <Ring delay={600} />
      <Ring delay={1200} />
      <Animated.View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }, style]}>
        <Ionicons name="checkmark" size={size * 0.55} color={colors.white} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
  circle: { backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: colors.green },
});
