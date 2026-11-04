import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button, Chip, Field, Screen, Text, toast } from '@/components/ui';
import { success } from '@/components/ui/haptics';
import { AREAS, PLATFORM_STATS } from '@/data/mock';
import { egp } from '@/lib/format';
import { colors, radius, shadow } from '@/lib/theme';
import { useStore } from '@/store/useStore';

export default function ChefRegister() {
  const registerChef = useStore((s) => s.registerChef);
  const [name, setName] = useState('');
  const [kitchen, setKitchen] = useState('');
  const [area, setArea] = useState(AREAS[0]);
  const [bio, setBio] = useState('');

  const submit = () => {
    if (!name.trim() || !kitchen.trim()) return toast('اكتبي اسمك واسم مطبخك', 'error');
    registerChef({
      name: name.trim(),
      kitchen: kitchen.trim(),
      area,
      bio: bio.trim() || 'أكل بيتي بحب، بيتعمل في يومه.',
    });
    success();
    toast('مبروك! مطبخك بقى على أبلة فهيدة 🎉', 'success');
    router.replace('/chef');
  };

  return (
    <Screen title="سجّلي مطبخك" subtitle="دقيقتين وتبدئي تستقبلي طلبات" back>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Animated.View entering={FadeInDown} style={[styles.promo, shadow.card]}>
            <Text size={30} lineHeight={38}>
              👩‍🍳
            </Text>
            <View style={{ flex: 1 }}>
              <Text weight="black" size={15} color={colors.white}>
                إنتي بتحددي الأكل والسعر والوقت
              </Text>
              <Text size={12} color="rgba(255,255,255,0.9)" lineHeight={19}>
                {PLATFORM_STATS.motherSharePercent}% من كل طلب ليكي، وبتستلمي فلوسك في نفس اليوم. متوسط دخل الأم{' '}
                {egp(5040)} شهرياً.
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80)} style={{ gap: 16 }}>
            <Field label="اسمك زي ما الناس هتشوفه" value={name} onChangeText={setName} placeholder="مثال: ماما هدى" />
            <Field label="اسم مطبخك" value={kitchen} onChangeText={setKitchen} placeholder="مثال: مطبخ ست الحبايب" />
            <View style={{ gap: 8 }}>
              <Text weight="bold" size={14}>
                منطقتك (مكان الاستلام)
              </Text>
              <View style={styles.areas}>
                {AREAS.map((a) => (
                  <Chip key={a} label={a} active={area === a} onPress={() => setArea(a)} />
                ))}
              </View>
            </View>
            <Field
              label="كلمتين عن أكلك"
              value={bio}
              onChangeText={setBio}
              placeholder="مثال: بطبخ من 20 سنة، تخصصي المحشي والطواجن..."
              multiline
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(160)} style={styles.terms}>
            <Text size={12} color={colors.muted} lineHeight={20}>
              بالتسجيل إنتي موافقة إن الأكل يتعمل في يومه بنظافة، وإن العميل يستلمه من عندك في الوقت المتفق عليه.
            </Text>
          </Animated.View>
          <Button title="افتحي مطبخك 🎉" onPress={submit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 20, gap: 20, paddingBottom: 60 },
  promo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.teal,
    borderRadius: radius.lg,
    padding: 16,
  },
  areas: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  terms: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
