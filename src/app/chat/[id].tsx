import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type ScrollViewInstance,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatBubble, TypingDots } from '@/components/Chat';
import { Avatar, Bounce, EmptyState, Text } from '@/components/ui';
import { colors, fonts, radius, shadow } from '@/lib/theme';
import { useChat, useMother, useStore } from '@/store/useStore';

const QUICK = [
  'الأكل هيكون جاهز إمتى؟ ⏰',
  'ممكن من غير شطة؟ 🌶️',
  'فين مكان الاستلام بالظبط؟ 📍',
  'الكمية تكفي كام فرد؟ 👨‍👩‍👧',
];

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const mother = useMother(id);
  const messages = useChat(id);
  const typing = useStore((s) => s.typing[id ?? ''] ?? false);
  const sendMessage = useStore((s) => s.sendMessage);
  const [text, setText] = useState('');
  const scroll = useRef<ScrollViewInstance>(null);

  useEffect(() => {
    const t = setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(t);
  }, [messages.length, typing]);

  if (!mother || !id) {
    return (
      <EmptyState emoji="🤷‍♀️" title="المحادثة مش موجودة" body="" actionLabel="رجوع" onAction={() => router.back()} />
    );
  }

  const send = (t: string) => {
    if (!t.trim()) return;
    sendMessage(id, t);
    setText('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* الرأس */}
      <View style={[styles.header, shadow.card, { paddingTop: insets.top + 8 }]}>
        <Bounce onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-forward" size={22} color={colors.text} />
        </Bounce>
        <Bounce
          onPress={() => router.push({ pathname: '/mother/[id]', params: { id: mother.id } })}
          style={styles.headerMother}
          haptic={false}>
          <Avatar emoji={mother.emoji} paletteIndex={mother.paletteIndex} size={44} />
          <View style={{ flex: 1 }}>
            <Text weight="black" size={16}>
              {mother.name}
            </Text>
            <Text size={12} color={typing ? colors.green : colors.muted}>
              {typing ? 'بتكتب...' : `${mother.kitchen} · بترد في ${mother.responseMinutes} د`}
            </Text>
          </View>
        </Bounce>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <ScrollView
          ref={scroll}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {messages.length === 0 && (
            <Animated.View entering={FadeIn} style={styles.intro}>
              <Avatar emoji={mother.emoji} paletteIndex={mother.paletteIndex} size={72} />
              <Text weight="bold" size={15} center>
                اتكلم مع {mother.name} مباشرة
              </Text>
              <Text size={13} color={colors.muted} center lineHeight={20}>
                اسأل عن المكونات، اطلب تعديل، أو اتفق على مكان الاستلام. {mother.name} بترد عادةً في{' '}
                {mother.responseMinutes} دقايق.
              </Text>
            </Animated.View>
          )}
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m} />
          ))}
          {typing && <TypingDots />}
        </ScrollView>

        {/* ردود سريعة */}
        <View style={styles.quickWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quick}
            keyboardShouldPersistTaps="handled">
            {QUICK.map((q) => (
              <Bounce key={q} onPress={() => send(q)} style={styles.quickChip} scaleTo={0.94}>
                <Text weight="semibold" size={13}>
                  {q}
                </Text>
              </Bounce>
            ))}
          </ScrollView>
        </View>

        {/* الإدخال */}
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={`اكتب رسالة لـ ${mother.name}...`}
            placeholderTextColor={colors.faint}
            style={styles.input}
            multiline
            onSubmitEditing={() => send(text)}
            blurOnSubmit
          />
          <Bounce
            onPress={() => send(text)}
            style={[styles.send, !text.trim() && { opacity: 0.4 }]}
            disabled={!text.trim()}
            scaleTo={0.85}>
            {/* السهم يشير لاتجاه الإرسال (يسار) في الواجهة العربية */}
            <Ionicons name="send" size={20} color={colors.white} style={{ transform: [{ scaleX: -1 }] }} />
          </Bounce>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 10,
    backgroundColor: colors.card,
    borderBottomStartRadius: radius.lg,
    borderBottomEndRadius: radius.lg,
    zIndex: 2,
  },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerMother: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  list: { padding: 16, paddingTop: 20, flexGrow: 1 },
  intro: { alignItems: 'center', gap: 6, paddingHorizontal: 30, paddingVertical: 20 },
  quickWrap: { height: 56, flexGrow: 0, flexShrink: 0 },
  quick: { paddingHorizontal: 12, gap: 8, paddingVertical: 8, alignItems: 'center' },
  quickChip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    maxHeight: 110,
    minHeight: 44,
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
