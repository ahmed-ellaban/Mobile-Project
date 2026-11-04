import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/ui';
import type { Message } from '@/data/types';
import { timeLabel } from '@/lib/format';
import { colors, radius } from '@/lib/theme';

export function ChatBubble({ message }: { message: Message }) {
  const mine = message.from === 'me';
  return (
    <Animated.View
      entering={(mine ? FadeInUp : FadeInDown).duration(260)}
      style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
      <Text size={14} color={mine ? colors.white : colors.text} lineHeight={22}>
        {message.text}
      </Text>
      <Text size={10} color={mine ? 'rgba(255,255,255,0.75)' : colors.faint} style={styles.time}>
        {timeLabel(new Date(message.at))}
      </Text>
    </Animated.View>
  );
}

function Dot({ delay }: { delay: number }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-5, { duration: 260, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 260 })
        ),
        -1
      )
    );
  }, [delay, y]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={[styles.dot, style]} />;
}

/** مؤشر «الأم بتكتب...» بثلاث نقاط تتحرك. */
export function TypingDots() {
  return (
    <Animated.View entering={FadeInDown.duration(200)} style={[styles.bubble, styles.theirs, styles.typing]}>
      <Dot delay={0} />
      <Dot delay={120} />
      <Dot delay={240} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.lg, marginBottom: 8 },
  // صاحب الرسالة (أنا) على جهة البداية في الاتجاه من اليمين لليسار = اليمين
  mine: { alignSelf: 'flex-start', backgroundColor: colors.primary, borderTopStartRadius: 6 },
  theirs: {
    alignSelf: 'flex-end',
    backgroundColor: colors.card,
    borderTopEndRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  time: { alignSelf: 'flex-end', marginTop: 2 },
  typing: { flexDirection: 'row', gap: 5, paddingVertical: 14, alignItems: 'center' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.faint },
});
