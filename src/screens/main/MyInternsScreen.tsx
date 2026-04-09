import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EmptyState } from '../../components/ui';
import { colors } from '../../lib/theme';

export function MyInternsScreen() {
  return (
    <View style={styles.container}>
      <EmptyState title="My Interns" subtitle="Interns assigned to you will appear here." icon="people-outline" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
