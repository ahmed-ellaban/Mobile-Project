import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fonts, radius } from '@/lib/theme';

import { Text } from './Text';

type Props = TextInputProps & { label?: string; hint?: string; suffix?: string };

/** حقل إدخال بعنوان، بخط Cairo واتجاه من اليمين لليسار. */
export function Field({ label, hint, suffix, style, multiline, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      {label && (
        <Text weight="bold" size={14}>
          {label}
        </Text>
      )}
      <View style={[styles.box, multiline && styles.multi]}>
        <TextInput
          placeholderTextColor={colors.faint}
          multiline={multiline}
          {...rest}
          style={[styles.input, multiline && { minHeight: 90, textAlignVertical: 'top' }, style]}
        />
        {suffix && (
          <Text weight="semibold" size={14} color={colors.muted}>
            {suffix}
          </Text>
        )}
      </View>
      {hint && (
        <Text size={12} color={colors.faint}>
          {hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  multi: { alignItems: 'flex-start', paddingVertical: 8 },
  input: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
    textAlign: 'right',
    writingDirection: 'rtl',
    paddingVertical: 10,
  },
});
