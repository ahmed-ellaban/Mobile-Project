import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Bounce, Text } from '@/components/ui';
import { PLATFORM_STATS } from '@/data/mock';
import { compact } from '@/lib/format';
import { colors, radius, shadow } from '@/lib/theme';

/**
 * بانر الرسالة: يوضح للعميل إن كل طلب بيزوّد دخل أم مصرية.
 * فيه قلب بينبض بهدوء كلمسة حركية.
 */
export function MissionBanner() {
  const beat = useSharedValue(1);
  useEffect(() => {
    beat.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 320, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 420, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 900 })
      ),
      -1
    );
  }, [beat]);
  const heart = useAnimatedStyle(() => ({ transform: [{ scale: beat.value }] }));

  return (
    <Bounce onPress={() => router.push('/(tabs)/impact')} scaleTo={0.98} style={[styles.wrap, shadow.card]}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}>
        <View style={styles.circleA} />
        <View style={styles.circleB} />
        <View style={styles.content}>
          <Animated.View style={[styles.heart, heart]}>
            <Ionicons name="heart" size={26} color={colors.white} />
          </Animated.View>
          <View style={{ flex: 1 }}>
            <Text weight="black" size={16} color={colors.white}>
              أكلك بيبني بيت
            </Text>
            <Text size={13} color="rgba(255,255,255,0.9)" lineHeight={20}>
              {PLATFORM_STATS.motherSharePercent}% من كل طلب بيروح مباشرة للأم اللي طبخته. الشهر ده{' '}
              {compact(PLATFORM_STATS.mothers)} أم زادوا دخل بيوتهم.
            </Text>
          </View>
          <Ionicons name="chevron-back" size={20} color="rgba(255,255,255,0.8)" />
        </View>
      </LinearGradient>
    </Bounce>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 20, marginBottom: 20, borderRadius: radius.lg },
  card: { borderRadius: radius.lg, padding: 16, overflow: 'hidden' },
  content: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heart: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleA: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -70,
    end: -40,
  },
  circleB: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -40,
    start: 30,
  },
});
