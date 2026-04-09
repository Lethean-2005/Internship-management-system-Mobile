import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { LoadingSpinner, Badge } from '../../components/ui';
import { getDashboardStats } from '../../api/dashboard';
import { getLeaves } from '../../api/internLeaves';
import { getWorklogs } from '../../api/worklogs';
import { useAuthStore } from '../../stores/authStore';
import { colors, fontSize, spacing, borderRadius } from '../../lib/theme';
import { IconUsers, IconFileText, IconFolder, IconCalendar, IconChevronRight } from '@tabler/icons-react-native';
import type { DashboardStats, InternLeave, WeeklyWorklog } from '../../types/ims';

export function DashboardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leaves, setLeaves] = useState<InternLeave[]>([]);
  const [pendingWorklogs, setPendingWorklogs] = useState<WeeklyWorklog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = async () => {
    try {
      const [statsData, leavesData, worklogsData] = await Promise.all([
        getDashboardStats(),
        getLeaves({ per_page: 5 }).catch(() => ({ data: [] })),
        getWorklogs({ status: 'submitted', per_page: 5 }).catch(() => ({ data: [] })),
      ]);
      setStats(statsData);
      setLeaves(leavesData.data);
      setPendingWorklogs(worklogsData.data);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchAll(); }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { key: 'totalInterns', Icon: IconUsers, value: stats?.total_interns },
    { key: 'pendingWorklogs', Icon: IconFileText, value: stats?.pending_worklogs },
    { key: 'pendingReports', Icon: IconFolder, value: stats?.pending_reports },
    { key: 'upcomingInterviews', Icon: IconCalendar, value: stats?.upcoming_interviews },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAll(); }} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('sidebar.dashboard')}</Text>
          <Text style={styles.subtitle}>{t('dashboard.welcome', { name: user?.name })}</Text>
        </View>

        {/* Stat Cards */}
        <View style={styles.grid}>
          {statCards.map((s) => (
            <View key={s.key} style={styles.statCard}>
              <View style={styles.cardTop}>
                <s.Icon size={20} color="#f97316" strokeWidth={1.5} />
              </View>
              <Text style={styles.statLabel}>{t(`dashboard.${s.key}`)}</Text>
              <Text style={styles.statValue}>{s.value ?? 0}</Text>
            </View>
          ))}
        </View>

        {/* Take Leave */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('leaves.title')}</Text>
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => navigation.navigate('MoreTab', { screen: 'Leaves' })}
            >
              <Text style={styles.viewAllText}>{t('dashboard.viewAll')}</Text>
              <IconChevronRight size={14} color="#f97316" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {leaves.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>{t('leaves.noLeaveRequests')}</Text>
            </View>
          ) : (
            leaves.map((leave) => (
              <View key={leave.id} style={styles.listCard}>
                <View style={styles.listCardRow}>
                  <View style={styles.listCardLeft}>
                    <Text style={styles.listCardTitle}>{leave.type}</Text>
                    <Text style={styles.listCardSub}>{leave.start_date}  →  {leave.end_date}</Text>
                    {leave.reason && <Text style={styles.listCardDesc} numberOfLines={1}>{leave.reason}</Text>}
                  </View>
                  <Badge status={leave.status} />
                </View>
                {leave.user && (
                  <Text style={styles.listCardMeta}>{leave.user.name}</Text>
                )}
              </View>
            ))
          )}
        </View>

        {/* Waiting for Review */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('dashboard.pendingReview')}</Text>
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => navigation.navigate('WorklogsTab', { screen: 'WorklogsList' })}
            >
              <Text style={styles.viewAllText}>{t('dashboard.viewAll')}</Text>
              <IconChevronRight size={14} color="#f97316" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {pendingWorklogs.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>{t('worklogs.noWorklogsFound')}</Text>
            </View>
          ) : (
            pendingWorklogs.map((wl) => (
              <TouchableOpacity
                key={wl.id}
                style={styles.listCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('WorklogsTab', { screen: 'WorklogDetail', params: { id: wl.id } })}
              >
                <View style={styles.listCardRow}>
                  <View style={styles.listCardLeft}>
                    <Text style={styles.listCardTitle}>{t('worklogs.week')} {wl.week_number}</Text>
                    <Text style={styles.listCardSub}>{wl.start_date}  →  {wl.end_date}</Text>
                    <Text style={styles.listCardDesc}>{wl.hours_worked}h {t('worklogs.hours').toLowerCase()}</Text>
                  </View>
                  <View style={styles.listCardRight}>
                    <Badge status={wl.status} />
                    <IconChevronRight size={16} color={colors.gray[300]} strokeWidth={2} />
                  </View>
                </View>
                {wl.user && (
                  <Text style={styles.listCardMeta}>{wl.user.name}</Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 60 },
  header: { paddingHorizontal: spacing.xxl, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  title: { fontSize: fontSize.xxxl, fontWeight: '700', color: colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },

  // Stat cards
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: spacing.md },
  statCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    minHeight: 140,
  },
  cardTop: { marginBottom: spacing.lg },
  statLabel: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.xs },
  statValue: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text },

  // Section
  section: { marginTop: spacing.xxl, paddingHorizontal: spacing.lg },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAllText: { fontSize: fontSize.sm, color: '#f97316', fontWeight: '500' },

  // List cards
  listCard: {
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  listCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  listCardLeft: { flex: 1, marginRight: spacing.md },
  listCardRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  listCardTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text, textTransform: 'capitalize' },
  listCardSub: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4 },
  listCardDesc: { fontSize: fontSize.xs, color: colors.gray[500], marginTop: 4 },
  listCardMeta: { fontSize: fontSize.xs, color: colors.gray[400], marginTop: spacing.sm },

  // Empty
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: { fontSize: fontSize.sm, color: colors.textSecondary },
});
