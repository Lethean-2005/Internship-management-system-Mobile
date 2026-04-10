import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../lib/useAppTheme';

const LIGHT_GRADIENT = ['#FFFFFF', '#FFB366', '#FF8A3D'] as const;
const DARK_GRADIENT = ['#0F172A', '#0B1220', '#050A14'] as const;
const GRADIENT_LOCATIONS = [0, 0.6, 1] as const;

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

// Full-screen gradient fill — flips automatically between a warm peach/orange
// gradient (light mode) and a deep navy gradient (dark mode) based on the
// user's theme selection.
export function GradientBackground({ children, style }: GradientBackgroundProps) {
  const { effective } = useAppTheme();
  const colors = effective === 'dark' ? DARK_GRADIENT : LIGHT_GRADIENT;
  return (
    <LinearGradient
      colors={colors as any}
      locations={GRADIENT_LOCATIONS as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.fill, style]}
    >
      {children}
    </LinearGradient>
  );
}

interface GradientSafeAreaProps {
  children: React.ReactNode;
  edges?: readonly Edge[];
  style?: ViewStyle;
}

export function GradientSafeArea({ children, edges = ['top'], style }: GradientSafeAreaProps) {
  return (
    <GradientBackground>
      <SafeAreaView style={[styles.safe, style]} edges={edges}>
        {children}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  safe: { flex: 1, backgroundColor: 'transparent' },
});
