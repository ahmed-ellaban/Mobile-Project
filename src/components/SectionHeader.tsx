import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Bounce, Text } from '@/components/ui';
import { colors } from '@/lib/theme';

type Props = { title: string; subtitle?: string; actionLabel?: string; onAction?: () => void };

export function SectionHeader({ title, subtitle, actionLabel, onAction }: Props) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text weight="black" size={18}>
          {title}
        </Text>
        {subtitle && (
          <Text size={13} color={colors.muted}>
            {subtitle}
          </Text>
        )}
      </View>
      {actionLabel && (
        <Bounce onPress={onAction} style={styles.action}>
          <Text weight="bold" size={13} color={colors.primary}>
            {actionLabel}
          </Text>
          <Ionicons name="chevron-back" size={14} color={colors.primary} />
        </Bounce>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
