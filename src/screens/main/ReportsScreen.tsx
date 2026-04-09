import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, Badge, LoadingSpinner, EmptyState } from '../../components/ui';
import { getReports } from '../../api/reports';
import { colors, fontSize, spacing } from '../../lib/theme';
import type { FinalReport } from '../../types/ims';

export function ReportsScreen() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<FinalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = async () => {
    try { const res = await getReports(); setReports(res.data); } catch {}
    setLoading(false); setRefreshing(false);
  };

  useEffect(() => { fetch(); }, []);
  if (loading) return <LoadingSpinner />;

  return (
    <FlatList
      style={styles.container}
      data={reports}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetch(); }} />}
      ListEmptyComponent={<EmptyState title={t('reports.noReportsFound')} icon="folder-outline" />}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Badge status={item.status} />
          </View>
          <Text style={styles.date}>{item.created_at?.split('T')[0]}</Text>
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
  date: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
});
