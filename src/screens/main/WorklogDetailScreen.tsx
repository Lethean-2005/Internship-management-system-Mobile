import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { Card, Badge, LoadingSpinner, GradientBackground } from '../../components/ui';
import { getWorklog } from '../../api/worklogs';
import { colors, fontSize, spacing } from '../../lib/theme';
import type { WeeklyWorklog } from '../../types/ims';

export function WorklogDetailScreen() {
  const { t } = useTranslation();
  const route = useRoute<any>();
  const [worklog, setWorklog] = useState<WeeklyWorklog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorklog(route.params.id).then(setWorklog).finally(() => setLoading(false));
  }, [route.params.id]);

  if (loading || !worklog) return <LoadingSpinner />;

  return (
    <GradientBackground>
      <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.title}>{t('worklogs.week')} {worklog.week_number}</Text>
          <Badge status={worklog.status} />
        </View>
        <Text style={styles.date}>{worklog.start_date} - {worklog.end_date}</Text>
        <Text style={styles.hours}>{worklog.hours_worked} {t('worklogs.hours')}</Text>
      </Card>

      {worklog.entries?.map((entry, i) => (
        <Card key={i} style={styles.card}>
          <Text style={styles.entryDate}>{entry.entry_date} - {entry.time_slot}</Text>
          {entry.activities && <Text style={styles.entryText}>{entry.activities}</Text>}
          {entry.difficulties && <Text style={styles.entryDifficulty}>{entry.difficulties}</Text>}
        </Card>
      ))}

      {worklog.feedback && (
        <Card style={styles.card}>
          <Text style={styles.feedbackLabel}>{t('worklogs.reviewerFeedback')}</Text>
          <Text style={styles.feedbackText}>{worklog.feedback}</Text>
        </Card>
      )}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', padding: spacing.lg },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text },
  date: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
  hours: { fontSize: fontSize.md, color: colors.accent, fontWeight: '600', marginTop: spacing.sm },
  entryDate: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text, textTransform: 'capitalize' },
  entryText: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
  entryDifficulty: { fontSize: fontSize.sm, color: colors.warning, marginTop: spacing.xs },
  feedbackLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  feedbackText: { fontSize: fontSize.sm, color: colors.textSecondary },
});
