import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOutUp, LinearTransition, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Bounce, Button, Text } from '@/components/ui';
import { colors, radius } from '@/lib/theme';
import { useStore } from '@/store/useStore';

const SLIDES = [
  {
    emoji: '🍲',
    title: 'أكل بيتي من إيد ماما',
    body: 'أمهات مصريات بيطبخوا من بيوتهم بحب، ونفس طعم أكل البيت اللي بتحبه.',
  },
  {
    emoji: '⏰',
    title: 'احجز واستلم في نفس اليوم',
    body: 'اختار الأكل، حدّد وقت الاستلام، والأكل بيكون سخن وجاهز في معاده.',
  },
  {
    emoji: '💛',
    title: 'كل طلب بيزوّد دخل بيت',
    body: '85% من كل طلب بيروح للأم مباشرة. أكلك بيساعد أمهات يصرفوا على ولادهم بكرامة.',
  },
];

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const { hydrated, onboarded, finishOnboarding } = useStore();
  const [i, setI] = useState(0);

  if (!hydrated) return <View style={{ flex: 1, backgroundColor: colors.primary }} />;
  if (onboarded) return <Redirect href="/(tabs)" />;

  const last = i === SLIDES.length - 1;
  const slide = SLIDES[i];

  const next = () => {
    if (last) {
      finishOnboarding();
      router.replace('/(tabs)');
    } else {
      setI(i + 1);
    }
  };

  return (
    <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.root}>
      <View style={[styles.top, { paddingTop: insets.top + 16 }]}>
        <Animated.View entering={FadeIn.delay(100)} style={styles.brandRow}>
          <Text weight="black" size={22} color={colors.white}>
            أبلة فهيدة
          </Text>
          <Text size={13} color="rgba(255,255,255,0.85)">
            أكل بيتي · بإيد أمهات مصر
          </Text>
        </Animated.View>
        <Bounce
          onPress={() => {
            finishOnboarding();
            router.replace('/(tabs)');
          }}
          haptic={false}>
          <Text weight="semibold" size={14} color="rgba(255,255,255,0.85)">
            تخطّي
          </Text>
        </Bounce>
      </View>

      <View style={styles.center}>
        <Animated.View
          key={`e${i}`}
          entering={ZoomIn.springify().damping(12)}
          exiting={FadeOutUp.duration(180)}
          style={styles.emojiBox}>
          <Text size={96} lineHeight={120}>
            {slide.emoji}
          </Text>
        </Animated.View>
        <Animated.View
          key={`t${i}`}
          entering={FadeInDown.delay(120).springify().damping(16)}
          exiting={FadeOutUp.duration(180)}
          style={{ gap: 8 }}>
          <Text weight="black" size={28} color={colors.white} center lineHeight={40}>
            {slide.title}
          </Text>
          <Text size={16} color="rgba(255,255,255,0.9)" center lineHeight={27} style={{ maxWidth: 320 }}>
            {slide.body}
          </Text>
        </Animated.View>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, k) => (
            <Animated.View
              key={k}
              layout={LinearTransition.springify()}
              style={[styles.dot, k === i && styles.dotActive]}
            />
          ))}
        </View>
        <Button title={last ? 'يلا نبدأ 🍽️' : 'التالي'} variant="accent" onPress={next} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 24 },
  brandRow: { gap: 0 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 24 },
  emojiBox: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: { paddingHorizontal: 24, gap: 20 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { width: 28, backgroundColor: colors.accent },
});
