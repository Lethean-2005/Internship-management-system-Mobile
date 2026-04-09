import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EmptyState } from '../../components/ui';
import { colors } from '../../lib/theme';

export function CalendarScreen() {
  return (
    <View style={styles.container}>
      <EmptyState title="Calendar" subtitle="Your events, deadlines, and schedules." icon="calendar-outline" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
