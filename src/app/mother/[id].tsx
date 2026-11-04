import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BasketBar } from '@/components/BasketBar';
import { DishRow } from '@/components/DishRow';
import { SectionHeader } from '@/components/SectionHeader';
import { Rating, Stars } from '@/components/Stars';
import { Avatar, Bounce, Chip, ConfirmModal, EmptyState, Text, toast } from '@/components/ui';
import { REVIEWS } from '@/data/mock';
import { CATEGORIES, type Category, type Dish } from '@/data/types';
import { colors, palettes, radius, shadow } from '@/lib/theme';
import { useDishesOf, useMother, useStore } from '@/store/useStore';

export default function MotherProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const mother = useMother(id);
  const dishes = useDishesOf(id);
  const { basket, basketMotherId, addToBasket, setQty, replaceBasketWith, favorites, toggleFavorite, mothers } =
    useStore();
  const [category, setCategory] = useState<Category | 'الكل'>('الكل');
  const [conflict, setConflict] = useState<Dish | null>(null);

  const reviews = REVIEWS.filter((r) => r.motherId === id);
  const isFav = favorites.includes(id ?? '');
  const otherMother = mothers.find((m) => m.id === basketMotherId);

  const categories = useMemo(() => {
    const present = new Set(dishes.map((d) => d.category));
    return CATEGORIES.filter((c) => c.key === 'الكل' || present.has(c.key as Category));
  }, [dishes]);

  const visible = dishes.filter((d) => category === 'الكل' || d.category === category);

  if (!mother) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}>
        <EmptyState
          emoji="🤷‍♀️"
          title="المطبخ ده مش موجود"
          body="يمكن الأم وقفت مطبخها مؤقتاً."
          actionLabel="ارجع للرئيسية"
          onAction={() => router.replace('/(tabs)')}
        />
      </View>
    );
  }

  const qtyOf = (dishId: string) => (basketMotherId === id ? (basket.find((l) => l.dishId === dishId)?.qty ?? 0) : 0);

  const change = (dish: Dish, qty: number) => {
    const current = qtyOf(dish.id);
    if (qty > current) {
      const res = addToBasket(dish);
      if (res === 'different-mother') setConflict(dish);
      else if (current === 0) toast(`${dish.emoji} اتضاف للسلة`, 'success');
    } else {
      setQty(dish.id, qty);
    }
  };

  const [from, to] = palettes[mother.paletteIndex % palettes.length];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {/* الرأس */}
        <LinearGradient
          colors={[from, to]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 8 }]}>
          <View style={styles.heroBar}>
            <Bounce onPress={() => router.back()} style={styles.circleBtn}>
              <Ionicons name="arrow-forward" size={22} color={colors.white} />
            </Bounce>
            <View style={{ flex: 1 }} />
            <Bounce onPress={() => toggleFavorite(mother.id)} style={styles.circleBtn} scaleTo={0.8}>
              <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={22} color={colors.white} />
            </Bounce>
          </View>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.heroBody}>
            <Avatar emoji={mother.emoji} paletteIndex={mother.paletteIndex} size={88} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text weight="black" size={22} color={colors.white} lineHeight={30}>
                {mother.name}
              </Text>
              <Text size={14} color="rgba(255,255,255,0.92)">
                {mother.kitchen}
              </Text>
              <View style={styles.heroMeta}>
                <Rating value={mother.rating} reviews={mother.reviews} light />
                <Text size={12} color="rgba(255,255,255,0.85)">
                  · <Ionicons name="location-outline" size={12} /> {mother.area}
                </Text>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* معلومات سريعة */}
        <Animated.View entering={FadeInUp.delay(100)} style={[styles.quick, shadow.card]}>
          <Quick icon="time-outline" label="بترد في" value={`${mother.responseMinutes} د`} />
          <View style={styles.vsep} />
          <Quick icon="restaurant-outline" label="طلب اتنفذ" value={mother.ordersCount.toLocaleString('en-EG')} />
          <View style={styles.vsep} />
          <Quick icon="flame-outline" label="سنة خبرة" value={`${mother.yearsCooking}`} />
          <View style={styles.vsep} />
          <Quick icon="storefront-outline" label="الاستلام" value={`${mother.openFrom} - ${mother.openTo}`} />
        </Animated.View>

        {/* عن الأم + القصة */}
        <Animated.View entering={FadeInUp.delay(160)} style={styles.section}>
          <Text size={14} color={colors.text} lineHeight={24}>
            {mother.bio}
          </Text>
          <View style={styles.story}>
            <View style={styles.storyHead}>
              <Ionicons name="heart" size={16} color={colors.primary} />
              <Text weight="bold" size={14} color={colors.primary}>
                طلبك بيساعد {mother.name} إزاي؟
              </Text>
            </View>
            <Text size={13} color={colors.text} lineHeight={22}>
              {mother.story}
            </Text>
          </View>
          <Bounce
            onPress={() => router.push({ pathname: '/chat/[id]', params: { id: mother.id } })}
            style={styles.chatBtn}>
            <Ionicons name="chatbubble-ellipses" size={20} color={colors.teal} />
            <Text weight="bold" size={14} color={colors.teal}>
              اسأل {mother.name} عن الأكل
            </Text>
          </Bounce>
        </Animated.View>

        {/* القائمة */}
        <SectionHeader title="قائمة الأكل 🍽️" subtitle="كل الأكل بيتعمل في يومه ويتسلم في نفس اليوم" />
        {categories.length > 2 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {categories.map((c) => (
              <Chip
                key={c.key}
                label={c.key}
                emoji={c.emoji}
                active={category === c.key}
                onPress={() => setCategory(c.key)}
              />
            ))}
          </ScrollView>
        )}
        <Animated.View layout={LinearTransition}>
          {visible.length === 0 ? (
            <EmptyState emoji="🍳" title="لسه مافيش أكل هنا" body="الأم لسه ماضافتش أطباق في القائمة." />
          ) : (
            visible.map((d, i) => (
              <DishRow
                key={d.id}
                dish={d}
                qty={qtyOf(d.id)}
                onChange={(q) => change(d, q)}
                index={i}
                paletteIndex={mother.paletteIndex}
              />
            ))
          )}
        </Animated.View>

        {/* الآراء */}
        {reviews.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <SectionHeader title="آراء الزباين ⭐" />
            {reviews.map((r, i) => (
              <Animated.View key={r.id} entering={FadeInDown.delay(i * 70)} style={[styles.review, shadow.card]}>
                <View style={styles.reviewTop}>
                  <Text weight="bold" size={14}>
                    {r.author}
                  </Text>
                  <Stars count={r.stars} />
                </View>
                <Text size={13} color={colors.muted} lineHeight={21}>
                  {r.text}
                </Text>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>

      <BasketBar />

      <ConfirmModal
        visible={!!conflict}
        emoji="🧺"
        title="سلتك فيها أكل من مطبخ تاني"
        body={`عندك أكل من ${otherMother?.name ?? 'أم أخرى'} في السلة. كل حجز بيكون من مطبخ واحد بس. تحب نفضّي السلة ونبدأ من ${mother.name}؟`}
        confirmLabel="أيوه، ابدأ من هنا"
        onConfirm={() => {
          if (conflict) replaceBasketWith(conflict);
          setConflict(null);
        }}
        onCancel={() => setConflict(null)}
      />
    </View>
  );
}

function Quick({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.quickItem}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text weight="black" size={13} lineHeight={18}>
        {value}
      </Text>
      <Text size={10} color={colors.muted} lineHeight={14}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    borderBottomStartRadius: radius.xl,
    borderBottomEndRadius: radius.xl,
  },
  heroBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBody: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  quick: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: -24,
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  quickItem: { flex: 1, alignItems: 'center', gap: 2 },
  vsep: { width: 1, backgroundColor: colors.border, marginVertical: 4 },
  section: { paddingHorizontal: 20, paddingVertical: 18, gap: 12 },
  story: { backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: 14, gap: 6 },
  storyHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.tealSoft,
    borderRadius: radius.md,
    paddingVertical: 12,
  },
  chips: { paddingHorizontal: 20, gap: 8, paddingBottom: 14 },
  review: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: radius.md,
    padding: 14,
    gap: 4,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
