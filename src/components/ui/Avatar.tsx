import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text as RNText } from 'react-native';

import { palettes } from '@/lib/theme';

type Props = { emoji: string; paletteIndex: number; size?: number; radius?: number };

/** صورة رمزية بتدرّج لوني وإيموجي (بدل الصور الحقيقية في النسخة التجريبية). */
export function Avatar({ emoji, paletteIndex, size = 56, radius }: Props) {
  const [from, to] = palettes[paletteIndex % palettes.length];
  return (
    <LinearGradient
      colors={[from, to]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.box, { width: size, height: size, borderRadius: radius ?? size / 2 }]}>
      <RNText style={{ fontSize: size * 0.5, lineHeight: size * 0.62 }}>{emoji}</RNText>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
});
