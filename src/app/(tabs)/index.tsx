import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DishCardSmall } from '@/components/DishCardSmall';
import { MissionBanner } from '@/components/MissionBanner';
import { MotherCard } from '@/components/MotherCard';
import { SectionHeader } from '@/components/SectionHeader';
import { Bounce, Chip, EmptyState, Text } from '@/components/ui';
import { CATEGORIES, type Category } from '@/data/types';
import { greeting } from '@/lib/format';
import { colors, fonts, radius, shadow } from '@/lib/theme';
import { useStore } from '@/store/useStore';

export default function Home() {
  const insets = useSafeAreaInsets();
  const { mothers, dishes, userName } = useStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'الكل'>('الكل');

  const popular = useMemo(() => dishes.filter((d) => d.popular && d.available).slice(0, 8), [dishes]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return mothers.filter((m) => {
      const dishesOf = dishes.filter((d) => d.motherId === m.id);
      const inCategory = category === 'الكل' || dishesOf.some((d) => d.category === category);
      if (!inCategory) return false;
      if (!q) return true;
      return (
        m.name.includes(q) ||
        m.kitchen.includes(q) ||
        m.area.includes(q) ||
        m.specialties.some((s) => s.includes(q)) ||
        dishesOf.some((d) => d.name.includes(q))
      );
    });
  }, [mothers, dishes, query, category]);

  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 110 }}
      showsVerticalScrollIndicator={false}>
      {/* الترحيب */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text size={14} color={colors.muted}>
            {greeting()}
            {userName ? `، ${userName}` : ''} 👋
          </Text>
          <Text weight="black" size={24} lineHeight={34}>
            تحب تاكل إيه النهارده؟
          </Text>
        </View>
        <Bounce onPress={() => router.push('/(tabs)/account')} style={styles.location}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text weight="bold" size={13}>
            القاهرة
          </Text>
        </Bounce>
      </Animated.View>

      {/* البحث */}
      <Animated.View entering={FadeInDown.delay(80).duration(400)} style={[styles.search, shadow.card]}>
        <Ionicons name="search" size={20} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="دوّر على أكلة أو اسم أم أو منطقة..."
          placeholderTextColor={colors.faint}
          style={styles.input}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Bounce onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={20} color={colors.faint} />
          </Bounce>
        )}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(160).duration(400)}>
        <MissionBanner />
      </Animated.View>

      {/* التصنيفات */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {CATEGORIES.map((c, i) => (
          <Animated.View key={c.key} entering={FadeInUp.delay(200 + i * 40)}>
            <Chip label={c.key} emoji={c.emoji} active={category === c.key} onPress={() => setCategory(c.key)} />
          </Animated.View>
        ))}
      </ScrollView>

      {/* الأكثر طلباً */}
      {!query && category === 'الكل' && (
        <View style={{ marginBottom: 20 }}>
          <SectionHeader title="الأكثر طلباً النهارده 🔥" subtitle="أطباق الناس بتحبها وبتطلبها كل يوم" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
            {popular.map((d, i) => (
              <DishCardSmall key={d.id} dish={d} index={i} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* الأمهات */}
      <SectionHeader
        title={query || category !== 'الكل' ? 'نتائج البحث' : 'أمهات قريبة منك 🏠'}
        subtitle={`${filtered.length} مطبخ متاح النهارده`}
      />
      <Animated.View layout={LinearTransition}>
        {filtered.length === 0 ? (
          <EmptyState emoji="🥄" title="مالقيناش حاجة" body="جرّب تدوّر باسم أكلة تانية أو غيّر التصنيف." />
        ) : (
          filtered.map((m, i) => <MotherCard key={m.id} mother={m} index={i} />)
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14, gap: 10 },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    marginHorizontal: 20,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 18,
  },
  input: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
    textAlign: 'right',
    writingDirection: 'rtl',
    height: 52,
  },
  chips: { paddingHorizontal: 20, gap: 8, paddingBottom: 20 },
  hList: { paddingHorizontal: 20, gap: 12 },
});
