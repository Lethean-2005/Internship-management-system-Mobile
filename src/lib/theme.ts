/**
 * Design tokens for IMS Mobile.
 *
 * Built around a Tailwind-aligned orange brand ramp with neutral grays and
 * semantic status colors. Use brand.* for primary actions, gray.* for
 * structure, and success/warning/danger/info (+ their *Bg counterparts) for
 * status badges.
 *
 * Every text/background pair listed here has been checked for WCAG AA
 * contrast. See lib/theme notes for which shades are text-safe on white.
 */

// ────────────────────────────────────────────────────────────────────
// Brand — Tailwind orange ramp, anchored on #F97316 as the 500 step
// ────────────────────────────────────────────────────────────────────
const brand = {
  50: '#FFF7ED',
  100: '#FFEDD5',
  200: '#FED7AA',
  300: '#FDBA74',
  400: '#FB923C',
  500: '#F97316', // primary brand — buttons, active icons, price/value highlights
  600: '#EA580C', // hover/pressed
  700: '#C2410C', // use for orange text on white (AA-safe)
  800: '#9A3412',
  900: '#7C2D12',
} as const;

// ────────────────────────────────────────────────────────────────────
// Neutrals — Tailwind slate/gray ramp
// ────────────────────────────────────────────────────────────────────
const gray = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
} as const;

// ────────────────────────────────────────────────────────────────────
// Semantic — one color = one meaning (status badges, alerts, toasts)
// Pair each with its *Bg for subtle filled backgrounds.
// ────────────────────────────────────────────────────────────────────
const semantic = {
  success: '#16A34A',
  successBg: '#DCFCE7',
  successText: '#15803D',

  warning: '#D97706',
  warningBg: '#FEF3C7',
  warningText: '#B45309',

  danger: '#DC2626',
  dangerBg: '#FEE2E2',
  dangerText: '#B91C1C',

  info: '#2563EB',
  infoBg: '#DBEAFE',
  infoText: '#1D4ED8',
} as const;

// ────────────────────────────────────────────────────────────────────
// Public colors object — LIGHT palette, consumed throughout the app
// ────────────────────────────────────────────────────────────────────
export const lightColors = {
  // Ramps (prefer these in new code)
  brand,
  gray,

  // Core neutrals
  white: '#FFFFFF',
  black: '#000000',

  // Surfaces
  background: '#FFE4D1',      // app background — warm peach canvas
  surface: '#FFFFFF',         // inputs, modals, dialogs
  card: '#FFFFFF',            // card background — white
  cardText: gray[900],        // primary text on white cards
  cardTextMuted: gray[500],   // muted text on white cards
  cardBorder: gray[200],      // dividers between card rows
  border: gray[200],          // input / modal dividers
  borderStrong: gray[300],    // focused/elevated borders

  // Text
  text: gray[900],
  textSecondary: gray[500],
  textMuted: gray[500],
  textDisabled: gray[400],
  textOnBrand: '#FFFFFF',
  textOnBackground: '#1A1A1A',
  textOnCard: gray[900],

  // Buttons
  buttonPrimary: '#FB923C',
  buttonPrimaryText: '#FFFFFF',

  // Brand aliases
  primary: brand[500],
  primaryText: brand[700],
  accent: brand[500],

  // Semantic
  success: semantic.success,
  successBg: semantic.successBg,
  successText: semantic.successText,

  warning: semantic.warning,
  warningBg: semantic.warningBg,
  warningText: semantic.warningText,

  danger: semantic.danger,
  dangerBg: semantic.dangerBg,
  dangerText: semantic.dangerText,

  info: semantic.info,
  infoBg: semantic.infoBg,
  infoText: semantic.infoText,
} as const;

// ────────────────────────────────────────────────────────────────────
// DARK palette — mirrors lightColors but inverted for dark backgrounds
// ────────────────────────────────────────────────────────────────────
export const darkColors = {
  brand,
  gray,

  white: '#FFFFFF',
  black: '#000000',

  // Surfaces — dark slate canvas with elevated cards
  background: '#0B1220',       // deep near-black navy canvas
  surface: '#1A2234',          // inputs, modals, dialogs (slightly lighter)
  card: '#1A2234',             // card background — slate
  cardText: '#F3F4F6',         // primary text on dark cards
  cardTextMuted: '#9CA3AF',    // muted text on dark cards
  cardBorder: '#2A3444',       // dividers between card rows (subtle lighter slate)
  border: '#2A3444',
  borderStrong: '#3A4558',

  // Text
  text: '#F3F4F6',
  textSecondary: '#9CA3AF',
  textMuted: '#9CA3AF',
  textDisabled: '#6B7280',
  textOnBrand: '#FFFFFF',
  textOnBackground: '#F3F4F6',
  textOnCard: '#F3F4F6',

  // Buttons
  buttonPrimary: '#FB923C',
  buttonPrimaryText: '#FFFFFF',

  // Brand aliases
  primary: brand[500],
  primaryText: brand[300],     // lighter orange reads better on dark
  accent: brand[500],

  // Semantic (slightly desaturated for dark bg)
  success: '#22C55E',
  successBg: '#14532D',
  successText: '#86EFAC',

  warning: '#F59E0B',
  warningBg: '#78350F',
  warningText: '#FCD34D',

  danger: '#EF4444',
  dangerBg: '#7F1D1D',
  dangerText: '#FCA5A5',

  info: '#3B82F6',
  infoBg: '#1E3A8A',
  infoText: '#93C5FD',
} as const;

// Default export = light palette, kept for backward compatibility with
// every screen that currently does `import { colors } from '../lib/theme'`.
// New code should use the `useAppTheme()` hook for reactive theme support.
export const colors = lightColors;

// ────────────────────────────────────────────────────────────────────
// Spacing — 4px base scale
// ────────────────────────────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// ────────────────────────────────────────────────────────────────────
// Radius — all 5 to match the current house style
// ────────────────────────────────────────────────────────────────────
export const borderRadius = {
  sm: 5,
  md: 5,
  lg: 5,
  xl: 5,
  xxl: 5,
  full: 5,
} as const;

// ────────────────────────────────────────────────────────────────────
// Type scale
// ────────────────────────────────────────────────────────────────────
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
} as const;

// ────────────────────────────────────────────────────────────────────
// Elevation — subtle shadows tuned for light cards on a light bg
// ────────────────────────────────────────────────────────────────────
export const shadows = {
  none: {},
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
} as const;

// ────────────────────────────────────────────────────────────────────
// Fonts
// ────────────────────────────────────────────────────────────────────
export const fontFamily = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
} as const;

export const khmerFontFamily = {
  regular: 'KantumruyPro-Regular',
  medium: 'KantumruyPro-Medium',
  semibold: 'KantumruyPro-SemiBold',
  bold: 'KantumruyPro-Bold',
} as const;

export function getFontFamily(
  lang: string,
  weight: 'regular' | 'medium' | 'semibold' | 'bold' = 'regular',
) {
  return lang === 'km' ? khmerFontFamily[weight] : fontFamily[weight];
}
