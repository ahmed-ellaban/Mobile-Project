import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { MotherCard } from '@/components/MotherCard';
import { SectionHeader } from '@/components/SectionHeader';
import { Avatar, Bounce, Button, Field, Screen, Text, toast } from '@/components/ui';
import { colors, radius, shadow } from '@/lib/theme';
import { myImpact, useStore } from '@/store/useStore';

export default function Account() {
  const { userName, phone, setProfile, favorites, mothers, orders, chef } = useStore();
  const [editing, setEditing] = useState(!userName);
  const [name, setName] = useState(userName);
  const [tel, setTel] = useState(phone);
  const favs = mothers.filter((m) => favorites.includes(m.id));
  const mine = myImpact(orders);

  const save = () => {
    if (!name.trim()) return toast('اكتب اسمك الأول 🙂', 'error');
    setProfile(name.trim(), tel.trim());
    setEditing(false);
    toast('تم حفظ بياناتك', 'success');
  };

  return (
    <Screen title="حسابي">
      <ScrollView contentContainerStyle={{ paddingBottom: 110, paddingTop: 6 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(350)} style={[styles.card, shadow.card]}>
          <View style={styles.profileRow}>
            <Avatar emoji="🙂" paletteIndex={3} size={60} />
            <View style={{ flex: 1 }}>
              <Text weight="black" size={18}>
                {userName || 'أهلاً بيك!'}
              </Text>
              <Text size={13} color={colors.muted}>
                {phone || 'كمّل بياناتك عشان الأم تعرف تتواصل معاك'}
              </Text>
            </View>
            {!editing && (
              <Bounce onPress={() => setEditing(true)} style={styles.editBtn}>
                <Ionicons name="create-outline" size={20} color={colors.primary} />
              </Bounce>
            )}
          </View>
          {editing && (
            <View style={{ gap: 12, marginTop: 8 }}>
              <Field label="اسمك" value={name} onChangeText={setName} placeholder="مثال: أحمد" />
              <Field
                label="رقم الموبايل"
                value={tel}
                onChangeText={setTel}
                placeholder="01xxxxxxxxx"
                keyboardType="phone-pad"
              />
              <Button title="حفظ" onPress={save} />
            </View>
          )}
        </Animated.View>

        {mine.orders > 0 && (
          <Animated.View entering={FadeInDown.delay(80)} style={[styles.card, shadow.card, styles.impact]}>
            <Ionicons name="heart" size={22} color={colors.primary} />
            <Text weight="bold" size={14} style={{ flex: 1 }} lineHeight={22}>
              طلباتك دخّلت {mine.income.toLocaleString('en-EG')} ج.م لـ {mine.mothers} أم. شكراً إنك جزء من الحكاية 💛
            </Text>
          </Animated.View>
        )}

        {/* وضع الأم الشيف */}
        <Animated.View entering={FadeInDown.delay(140)}>
          <Bounce
            onPress={() => router.push(chef ? '/chef' : '/chef/register')}
            style={[styles.card, shadow.card, styles.chefCard]}>
            <View style={styles.chefIcon}>
              <Text size={28} lineHeight={36}>
                👩‍🍳
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text weight="black" size={16} color={colors.white}>
                {chef ? `مطبخ ${chef.kitchen}` : 'إنتي أم وبتطبخي؟'}
              </Text>
              <Text size={13} color="rgba(255,255,255,0.9)" lineHeight={20}>
                {chef ? 'إدارة الأكل والأسعار والطلبات الواردة' : 'سجّلي مطبخك وابدئي تستقبلي طلبات وتزوّدي دخل بيتك'}
              </Text>
            </View>
            <Ionicons name="chevron-back" size={20} color={colors.white} />
          </Bounce>
        </Animated.View>

        {favs.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <SectionHeader title="مطابخ بحبها ❤️" />
            {favs.map((m, i) => (
              <MotherCard key={m.id} mother={m} index={i} />
            ))}
          </View>
        )}

        <View style={styles.about}>
          <Text weight="black" size={16}>
            عن أبلة فهيدة
          </Text>
          <Text size={13} color={colors.muted} lineHeight={22}>
            «أبلة» هي الست الكبيرة اللي الكل بيحترمها وبيحب أكلها. أبلة فهيدة منصة مصرية بتوصّل بين أمهات بيطبخوا من
            بيوتهم وناس بتحب أكل البيت. هدفنا إن كل أم تقدر تزوّد دخل بيتها بكرامة ومن غير ما تسيب ولادها.
          </Text>
          <Text size={12} color={colors.faint}>
            النسخة 1.0 · نسخة تجريبية بدون سيرفر
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, marginHorizontal: 20, marginBottom: 12, borderRadius: radius.lg, padding: 16 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  impact: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.primarySoft },
  chefCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.teal },
  chefIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  about: { marginHorizontal: 20, marginTop: 20, gap: 6 },
});
