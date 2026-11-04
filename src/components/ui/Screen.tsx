import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { type PropsWithChildren, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/lib/theme';

import { Bounce } from './Bounce';
import { Text } from './Text';

type Props = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
  tone?: 'light' | 'primary';
}>;

/** غلاف الشاشة: هامش آمن + رأس بعنوان وزر رجوع. */
export function Screen({ children, title, subtitle, back, right, tone = 'light' }: Props) {
  const insets = useSafeAreaInsets();
  const dark = tone === 'primary';
  return (
    <View style={[styles.root, dark && { backgroundColor: colors.primary }]}>
      {(title || back) && (
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          {back ? (
            <Bounce onPress={() => router.back()} style={[styles.iconBtn, dark && styles.iconBtnDark]}>
              {/* في الاتجاه من اليمين لليسار، سهم الرجوع يشير لليمين */}
              <Ionicons name="arrow-forward" size={22} color={dark ? colors.white : colors.text} />
            </Bounce>
          ) : (
            <View style={styles.iconBtnPlaceholder} />
          )}
          <View style={styles.titleBox}>
            {title && (
              <Text weight="black" size={19} color={dark ? colors.white : colors.text} center>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text size={12} color={dark ? 'rgba(255,255,255,0.8)' : colors.muted} center>
                {subtitle}
              </Text>
            )}
          </View>
          <View style={styles.iconBtnPlaceholder}>{right}</View>
        </View>
      )}
      <View style={[styles.body, !title && !back && { paddingTop: insets.top }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 10, gap: 8 },
  titleBox: { flex: 1, alignItems: 'center' },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBtnDark: { backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'transparent' },
  iconBtnPlaceholder: { width: 42, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1 },
});
