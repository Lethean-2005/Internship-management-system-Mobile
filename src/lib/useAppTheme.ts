import { useColorScheme } from 'react-native';
import { useThemeStore } from '../stores/themeStore';
import { lightColors, darkColors } from './theme';

/**
 * Returns the active color palette based on the user's theme preference.
 *
 * - `light` → always `lightColors`
 * - `dark`  → always `darkColors`
 * - `system` → follows the OS color scheme via React Native's `useColorScheme()`
 *
 * Components that want live theme switching should use this hook instead of
 * importing the static `colors` export.
 */
export function useAppTheme() {
  const mode = useThemeStore((s) => s.mode);
  const system = useColorScheme(); // 'light' | 'dark' | null

  const effective = mode === 'system' ? (system === 'dark' ? 'dark' : 'light') : mode;
  const colors = effective === 'dark' ? darkColors : lightColors;
  return { colors, mode, effective };
}
