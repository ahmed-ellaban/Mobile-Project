import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { colors } from '@/lib/theme';

import { Button } from './Button';
import { Text } from './Text';

type Props = { emoji: string; title: string; body: string; actionLabel?: string; onAction?: () => void };

export function EmptyState({ emoji, title, body, actionLabel, onAction }: Props) {
  return (
    <Animated.View entering={FadeInUp.duration(400)} style={styles.box}>
      <View style={styles.emojiBox}>
        <Text size={44} lineHeight={56}>
          {emoji}
        </Text>
      </View>
      <Text weight="black" size={20} center>
        {title}
      </Text>
      <Text size={14} color={colors.muted} center style={{ maxWidth: 280 }}>
        {body}
      </Text>
      {actionLabel && onAction && <Button title={actionLabel} onPress={onAction} style={{ marginTop: 8 }} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 40 },
  emojiBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
});
