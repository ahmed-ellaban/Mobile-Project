import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { colors } from '@/lib/theme';

export function Rating({ value, reviews, light }: { value: number; reviews?: number; light?: boolean }) {
  const fg = light ? colors.white : colors.text;
  return (
    <View style={styles.row}>
      <Ionicons name="star" size={14} color={colors.accent} />
      <Text weight="bold" size={13} color={fg}>
        {value.toFixed(1)}
      </Text>
      {reviews !== undefined && (
        <Text size={12} color={light ? 'rgba(255,255,255,0.8)' : colors.muted}>
          ({reviews})
        </Text>
      )}
    </View>
  );
}

export function Stars({ count }: { count: number }) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons key={i} name={i <= count ? 'star' : 'star-outline'} size={13} color={colors.accent} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: 3 } });
