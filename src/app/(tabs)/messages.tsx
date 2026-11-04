import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { SectionHeader } from '@/components/SectionHeader';
import { Avatar, Bounce, Screen, Text } from '@/components/ui';
import { relativeTime } from '@/lib/format';
import { colors, radius, shadow } from '@/lib/theme';
import { useStore } from '@/store/useStore';

export default function Messages() {
  const { chats, mothers, orders, favorites, typing } = useStore();

  const threads = useMemo(() => {
    return Object.entries(chats)
      .filter(([, msgs]) => msgs.length > 0)
      .map(([motherId, msgs]) => ({
        motherId,
        last: msgs[msgs.length - 1],
        mother: mothers.find((m) => m.id === motherId),
      }))
      .filter((t) => t.mother)
      .sort((a, b) => b.last.at.localeCompare(a.last.at));
  }, [chats, mothers]);

  // اقتراحات: أمهات طلبت منهم أو حبّيتهم ولسه ماكلمتهمش
  const suggestions = useMemo(() => {
    const ids = new Set([...orders.map((o) => o.motherId), ...favorites]);
    const have = new Set(threads.map((t) => t.motherId));
    const list = mothers.filter((m) => ids.has(m.id) && !have.has(m.id) && !m.isMine);
    return (list.length ? list : mothers.filter((m) => !have.has(m.id) && !m.isMine)).slice(0, 4);
  }, [orders, favorites, mothers, threads]);

  return (
    <Screen title="الرسائل" subtitle="اتكلم مع الأم مباشرة عن طلبك">
      <ScrollView contentContainerStyle={{ paddingBottom: 110, paddingTop: 6 }} showsVerticalScrollIndicator={false}>
        {threads.length === 0 && (
          <View style={styles.hint}>
            <Text size={36} lineHeight={46}>
              💬
            </Text>
            <Text weight="bold" size={16} center>
              لسه ماكلمت حد
            </Text>
            <Text size={13} color={colors.muted} center>
              اسأل الأم عن المكونات، أو اطلب تعديل، أو حدّد مكان الاستلام.
            </Text>
          </View>
        )}
        {threads.map((t, i) => (
          <Animated.View key={t.motherId} entering={FadeInDown.delay(i * 60)}>
            <Bounce
              onPress={() => router.push({ pathname: '/chat/[id]', params: { id: t.motherId } })}
              style={[styles.row, shadow.card]}>
              <Avatar emoji={t.mother!.emoji} paletteIndex={t.mother!.paletteIndex} size={54} />
              <View style={{ flex: 1 }}>
                <View style={styles.top}>
                  <Text weight="bold" size={15} style={{ flex: 1 }}>
                    {t.mother!.name}
                  </Text>
                  <Text size={11} color={colors.faint}>
                    {relativeTime(t.last.at)}
                  </Text>
                </View>
                <Text size={13} color={typing[t.motherId] ? colors.green : colors.muted} numberOfLines={1}>
                  {typing[t.motherId] ? 'بتكتب...' : `${t.last.from === 'me' ? 'أنت: ' : ''}${t.last.text}`}
                </Text>
              </View>
            </Bounce>
          </Animated.View>
        ))}

        {suggestions.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <SectionHeader title="ابدأ محادثة" subtitle="أمهات تقدر تسألهم عن أكلهم" />
            {suggestions.map((m, i) => (
              <Animated.View key={m.id} entering={FadeInDown.delay(i * 60)}>
                <Bounce
                  onPress={() => router.push({ pathname: '/chat/[id]', params: { id: m.id } })}
                  style={styles.suggest}>
                  <Avatar emoji={m.emoji} paletteIndex={m.paletteIndex} size={44} />
                  <View style={{ flex: 1 }}>
                    <Text weight="bold" size={14}>
                      {m.name}
                    </Text>
                    <Text size={12} color={colors.muted}>
                      {m.kitchen} · بترد في {m.responseMinutes} د
                    </Text>
                  </View>
                  <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} />
                </Bounce>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: { alignItems: 'center', gap: 4, paddingHorizontal: 40, paddingVertical: 28 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 12,
    borderRadius: radius.lg,
  },
  top: { flexDirection: 'row', alignItems: 'center' },
  suggest: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
