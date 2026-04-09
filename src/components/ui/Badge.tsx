import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, fontSize, spacing } from '../../lib/theme';

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: '#f3f4f6', text: '#6b7280' },
  submitted: { bg: '#dbeafe', text: '#1d4ed8' },
  resubmitted: { bg: '#dbeafe', text: '#1d4ed8' },
  reviewed: { bg: '#e0e7ff', text: '#4338ca' },
  approved: { bg: '#dcfce7', text: '#16a34a' },
  rejected: { bg: '#fee2e2', text: '#dc2626' },
  pending: { bg: '#fef3c7', text: '#d97706' },
  scheduled: { bg: '#dbeafe', text: '#1d4ed8' },
  passed: { bg: '#dcfce7', text: '#16a34a' },
  failed: { bg: '#fee2e2', text: '#dc2626' },
  completed: { bg: '#dcfce7', text: '#16a34a' },
  cancelled: { bg: '#f3f4f6', text: '#6b7280' },
  active: { bg: '#dcfce7', text: '#16a34a' },
  inactive: { bg: '#f3f4f6', text: '#6b7280' },
  open: { bg: '#dcfce7', text: '#16a34a' },
  closed: { bg: '#f3f4f6', text: '#6b7280' },
};

interface BadgeProps {
  status: string;
  label?: string;
}

export function Badge({ status, label }: BadgeProps) {
  const colorScheme = statusColors[status] || statusColors.draft;
  return (
    <View style={[styles.badge, { backgroundColor: colorScheme.bg }]}>
      <Text style={[styles.text, { color: colorScheme.text }]}>
        {label || status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
});
