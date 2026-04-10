import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  loadMode: () => Promise<void>;
}

const STORAGE_KEY = 'themeMode';

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'system',

  setMode: (mode) => {
    AsyncStorage.setItem(STORAGE_KEY, mode).catch(() => {});
    set({ mode });
  },

  loadMode: async () => {
    try {
      const saved = (await AsyncStorage.getItem(STORAGE_KEY)) as ThemeMode | null;
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        set({ mode: saved });
      }
    } catch {}
  },
}));
