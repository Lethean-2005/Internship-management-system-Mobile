import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  IconFileText, IconPresentation, IconMessageCircle, IconBriefcase, IconPlane,
  IconUsers, IconCalendar, IconSchool, IconUser, IconShield, IconSettings, IconLayoutGrid,
} from '@tabler/icons-react-native';
import { useAuthStore } from '../../stores/authStore';
import { colors, fontSize, spacing, borderRadius } from '../../lib/theme';
import type { MoreStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<MoreStackParamList>;

interface MenuItem {
  title: string;
  screen: keyof MoreStackParamList;
  Icon: any;
  roles?: string[];
}

const menuItems: MenuItem[] = [
  { title: 'reports.title', screen: 'Reports', Icon: IconFileText },
  { title: 'slides.title', screen: 'Slides', Icon: IconPresentation },
  { title: 'interviews.title', screen: 'Interviews', Icon: IconMessageCircle },
  { title: 'jobPostings.title', screen: 'JobPostings', Icon: IconBriefcase },
  { title: 'leaves.title', screen: 'Leaves', Icon: IconPlane },
  { title: 'mentoring.title', screen: 'MentoringSessions', Icon: IconUsers },
  { title: 'sidebar.calendar', screen: 'Calendar', Icon: IconCalendar },
  { title: 'sidebar.myInterns', screen: 'MyInterns', Icon: IconSchool, roles: ['tutor'] },
  { title: 'sidebar.users', screen: 'Users', Icon: IconUser, roles: ['admin'] },
  { title: 'sidebar.roles', screen: 'Roles', Icon: IconShield, roles: ['admin'] },
  { title: 'sidebar.configuration', screen: 'Configuration', Icon: IconSettings, roles: ['admin'] },
];

export function MoreMenuScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const userRole = user?.role?.slug;

  const filtered = menuItems.filter((item) => !item.roles || (userRole && item.roles.includes(userRole)));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <IconLayoutGrid size={24} color={colors.text} strokeWidth={1.5} />
        </View>
        <Text style={styles.title}>{t('sidebar.more')}</Text>
        <Text style={styles.subtitle}>{t('sidebar.browseFeatures')}</Text>

        <View style={styles.grid}>
          {filtered.map((item) => (
            <TouchableOpacity
              key={item.screen}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.screen as any)}
            >
              <View style={styles.iconBox}>
                <item.Icon size={22} color={colors.gray[700]} strokeWidth={1.5} />
              </View>
              <Text style={styles.cardLabel} numberOfLines={2}>{t(item.title)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxxl },
  header: { paddingTop: spacing.lg, marginBottom: spacing.xl },
  title: { fontSize: fontSize.xxxl, fontWeight: '700', color: colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.xxl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    minHeight: 120,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 5,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardLabel: { fontSize: fontSize.sm, fontWeight: '500', color: colors.text },
});
