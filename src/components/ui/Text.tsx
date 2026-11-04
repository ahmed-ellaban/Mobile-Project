import { Text as RNText, type TextProps, type TextStyle } from 'react-native';

import { colors, fonts } from '@/lib/theme';

type Weight = keyof typeof fonts;

type Props = TextProps & {
  weight?: Weight;
  size?: number;
  color?: string;
  center?: boolean;
  lineHeight?: number;
};

/** نص بخط Cairo واتجاه من اليمين لليسار افتراضياً. */
export function Text({
  weight = 'regular',
  size = 15,
  color = colors.text,
  center,
  lineHeight,
  style,
  ...rest
}: Props) {
  const base: TextStyle = {
    fontFamily: fonts[weight],
    fontSize: size,
    color,
    lineHeight: lineHeight ?? Math.round(size * 1.65),
    writingDirection: 'rtl',
    textAlign: center ? 'center' : undefined,
  };
  return <RNText {...rest} style={[base, style]} />;
}
