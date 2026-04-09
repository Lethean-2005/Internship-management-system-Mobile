import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const KHMER_FONTS: Record<string, string> = {
  '400': 'KantumruyPro-Regular',
  'normal': 'KantumruyPro-Regular',
  '500': 'KantumruyPro-Medium',
  '600': 'KantumruyPro-SemiBold',
  '700': 'KantumruyPro-Bold',
  'bold': 'KantumruyPro-Bold',
};

export function AppText({ style, ...props }: TextProps) {
  const { i18n } = useTranslation();
  const isKhmer = i18n.language === 'km';

  if (!isKhmer) {
    return <RNText style={style} {...props} />;
  }

  const flat = StyleSheet.flatten(style) || {};
  const weight = String(flat.fontWeight || '400');
  const khmerFont = KHMER_FONTS[weight] || 'KantumruyPro-Regular';

  return <RNText style={[style, { fontFamily: khmerFont }]} {...props} />;
}
