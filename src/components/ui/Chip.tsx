import { StyleSheet } from 'react-native';

import { colors, radius } from '@/lib/theme';

import { Bounce } from './Bounce';
import { Text } from './Text';

type Props = { label: string; active?: boolean; onPress?: () => void; emoji?: string };

export function Chip({ label, active, onPress, emoji }: Props) {
  return (
    <Bounce onPress={onPress} scaleTo={0.93} style={[styles.chip, active ? styles.active : styles.idle]}>
      <Text weight={active ? 'bold' : 'semibold'} size={14} color={active ? colors.white : colors.text}>
        {emoji ? `${emoji} ${label}` : label}
      </Text>
    </Bounce>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1.5 },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
  idle: { backgroundColor: colors.card, borderColor: colors.border },
});
