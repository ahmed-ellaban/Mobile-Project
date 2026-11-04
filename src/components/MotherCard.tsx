import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Rating } from '@/components/Stars';
import { Avatar, Bounce, Text } from '@/components/ui';
import type { Mother } from '@/data/types';
import { colors, radius, shadow } from '@/lib/theme';
import { useStore } from '@/store/useStore';

type Props = { mother: Mother; index?: number; compact?: boolean };

/** كارت الأم في القائمة الرئيسية. */
export function MotherCard({ mother, index = 0, compact }: Props) {
  const isFav = useStore((s) => s.favorites.includes(mother.id));
  const toggleFavorite = useStore((s) => s.toggleFavorite);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 70)
        .springify()
        .damping(18)}>
      <Bounce
        onPress={() => router.push({ pathname: '/mother/[id]', params: { id: mother.id } })}
        style={[styles.card, shadow.card, compact && styles.compact]}>
        <Avatar emoji={mother.emoji} paletteIndex={mother.paletteIndex} size={compact ? 56 : 66} radius={radius.md} />
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text weight="black" size={16} numberOfLines={1} style={{ flex: 1 }}>
              {mother.name}
            </Text>
            {mother.isMine && (
              <View style={styles.mine}>
                <Text weight="bold" size={10} color={colors.teal}>
                  مطبخي
                </Text>
              </View>
            )}
          </View>
          <Text size={13} color={colors.muted} numberOfLines={1}>
            {mother.kitchen} · {mother.area}
          </Text>
          <View style={styles.meta}>
            <Rating value={mother.rating} reviews={mother.reviews} />
            <View style={styles.dot} />
            <Ionicons name="time-outline" size={13} color={colors.muted} />
            <Text size={12} color={colors.muted}>
              بترد في {mother.responseMinutes} د
            </Text>
          </View>
          {!compact && (
            <View style={styles.tags}>
              {mother.specialties.slice(0, 3).map((s) => (
                <View key={s} style={styles.tag}>
                  <Text weight="semibold" size={11} color={colors.primaryDark}>
                    {s}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <Bounce onPress={() => toggleFavorite(mother.id)} style={styles.fav} scaleTo={0.8} hitSlop={8}>
          <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={22} color={isFav ? colors.primary : colors.faint} />
        </Bounce>
      </Bounce>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  compact: { marginHorizontal: 0, width: 300, marginEnd: 12, marginBottom: 4 },
  info: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mine: { backgroundColor: colors.tealSoft, paddingHorizontal: 8, borderRadius: radius.pill },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.faint },
  tags: { flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' },
  tag: { backgroundColor: colors.primarySoft, paddingHorizontal: 9, paddingVertical: 2, borderRadius: radius.pill },
  fav: { alignSelf: 'flex-start' },
});
