import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { KantumruyPro_400Regular } from '@expo-google-fonts/kantumruy-pro/400Regular';
import { KantumruyPro_500Medium } from '@expo-google-fonts/kantumruy-pro/500Medium';
import { KantumruyPro_600SemiBold } from '@expo-google-fonts/kantumruy-pro/600SemiBold';
import { KantumruyPro_700Bold } from '@expo-google-fonts/kantumruy-pro/700Bold';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ActivityIndicator, View, Platform } from 'react-native';
import i18n from './src/i18n';

// Inject CSS for Khmer font override on web
let styleEl: HTMLStyleElement | null = null;
function applyWebFont(lang: string) {
  if (Platform.OS !== 'web') return;
  if (!styleEl) {
    styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
  }
  if (lang === 'km') {
    styleEl.textContent = `
      [data-lang="km"] * {
        font-family: "KantumruyPro-Regular", "Kantumruy Pro", sans-serif !important;
      }
      [data-lang="km"] [style*="font-weight: 700"],
      [data-lang="km"] [style*="font-weight:700"] {
        font-family: "KantumruyPro-Bold", "Kantumruy Pro", sans-serif !important;
      }
      [data-lang="km"] [style*="font-weight: 600"],
      [data-lang="km"] [style*="font-weight:600"] {
        font-family: "KantumruyPro-SemiBold", "Kantumruy Pro", sans-serif !important;
      }
      [data-lang="km"] [style*="font-weight: 500"],
      [data-lang="km"] [style*="font-weight:500"] {
        font-family: "KantumruyPro-Medium", "Kantumruy Pro", sans-serif !important;
      }
    `;
    document.documentElement.setAttribute('data-lang', 'km');
  } else {
    styleEl.textContent = '';
    document.documentElement.removeAttribute('data-lang');
  }
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'KantumruyPro-Regular': KantumruyPro_400Regular,
    'KantumruyPro-Medium': KantumruyPro_500Medium,
    'KantumruyPro-SemiBold': KantumruyPro_600SemiBold,
    'KantumruyPro-Bold': KantumruyPro_700Bold,
  });

  const [langKey, setLangKey] = useState(i18n.language);

  useEffect(() => {
    const handler = (lng: string) => {
      applyWebFont(lng);
      setLangKey(lng);
    };
    i18n.on('languageChanged', handler);
    applyWebFont(i18n.language);
    return () => { i18n.off('languageChanged', handler); };
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer key={langKey}>
        <StatusBar style="auto" />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
