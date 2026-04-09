export const colors = {
  primary: '#1a1a2e',
  primaryLight: '#2d2d44',
  secondary: '#3a3a3a',
  accent: '#48B6E8',
  success: '#4ade80',
  danger: '#f87171',
  warning: '#fbbf24',
  info: '#60a5fa',
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#9e9e9e',
  border: '#eeeeee',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 5,
  md: 5,
  lg: 5,
  xl: 5,
  xxl: 5,
  full: 5,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
};

export const fontFamily = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
};

export const khmerFontFamily = {
  regular: 'KantumruyPro-Regular',
  medium: 'KantumruyPro-Medium',
  semibold: 'KantumruyPro-SemiBold',
  bold: 'KantumruyPro-Bold',
};

export function getFontFamily(lang: string, weight: 'regular' | 'medium' | 'semibold' | 'bold' = 'regular') {
  return lang === 'km' ? khmerFontFamily[weight] : fontFamily[weight];
}
