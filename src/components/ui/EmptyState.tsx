import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconFileText, IconFolder, IconUsers, IconCalendar, IconShield, IconBriefcase, IconPlane, IconMessageCircle, IconSearch } from '@tabler/icons-react-native';
import { colors, fontSize, spacing } from '../../lib/theme';

const iconMap = {
  'document-text-outline': IconFileText,
  'folder-outline': IconFolder,
  'people-outline': IconUsers,
  'calendar-outline': IconCalendar,
  'shield-outline': IconShield,
  'briefcase-outline': IconBriefcase,
  'airplane-outline': IconPlane,
  'chatbubbles-outline': IconMessageCircle,
  'search-outline': IconSearch,
} as const;

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon = 'document-text-outline', title, subtitle }: EmptyStateProps) {
  const TablerIcon = iconMap[icon as keyof typeof iconMap] || IconFileText;
  return (
    <View style={styles.container}>
      <TablerIcon size={48} color={colors.gray[300]} strokeWidth={1.2} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxxl },
  title: { fontSize: fontSize.lg, fontWeight: '600', color: colors.gray[500], marginTop: spacing.lg, textAlign: 'center' },
  subtitle: { fontSize: fontSize.sm, color: colors.gray[400], marginTop: spacing.sm, textAlign: 'center' },
});
