import { useEffect, useState } from 'react';
import { Easing, runOnJS, useAnimatedReaction, useSharedValue, withTiming } from 'react-native-reanimated';

import { Text } from '@/components/ui';
import { compact } from '@/lib/format';

type Props = {
  to: number;
  suffix?: string;
  prefixText?: string;
  size?: number;
  color?: string;
  duration?: number;
  compactMode?: boolean;
};

/** عدّاد يرتفع من الصفر للرقم المطلوب بحركة سلسة. */
export function Counter({ to, suffix = '', prefixText = '', size = 28, color, duration = 1400, compactMode }: Props) {
  const progress = useSharedValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(to, { duration, easing: Easing.out(Easing.cubic) });
  }, [to, duration, progress]);

  useAnimatedReaction(
    () => Math.round(progress.value),
    (value, prev) => {
      if (value !== prev) runOnJS(setDisplay)(value);
    }
  );

  const text = compactMode ? compact(display) : display.toLocaleString('en-EG');
  return (
    <Text weight="black" size={size} color={color} lineHeight={size * 1.3}>
      {prefixText}
      {text}
      {suffix}
    </Text>
  );
}
