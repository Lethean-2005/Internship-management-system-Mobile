import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en.json';
import km from './km.json';
import fr from './fr.json';
import mg from './mg.json';
import vi from './vi.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    km: { translation: km },
    fr: { translation: fr },
    mg: { translation: mg },
    vi: { translation: vi },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Load saved language preference
AsyncStorage.getItem('language').then((lang) => {
  if (lang) i18n.changeLanguage(lang);
});

export default i18n;
