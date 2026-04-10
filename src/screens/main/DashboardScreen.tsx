import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { LoadingSpinner, Badge, GradientSafeArea } from '../../components/ui';
import { useAppTheme } from '../../lib/useAppTheme';
import { getDashboardStats } from '../../api/dashboard';
import { getLeaves } from '../../api/internLeaves';
import { getWorklogs } from '../../api/worklogs';
import { useAuthStore } from '../../stores/authStore';
import {
  IconBell,
  IconSearch,
  IconBriefcase,
  IconCalendarEvent,
  IconFileDescription,
  IconUsers,
  IconClock,
  IconFileText,
  IconPresentation,
  IconMessageCircle,
  IconPlane,
  IconCalendar,
  IconSchool,
} from '@tabler/icons-react-native';
import type { DashboardStats, InternLeave, WeeklyWorklog } from '../../types/ims';

const RADIUS = 5;

type ChipItem = {
  key: string;
  label: string;
  tab: 'WorklogsTab' | 'MoreTab' | 'DashboardTab' | 'ProfileTab';
  screen?: string;
  roles?: string[];
};

export function DashboardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const { colors, effective } = useAppTheme();

  // Local color constants derived from the active theme palette so the whole
  // dashboard flips between light and dark instantly.
  const ACCENT = '#FB923C';
  const BUTTON = '#FB923C';
  const CARD = colors.card;
  const TEXT = colors.cardText;
  const MUTED = colors.cardTextMuted;
  const TEXT_ON_BG = colors.textOnBackground;
  const MUTED_ON_BG =
    effective === 'dark' ? 'rgba(255,255,255,0.7)' : '#8B8B8B';
  const BORDER = colors.cardBorder;

  const styles = useMemo(
    () => createStyles(CARD, TEXT, MUTED, TEXT_ON_BG, MUTED_ON_BG, BORDER, ACCENT, BUTTON),
    [CARD, TEXT, MUTED, TEXT_ON_BG, MUTED_ON_BG, BORDER],
  );

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leaves, setLeaves] = useState<InternLeave[]>([]);
  const [pendingWorklogs, setPendingWorklogs] = useState<WeeklyWorklog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [activeChip, setActiveChip] = useState<string>('worklogs');

  const userRole = user?.role?.slug;

  const allChips: ChipItem[] = [
    { key: 'worklogs', label: t('worklogs.title'), tab: 'WorklogsTab', screen: 'WorklogsList' },
    { key: 'leaves', label: t('leaves.title'), tab: 'MoreTab', screen: 'Leaves' },
    { key: 'reports', label: t('reports.title'), tab: 'MoreTab', screen: 'Reports' },
    { key: 'slides', label: t('slides.title'), tab: 'MoreTab', screen: 'Slides' },
    { key: 'interviews', label: t('interviews.title'), tab: 'MoreTab', screen: 'Interviews' },
    { key: 'jobs', label: t('jobPostings.title'), tab: 'MoreTab', screen: 'JobPostings' },
    { key: 'mentoring', label: t('mentoring.title'), tab: 'MoreTab', screen: 'MentoringSessions' },
    { key: 'calendar', label: t('sidebar.calendar'), tab: 'MoreTab', screen: 'Calendar' },
    { key: 'myInterns', label: t('sidebar.myInterns'), tab: 'MoreTab', screen: 'MyInterns', roles: ['tutor'] },
  ];

  const chips = allChips.filter((c) => !c.roles || (userRole && c.roles.includes(userRole)));

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

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner />;

  const roleSlug = user?.role?.slug;
  const roleKey =
    roleSlug === 'admin'
      ? 'users.admin'
      : roleSlug === 'tutor'
      ? 'auth.tutor'
      : roleSlug === 'supervisor'
      ? 'auth.supervisor'
      : roleSlug === 'intern'
      ? 'auth.intern'
      : null;
  const roleLabel = roleKey ? t(roleKey) : user?.role?.name || 'User';

  return (
    <GradientSafeArea edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            tintColor={ACCENT}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchAll();
            }}
          />
        }
      >
        {/* Top bar: logo image + bell + avatar */}
        <View style={styles.topBar}>
          <Image
            source={require('../../../assets/images.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={styles.topBarRight}>
            <TouchableOpacity style={styles.bellBtn} activeOpacity={0.85}>
              <IconBell size={18} color={TEXT_ON_BG} strokeWidth={1.8} />
              <View style={styles.bellDot} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.topAvatar}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('ProfileTab')}
            >
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.topAvatarImage} />
              ) : (
                <Text style={styles.topAvatarText}>
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.heroBlock}>
          <Text style={styles.hero} numberOfLines={1}>
            {t('dashboard.hello', { name: roleLabel })}
          </Text>
        </View>

        {/* Search pill */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <IconSearch size={18} color={MUTED_ON_BG} strokeWidth={1.8} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('common.search')}
              placeholderTextColor={MUTED_ON_BG}
              underlineColorAndroid="transparent"
              selectionColor={ACCENT}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Text pill tabs — horizontal scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
          style={styles.chipsScrollWrap}
          directionalLockEnabled
          decelerationRate="fast"
          bounces
        >
          {chips.map((c) => {
            const active = activeChip === c.key;
            return (
              <TouchableOpacity
                key={c.key}
                activeOpacity={0.85}
                onPress={() => {
                  setActiveChip(c.key);
                  navigation.navigate(c.tab as any, c.screen ? { screen: c.screen } : undefined);
                }}
                style={[styles.pillTab, active && styles.pillTabActive]}
              >
                <Text
                  style={[styles.pillTabText, active && styles.pillTabTextActive]}
                  numberOfLines={1}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Section: Pending Review (horizontal) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('dashboard.pendingReview')}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('WorklogsTab', { screen: 'WorklogsList' })}
          >
            <Text style={styles.seeAll}>{t('dashboard.viewAll')}</Text>
          </TouchableOpacity>
        </View>

        {pendingWorklogs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{t('worklogs.noWorklogsFound')}</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {pendingWorklogs.map((wl) => (
              <TouchableOpacity
                key={wl.id}
                activeOpacity={0.85}
                style={styles.listCard}
                onPress={() =>
                  navigation.navigate('WorklogsTab', {
                    screen: 'WorklogDetail',
                    params: { id: wl.id },
                  })
                }
              >
                <View style={[styles.listIcon, styles.listIconWorklog]}>
                  <IconBriefcase size={20} color={ACCENT} strokeWidth={2} />
                </View>
                <View style={styles.listBody}>
                  <Text style={styles.listTitle} numberOfLines={1}>
                    {t('worklogs.week')} {wl.week_number} · {wl.user?.name || t('worklogs.weeklyWorkLog')}
                  </Text>
                  <View style={styles.listMetaRow}>
                    <IconClock size={12} color={MUTED} strokeWidth={2} />
                    <Text style={styles.listMeta} numberOfLines={1}>
                      {wl.start_date} → {wl.end_date}
                    </Text>
                  </View>
                </View>
                <View style={styles.listRight}>
                  <Text style={styles.listHours}>{wl.hours_worked}h</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Section: Recent Leaves */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>{t('leaves.title')}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('MoreTab', { screen: 'Leaves' })}
          >
            <Text style={styles.seeAll}>{t('dashboard.viewAll')}</Text>
          </TouchableOpacity>
        </View>

        {leaves.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{t('leaves.noLeaveRequests')}</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {leaves.map((leave) => (
              <View key={leave.id} style={styles.listCard}>
                <View style={[styles.listIcon, styles.listIconLeave]}>
                  <IconCalendarEvent size={20} color={ACCENT} strokeWidth={2} />
                </View>
                <View style={styles.listBody}>
                  <Text style={styles.listTitle} numberOfLines={1}>
                    {leave.user?.name || t('leaves.title')}
                    <Text style={styles.listTitleMuted}> · {leave.type}</Text>
                  </Text>
                  <View style={styles.listMetaRow}>
                    <IconClock size={12} color={MUTED} strokeWidth={2} />
                    <Text style={styles.listMeta} numberOfLines={1}>
                      {leave.start_date} → {leave.end_date}
                    </Text>
                  </View>
                </View>
                <View style={styles.listRight}>
                  <Badge status={leave.status} />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </GradientSafeArea>
  );
}

function createStyles(
  CARD: string,
  TEXT: string,
  MUTED: string,
  TEXT_ON_BG: string,
  MUTED_ON_BG: string,
  BORDER: string,
  ACCENT: string,
  BUTTON: string,
) {
  return StyleSheet.create({
  scroll: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: { paddingBottom: 40 },

  // Top bar: logo + bell + avatar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  logoImage: {
    width: 38,
    height: 38,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: ACCENT,
    borderWidth: 1,
    borderColor: CARD,
  },
  topAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  topAvatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  topAvatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // Greeting heading
  heroBlock: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  hero: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_ON_BG,
    letterSpacing: -0.3,
  },

  // Search
  searchRow: {
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 999,
    paddingHorizontal: 18,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: TEXT,
    fontSize: 15,
    marginLeft: 10,
    paddingVertical: 0,
    height: '100%',
    borderWidth: 0,
    // @ts-ignore — react-native-web only
    outlineWidth: 0,
    outlineStyle: 'none',
  },

  // Pill tabs
  chipsScrollWrap: { marginBottom: 24, flexGrow: 0 },
  chipsScroll: {
    paddingHorizontal: 20,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillTab: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    backgroundColor: CARD,
    borderRadius: 999,
    marginRight: 10,
  },
  pillTabActive: {
    backgroundColor: ACCENT,
  },
  pillTabText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '600',
  },
  pillTabTextActive: {
    color: '#FFFFFF',
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: TEXT_ON_BG },
  seeAll: { fontSize: 13, color: BUTTON, fontWeight: '600' },

  // Vertical list
  list: { paddingHorizontal: 20, gap: 10 },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: RADIUS,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 14,
  },
  listIcon: {
    width: 42,
    height: 42,
    borderRadius: RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listIconWorklog: { backgroundColor: '#FFF4EB' },
  listIconLeave: { backgroundColor: '#FFEFE0' },
  listBody: { flex: 1 },
  listTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 4,
  },
  listTitleMuted: {
    fontWeight: '500',
    color: MUTED,
    textTransform: 'capitalize',
  },
  listMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listMeta: {
    fontSize: 12,
    color: MUTED,
    flex: 1,
  },
  listRight: {
    alignItems: 'flex-end',
  },
  listHours: {
    fontSize: 14,
    fontWeight: '700',
    color: BUTTON,
  },

  // Empty
  emptyCard: {
    backgroundColor: CARD,
    marginHorizontal: 20,
    borderRadius: RADIUS,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: { fontSize: 13, color: MUTED },
  });
}
