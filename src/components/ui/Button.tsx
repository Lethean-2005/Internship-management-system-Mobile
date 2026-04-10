import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { borderRadius, fontSize, spacing } from '../../lib/theme';
import { useAppTheme } from '../../lib/useAppTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ title, onPress, variant = 'primary', size = 'md', loading, disabled, style, textStyle }: ButtonProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(), []);

  const bgColor = {
    primary: colors.buttonPrimary,
    secondary: colors.gray[100],
    danger: colors.danger,
    ghost: 'transparent',
  }[variant];

  const txtColor = {
    primary: colors.buttonPrimaryText,
    secondary: colors.text,
    danger: colors.white,
    ghost: colors.text,
  }[variant];

  const paddingV = { sm: 10, md: 14, lg: 18 }[size];
  const paddingH = { sm: 16, md: 20, lg: 24 }[size];
  const fSize = { sm: fontSize.sm, md: fontSize.md, lg: fontSize.lg }[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        { backgroundColor: bgColor, paddingVertical: paddingV, paddingHorizontal: paddingH },
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={txtColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: txtColor, fontSize: fSize }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

function createStyles() {
  return StyleSheet.create({
    button: {
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    text: {
      fontWeight: '600',
    },
    disabled: {
      opacity: 0.5,
    },
  });
}
