import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, Badge, LoadingSpinner, EmptyState } from '../../components/ui';
import { getJobPostings } from '../../api/jobPostings';
import { colors, fontSize, spacing } from '../../lib/theme';
import { IconMapPin } from '@tabler/icons-react-native';
import type { JobPosting } from '../../types/ims';

export function JobPostingsScreen() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = async () => {
    try { const res = await getJobPostings(); setJobs(res.data); } catch {}
    setLoading(false); setRefreshing(false);
  };

  useEffect(() => { fetch(); }, []);
  if (loading) return <LoadingSpinner />;

  return (
    <FlatList
      style={styles.container}
      data={jobs}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetch(); }} />}
      ListEmptyComponent={<EmptyState title={t('jobPostings.noJobPostingsFound')} icon="briefcase-outline" />}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.company}>{item.company_name}</Text>
          <View style={styles.infoRow}>
            {item.location && (
              <View style={styles.tagRow}>
                <IconMapPin size={12} color={colors.textSecondary} strokeWidth={1.5} />
                <Text style={styles.tag}> {item.location}</Text>
              </View>
            )}
            <Badge status={item.status} />
          </View>
          {item.type && <Text style={styles.type}>{item.type === 'full_time' ? 'Full Time' : 'Part Time'}</Text>}
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg },
  card: { marginBottom: spacing.md },
  title: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  company: { fontSize: fontSize.sm, color: colors.accent, marginTop: spacing.xs },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  tagRow: { flexDirection: 'row', alignItems: 'center' },
  tag: { fontSize: fontSize.xs, color: colors.textSecondary },
  type: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs, textTransform: 'capitalize' },
});
