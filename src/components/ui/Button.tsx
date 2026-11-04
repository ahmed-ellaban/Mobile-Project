import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius } from '@/lib/theme';

import { Bounce } from './Bounce';
import { Text } from './Text';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'dark';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ title, onPress, variant = 'primary', icon, loading, disabled, small, style }: Props) {
  const bg = {
    primary: colors.primary,
    secondary: colors.primarySoft,
    ghost: 'transparent',
    accent: colors.accent,
    dark: colors.text,
  }[variant];
  const fg = {
    primary: colors.white,
    secondary: colors.primary,
    ghost: colors.primary,
    accent: colors.text,
    dark: colors.white,
  }[variant];

  return (
    <Bounce
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        small && styles.small,
        { backgroundColor: bg, opacity: disabled ? 0.5 : 1 },
        variant === 'ghost' && { borderWidth: 1.5, borderColor: colors.primary },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.row}>
          {icon && <Ionicons name={icon} size={small ? 16 : 20} color={fg} />}
          <Text weight="bold" size={small ? 14 : 16} color={fg}>
            {title}
          </Text>
        </View>
      )}
    </Bounce>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    paddingHorizontal: 22,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: { minHeight: 40, paddingHorizontal: 14, borderRadius: radius.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
