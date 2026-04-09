import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import { setClientToken } from '../api/client';
import type { User } from '../types/auth';

async function loadUserLanguage(userId: number) {
  const lang =
    (await AsyncStorage.getItem(`language_${userId}`)) ||
    (await AsyncStorage.getItem('language')) ||
    'en';
  i18n.changeLanguage(lang);
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setAuth: (user, token) => {
    AsyncStorage.setItem('token', token);
    setClientToken(token);
    loadUserLanguage(user.id);
    set({ user, token });
  },

  setUser: (user) => {
    loadUserLanguage(user.id);
    set({ user });
  },

  clearAuth: () => {
    AsyncStorage.removeItem('token');
    setClientToken(null);
    AsyncStorage.getItem('language').then((lang) => {
      i18n.changeLanguage(lang || 'en');
    });
    set({ user: null, token: null });
  },

  loadToken: async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setClientToken(token);
    }
    set({ token, isLoading: false });
  },
}));
