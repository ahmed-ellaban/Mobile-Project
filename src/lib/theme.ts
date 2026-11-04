/**
 * هوية «أبلة فهيدة»: ألوان دافئة مستوحاة من المطبخ المصري
 * (رمان، زعفران، كريمة، وبُن).
 */
export const colors = {
  primary: '#B6362A',
  primaryDark: '#8F2A20',
  primarySoft: '#F9E4E0',
  accent: '#E9A23B',
  accentDark: '#C9842A',
  accentSoft: '#FCEEDA',
  green: '#3C8D5A',
  greenSoft: '#E1F2E7',
  teal: '#2C7A7B',
  tealSoft: '#DFF1F0',
  bg: '#FBF6EE',
  card: '#FFFFFF',
  text: '#2A1C14',
  muted: '#8A7466',
  faint: '#B9A899',
  border: '#EFE4D6',
  overlay: 'rgba(42,28,20,0.55)',
  white: '#FFFFFF',
  danger: '#C0392B',
};

export const fonts = {
  regular: 'Cairo_400Regular',
  medium: 'Cairo_500Medium',
  semibold: 'Cairo_600SemiBold',
  bold: 'Cairo_700Bold',
  black: 'Cairo_800ExtraBold',
};

export const radius = { sm: 10, md: 16, lg: 22, xl: 30, pill: 999 };

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const shadow = {
  card: {
    shadowColor: '#5A3A2A',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  float: {
    shadowColor: '#5A3A2A',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
};

/** تدرجات لونية لصور الأمهات والأطباق (بدل صور حقيقية). */
export const palettes: [string, string][] = [
  ['#F6B38B', '#D9553E'],
  ['#F9D27C', '#E08E2B'],
  ['#9ED4B5', '#3C8D5A'],
  ['#9FD3D6', '#2C7A7B'],
  ['#E7B5D5', '#A8488C'],
  ['#C8B4F2', '#6D4FB3'],
];
