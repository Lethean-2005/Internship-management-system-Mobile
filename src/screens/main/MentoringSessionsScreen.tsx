import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, Badge, LoadingSpinner, EmptyState } from '../../components/ui';
import { getSessions } from '../../api/mentoringSessions';
import { colors, fontSize, spacing } from '../../lib/theme';
import { IconCalendar, IconClock } from '@tabler/icons-react-native';
import type { MentoringSession } from '../../types/ims';

export function MentoringSessionsScreen() {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = async () => {
    try { const res = await getSessions(); setSessions(res.data); } catch {}
    setLoading(false); setRefreshing(false);
  };

  useEffect(() => { fetch(); }, []);
  if (loading) return <LoadingSpinner />;

  return (
    <FlatList
      style={styles.container}
      data={sessions}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetch(); }} />}
      ListEmptyComponent={<EmptyState title={t('mentoring.noSessionsFound')} icon="people-outline" />}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Badge status={item.status} />
          </View>
          <View style={styles.infoRow}>
            <IconCalendar size={14} color={colors.textSecondary} strokeWidth={1.5} />
            <Text style={styles.info}> {item.scheduled_date} at {item.scheduled_time}</Text>
          </View>
          <View style={styles.infoRow}>
            <IconClock size={14} color={colors.textSecondary} strokeWidth={1.5} />
            <Text style={styles.info}> {item.duration_minutes} min</Text>
          </View>
          <Text style={styles.type}>{item.type}</Text>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: fontSize.md, fontWeight: '600', color: colors.text, flex: 1, marginRight: spacing.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  info: { fontSize: fontSize.sm, color: colors.textSecondary },
  type: { fontSize: fontSize.xs, color: colors.accent, fontWeight: '500', marginTop: spacing.xs, textTransform: 'capitalize' },
});
