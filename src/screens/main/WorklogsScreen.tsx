import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card, Badge, LoadingSpinner, EmptyState, Button } from '../../components/ui';
import { getWorklogs } from '../../api/worklogs';
import { colors, fontSize, spacing } from '../../lib/theme';
import type { WeeklyWorklog } from '../../types/ims';
import type { WorklogsStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<WorklogsStackParamList>;

export function WorklogsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const [worklogs, setWorklogs] = useState<WeeklyWorklog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = async () => {
    try {
      const res = await getWorklogs();
      setWorklogs(res.data);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetch(); }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <FlatList
        data={worklogs}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetch(); }} />}
        ListEmptyComponent={<EmptyState title={t('worklogs.noWorklogsFound')} icon="document-text-outline" />}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('WorklogDetail', { id: item.id })}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.weekText}>{t('worklogs.week')} {item.week_number}</Text>
                <Badge status={item.status} />
              </View>
              <Text style={styles.dateText}>{item.start_date} - {item.end_date}</Text>
              <Text style={styles.hoursText}>{item.hours_worked}h</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
      <View style={styles.fab}>
        <Button title="+" onPress={() => navigation.navigate('WorklogForm', {})} style={styles.fabBtn} textStyle={{ fontSize: 24 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg },
  card: { marginBottom: spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  weekText: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text },
  dateText: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
  hoursText: { fontSize: fontSize.sm, color: colors.accent, fontWeight: '600', marginTop: spacing.xs },
  fab: { position: 'absolute', bottom: 20, right: 20 },
  fabBtn: { width: 56, height: 56, borderRadius: 5 },
});
