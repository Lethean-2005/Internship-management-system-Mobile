import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { borderRadius, spacing } from '../../lib/theme';
import { useAppTheme } from '../../lib/useAppTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return <View style={[styles.card, style]}>{children}</View>;
}

function createStyles(colors: any) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
    },
  });
}
