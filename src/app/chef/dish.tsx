import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Bounce, Button, Chip, Field, Screen, Text, toast } from '@/components/ui';
import { success } from '@/components/ui/haptics';
import { CATEGORIES, type Category } from '@/data/types';
import { PLATFORM_STATS } from '@/data/mock';
import { egp } from '@/lib/format';
import { colors, radius, shadow } from '@/lib/theme';
import { useStore } from '@/store/useStore';

const EMOJIS = [
  '🍲',
  '🥘',
  '🍛',
  '🍚',
  '🫓',
  '🥙',
  '🍗',
  '🥗',
  '🍮',
  '🥧',
  '🫑',
  '🍆',
  '🥬',
  '🍯',
  '🥨',
  '🕊️',
  '🦆',
  '🧅',
  '🥔',
  '🍃',
];
const UNITS = ['طبق', 'طاجن', 'صينية', 'كيلو', 'علبة', 'قطعة', 'فرخة'];

export default function DishForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = useStore((s) => s.dishes.find((d) => d.id === id));
  const upsertDish = useStore((s) => s.upsertDish);

  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [price, setPrice] = useState(existing ? String(existing.price) : '');
  const [unit, setUnit] = useState(existing?.unit ?? UNITS[0]);
  const [serves, setServes] = useState(existing ? String(existing.serves) : '2');
  const [category, setCategory] = useState<Category>(existing?.category ?? 'طواجن');
  const [emoji, setEmoji] = useState(existing?.emoji ?? EMOJIS[0]);

  const priceNum = Number(price) || 0;

  const save = () => {
    if (!name.trim()) return toast('اكتبي اسم الطبق', 'error');
    if (priceNum <= 0) return toast('اكتبي سعر صحيح', 'error');
    upsertDish({
      id: existing?.id,
      name: name.trim(),
      description: description.trim() || 'أكل بيتي طازة بيتعمل في يومه',
      price: priceNum,
      unit,
      serves: Math.max(1, Number(serves) || 1),
      category,
      emoji,
      available: existing?.available ?? true,
      popular: existing?.popular,
    });
    success();
    toast(existing ? 'تم تعديل الطبق' : 'الطبق اتضاف لقائمتك 🎉', 'success');
    router.back();
  };

  return (
    <Screen title={existing ? 'تعديل الطبق' : 'طبق جديد'} back>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Animated.View entering={FadeInDown} style={{ gap: 8 }}>
            <Text weight="bold" size={14}>
              اختاري رمز للطبق
            </Text>
            <View style={styles.emojis}>
              {EMOJIS.map((e) => (
                <Bounce
                  key={e}
                  onPress={() => setEmoji(e)}
                  style={[styles.emoji, emoji === e && styles.emojiActive]}
                  scaleTo={0.85}>
                  <Text size={24} lineHeight={30}>
                    {e}
                  </Text>
                </Bounce>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(60)} style={{ gap: 16 }}>
            <Field label="اسم الطبق" value={name} onChangeText={setName} placeholder="مثال: محشي كرنب باللحمة" />
            <Field
              label="وصف قصير"
              value={description}
              onChangeText={setDescription}
              placeholder="المكونات، طريقة الطبخ، أي حاجة تميّزه"
              multiline
            />
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Field
                  label="السعر"
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0"
                  keyboardType="numeric"
                  suffix="ج.م"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Field
                  label="يكفي كام فرد"
                  value={serves}
                  onChangeText={setServes}
                  placeholder="2"
                  keyboardType="numeric"
                  suffix="فرد"
                />
              </View>
            </View>
            {priceNum > 0 && (
              <View style={[styles.share, shadow.card]}>
                <Text size={13} color={colors.text} lineHeight={21}>
                  💛 نصيبك من كل طلب:{' '}
                  <Text weight="black" color={colors.green}>
                    {egp((priceNum * PLATFORM_STATS.motherSharePercent) / 100)}
                  </Text>{' '}
                  ({PLATFORM_STATS.motherSharePercent}%)
                </Text>
              </View>
            )}
            <View style={{ gap: 8 }}>
              <Text weight="bold" size={14}>
                الوحدة
              </Text>
              <View style={styles.chips}>
                {UNITS.map((u) => (
                  <Chip key={u} label={u} active={unit === u} onPress={() => setUnit(u)} />
                ))}
              </View>
            </View>
            <View style={{ gap: 8 }}>
              <Text weight="bold" size={14}>
                التصنيف
              </Text>
              <View style={styles.chips}>
                {CATEGORIES.filter((c) => c.key !== 'الكل').map((c) => (
                  <Chip
                    key={c.key}
                    label={c.key}
                    emoji={c.emoji}
                    active={category === c.key}
                    onPress={() => setCategory(c.key as Category)}
                  />
                ))}
              </View>
            </View>
          </Animated.View>

          <Button title={existing ? 'حفظ التعديل' : 'أضيفي الطبق'} onPress={save} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 20, gap: 20, paddingBottom: 60 },
  emojis: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emoji: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  emojiActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  row: { flexDirection: 'row', gap: 12 },
  share: { backgroundColor: colors.greenSoft, borderRadius: radius.md, padding: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
