import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Counter } from '@/components/Counter';
import { SectionHeader } from '@/components/SectionHeader';
import { Avatar, Bounce, Button, Text } from '@/components/ui';
import { PLATFORM_STATS } from '@/data/mock';
import { egp } from '@/lib/format';
import { colors, radius, shadow } from '@/lib/theme';
import { myImpact, useStore } from '@/store/useStore';

function SplitBar() {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withDelay(
      400,
      withTiming(PLATFORM_STATS.motherSharePercent, { duration: 1200, easing: Easing.out(Easing.cubic) })
    );
  }, [w]);
  const style = useAnimatedStyle(() => ({ width: `${w.value}%` }));
  return (
    <View style={styles.barTrack}>
      <Animated.View style={[styles.barFill, style]} />
    </View>
  );
}

export default function Impact() {
  const insets = useSafeAreaInsets();
  const { orders, mothers, chef } = useStore();
  const mine = myImpact(orders);
  const stories = mothers.filter((m) => !m.isMine).slice(0, 4);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={[styles.hero, { paddingTop: insets.top + 20 }]}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text weight="black" size={26} color={colors.white} lineHeight={36}>
            أكلك بيبني بيوت 💛
          </Text>
          <Text size={14} color="rgba(255,255,255,0.9)" lineHeight={23}>
            أبلة فهيدة اتعملت لهدف واحد: إن أمهات مصر يزوّدوا دخل بيوتهم من موهبتهم في الطبخ، من غير ما يسيبوا ولادهم.
            كل طلب بتعمله هو دخل مباشر لأم.
          </Text>
        </Animated.View>
        <View style={styles.statsRow}>
          <Stat label="أم بتطبخ" value={PLATFORM_STATS.mothers} />
          <Stat label="وجبة الشهر ده" value={PLATFORM_STATS.mealsThisMonth} compactMode />
          <Stat label="جنيه دخل للأمهات" value={PLATFORM_STATS.incomeThisMonth} compactMode />
        </View>
      </LinearGradient>

      {/* توزيع الجنيه */}
      <Animated.View entering={FadeInDown.delay(150)} style={[styles.card, shadow.card]}>
        <Text weight="black" size={17}>
          كل 100 جنيه بتدفعها بتروح فين؟
        </Text>
        <SplitBar />
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.green }]} />
            <Text weight="bold" size={14}>
              {PLATFORM_STATS.motherSharePercent} ج.م للأم
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <Text weight="semibold" size={14} color={colors.muted}>
              {100 - PLATFORM_STATS.motherSharePercent} ج.م تشغيل ودعم
            </Text>
          </View>
        </View>
        <Text size={13} color={colors.muted} lineHeight={21}>
          الأم بتستلم فلوسها في نفس يوم الاستلام. مافيش وسطاء ولا عمولات مخفية.
        </Text>
      </Animated.View>

      {/* أثرك الشخصي */}
      <Animated.View
        entering={FadeInDown.delay(250)}
        style={[styles.card, shadow.card, { backgroundColor: colors.accentSoft }]}>
        <View style={styles.rowBetween}>
          <Text weight="black" size={17}>
            أثرك إنت ✨
          </Text>
          <Ionicons name="sparkles" size={20} color={colors.accentDark} />
        </View>
        {mine.orders === 0 ? (
          <>
            <Text size={14} color={colors.muted} lineHeight={22}>
              لسه ماطلبتش. أول طلب ليك هيدخل دخل مباشر لبيت أم مصرية.
            </Text>
            <Button title="اطلب أول وجبة" variant="accent" onPress={() => router.push('/(tabs)')} />
          </>
        ) : (
          <View style={styles.myStats}>
            <View style={styles.myStat}>
              <Counter to={mine.income} size={24} color={colors.primary} />
              <Text size={12} color={colors.muted}>
                جنيه دخلوا لأمهات
              </Text>
            </View>
            <View style={styles.myStat}>
              <Counter to={mine.mothers} size={24} color={colors.primary} />
              <Text size={12} color={colors.muted}>
                أم ساعدتها
              </Text>
            </View>
            <View style={styles.myStat}>
              <Counter to={mine.meals} size={24} color={colors.primary} />
              <Text size={12} color={colors.muted}>
                وجبة بيتي
              </Text>
            </View>
          </View>
        )}
      </Animated.View>

      {/* قصص الأمهات */}
      <SectionHeader title="قصص من المطبخ 🏠" subtitle="بكلامهم هم" />
      {stories.map((m, i) => (
        <Animated.View key={m.id} entering={FadeInDown.delay(300 + i * 80)}>
          <Bounce
            onPress={() => router.push({ pathname: '/mother/[id]', params: { id: m.id } })}
            style={[styles.story, shadow.card]}>
            <View style={styles.storyTop}>
              <Avatar emoji={m.emoji} paletteIndex={m.paletteIndex} size={46} />
              <View style={{ flex: 1 }}>
                <Text weight="bold" size={15}>
                  {m.name}
                </Text>
                <Text size={12} color={colors.muted}>
                  {m.kitchen} · {m.area} · {m.ordersCount.toLocaleString('en-EG')} طلب
                </Text>
              </View>
            </View>
            <Text size={14} color={colors.text} lineHeight={24} style={styles.quote}>
              ❝ {m.story} ❞
            </Text>
          </Bounce>
        </Animated.View>
      ))}

      {/* دعوة للأمهات */}
      <Animated.View
        entering={FadeInDown.delay(600)}
        style={[styles.card, shadow.card, { backgroundColor: colors.tealSoft }]}>
        <Text weight="black" size={17}>
          إنتي أم وبتطبخي حلو؟ 👩‍🍳
        </Text>
        <Text size={14} color={colors.muted} lineHeight={22}>
          سجّلي مطبخك في دقيقتين، حطي أكلك وأسعارك، واستقبلي طلبات من ناس جنبك. من بيتك وفي وقتك.
        </Text>
        <Button
          title={chef ? 'افتحي لوحة مطبخك' : 'سجّلي مطبخك'}
          variant="dark"
          icon="restaurant-outline"
          onPress={() => router.push(chef ? '/chef' : '/chef/register')}
        />
        <Text size={12} color={colors.faint} center>
          متوسط دخل الأم على المنصة: {egp(5040)} في الشهر
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

function Stat({ label, value, compactMode }: { label: string; value: number; compactMode?: boolean }) {
  return (
    <View style={styles.stat}>
      <Counter to={value} size={22} color={colors.white} compactMode={compactMode} />
      <Text size={11} color="rgba(255,255,255,0.85)" lineHeight={16}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomStartRadius: radius.xl,
    borderBottomEndRadius: radius.xl,
    gap: 20,
  },
  statsRow: { flexDirection: 'row', gap: 8 },
  stat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.md,
    padding: 12,
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: radius.lg,
    padding: 18,
    gap: 12,
  },
  barTrack: { height: 16, borderRadius: 8, backgroundColor: colors.border, overflow: 'hidden' },
  barFill: { height: 16, borderRadius: 8, backgroundColor: colors.green },
  legend: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  myStats: { flexDirection: 'row', gap: 8 },
  myStat: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, padding: 10, alignItems: 'center' },
  story: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: radius.lg,
    padding: 16,
    gap: 10,
  },
  storyTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  quote: { backgroundColor: colors.bg, borderRadius: radius.md, padding: 12 },
});
