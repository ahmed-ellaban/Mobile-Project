import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { STATUS_LABEL, type OrderStatus } from '@/data/types';
import { colors, radius } from '@/lib/theme';

const TONE: Record<OrderStatus, { bg: string; fg: string }> = {
  pending: { bg: colors.accentSoft, fg: colors.accentDark },
  accepted: { bg: colors.tealSoft, fg: colors.teal },
  cooking: { bg: colors.primarySoft, fg: colors.primary },
  ready: { bg: colors.greenSoft, fg: colors.green },
  picked: { bg: colors.border, fg: colors.muted },
  cancelled: { bg: colors.border, fg: colors.muted },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const t = TONE[status];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text weight="bold" size={12} color={t.fg}>
        {STATUS_LABEL[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill, alignSelf: 'flex-start' },
});
