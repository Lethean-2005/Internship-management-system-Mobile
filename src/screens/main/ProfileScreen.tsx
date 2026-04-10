import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../../stores/authStore';
import { logout } from '../../api/auth';
import { fontSize, spacing } from '../../lib/theme';
import { useAppTheme } from '../../lib/useAppTheme';
import {
  IconChevronRight, IconLogout, IconShieldCheck, IconPhone,
  IconSchool, IconBuilding, IconBriefcase, IconUser, IconUsers, IconLanguage, IconCheck,
  IconSettings, IconUsersGroup, IconShield, IconPalette,
  IconSun, IconMoon, IconDeviceMobile,
} from '@tabler/icons-react-native';
import { GradientSafeArea } from '../../components/ui';
import { useThemeStore, type ThemeMode } from '../../stores/themeStore';
import type { ProfileStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<ProfileStackParamList>;

const FLAG_BASE = 'https://flagcdn.com/w40';
const LANGUAGES = [
  { code: 'en', label: 'English', flagUrl: `${FLAG_BASE}/gb.png` },
  { code: 'km', label: 'ខ្មែរ (Khmer)', flagUrl: `${FLAG_BASE}/kh.png` },
  { code: 'fr', label: 'Français (French)', flagUrl: `${FLAG_BASE}/fr.png` },
  { code: 'mg', label: 'Malagasy', flagUrl: `${FLAG_BASE}/mg.png` },
  { code: 'vi', label: 'Tiếng Việt (Vietnamese)', flagUrl: `${FLAG_BASE}/vn.png` },
];

export function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const isAdmin = user?.role?.slug === 'admin';
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const themeMode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setMode);

  const [showLogout, setShowLogout] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [showTheme, setShowTheme] = useState(false);

  const THEME_OPTIONS: { mode: ThemeMode; labelKey: string; Icon: any }[] = [
    { mode: 'light', labelKey: 'profile.themeLight', Icon: IconSun },
    { mode: 'dark', labelKey: 'profile.themeDark', Icon: IconMoon },
    { mode: 'system', labelKey: 'profile.themeSystem', Icon: IconDeviceMobile },
  ];
  const currentTheme = THEME_OPTIONS.find((o) => o.mode === themeMode) || THEME_OPTIONS[2];
  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const handleLogout = () => setShowLogout(true);
  const confirmLogout = () => {
    setShowLogout(false);
    logout().catch(() => {});
    clearAuth();
  };

  const changeLang = async (code: string) => {
    await AsyncStorage.setItem('language', code);
    if (user?.id) await AsyncStorage.setItem(`language_${user.id}`, code);
    i18n.changeLanguage(code);
    setShowLang(false);
  };

  // Row helper — closed over the current theme's styles + colors
  const Row = ({
    Icon,
    iconBg,
    label,
    value,
    onPress,
    isLast,
  }: {
    Icon: any;
    iconBg: string;
    label: string;
    value?: string | null;
    onPress?: () => void;
    isLast?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={onPress ? 0.5 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
        <Icon size={16} color="#FFFFFF" strokeWidth={2} />
      </View>
      <View style={[styles.rowContent, !isLast && styles.rowBorder]}>
        <Text style={styles.rowLabel}>{label}</Text>
        <View style={styles.rowRight}>
          {value ? <Text style={styles.rowValue}>{value}</Text> : null}
          <IconChevronRight size={16} color={colors.cardTextMuted} strokeWidth={2} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const Group = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.groupCard}>{children}</View>
  );

  return (
    <GradientSafeArea>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>{t('profile.accountSettings')}</Text>

        <Group>
          <TouchableOpacity
            style={styles.profileRow}
            activeOpacity={0.5}
            onPress={() => navigation.navigate('EditProfile')}
          >
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase()}</Text>
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileSub}>{user?.email}</Text>
            </View>
            <IconChevronRight size={18} color={colors.cardTextMuted} strokeWidth={2} />
          </TouchableOpacity>
        </Group>

        <Group>
          <Row Icon={IconShieldCheck} iconBg="#34c759" label={t('users.role')} value={user?.role?.name || 'User'} />
          <Row Icon={IconPhone} iconBg="#34c759" label={t('auth.phone')} value={user?.phone || t('common.notSet')} />
          <Row Icon={IconSchool} iconBg="#5856d6" label={t('auth.department')} value={user?.department || t('common.notSet')} isLast />
        </Group>

        <Group>
          <Row Icon={IconBuilding} iconBg="#007aff" label={t('auth.companyName')} value={user?.company_name || t('common.notSet')} />
          <Row Icon={IconBriefcase} iconBg="#ff9500" label={t('users.position')} value={user?.position || t('common.notSet')} />
          <Row Icon={IconUser} iconBg="#af52de" label={t('users.supervisorName')} value={user?.supervisor_name || t('common.notSet')} />
          <Row Icon={IconUsers} iconBg="#ff2d55" label={t('auth.generation')} value={user?.generation || t('common.notSet')} isLast />
        </Group>

        <Group>
          <TouchableOpacity style={styles.row} activeOpacity={0.5} onPress={() => setShowLang(true)}>
            <View style={[styles.rowIcon, { backgroundColor: '#007aff' }]}>
              <IconLanguage size={16} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={[styles.rowContent, styles.rowBorder]}>
              <Text style={styles.rowLabel}>{t('profile.language')}</Text>
              <View style={styles.rowRight}>
                <Image source={{ uri: currentLang.flagUrl }} style={styles.langFlagImg} />
                <Text style={styles.rowValue}>{currentLang.label}</Text>
                <IconChevronRight size={16} color={colors.cardTextMuted} strokeWidth={2} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} activeOpacity={0.5} onPress={() => setShowTheme(true)}>
            <View style={[styles.rowIcon, { backgroundColor: '#ff9500' }]}>
              <IconPalette size={16} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={[styles.rowContent, isAdmin && styles.rowBorder]}>
              <Text style={styles.rowLabel}>{t('profile.theme')}</Text>
              <View style={styles.rowRight}>
                <Text style={styles.rowValue}>{t(currentTheme.labelKey)}</Text>
                <IconChevronRight size={16} color={colors.cardTextMuted} strokeWidth={2} />
              </View>
            </View>
          </TouchableOpacity>
          {isAdmin && (
            <Row
              Icon={IconSettings}
              iconBg="#8E8E93"
              label={t('config.title')}
              onPress={() => navigation.navigate('Configuration')}
              isLast
            />
          )}
        </Group>

        {isAdmin && (
          <Group>
            <Row
              Icon={IconUsersGroup}
              iconBg="#5856d6"
              label={t('sidebar.users')}
              onPress={() => navigation.navigate('Users')}
            />
            <Row
              Icon={IconShield}
              iconBg="#34c759"
              label={t('sidebar.roles')}
              onPress={() => navigation.navigate('Roles')}
              isLast
            />
          </Group>
        )}

        <Group>
          <TouchableOpacity style={styles.row} activeOpacity={0.5} onPress={handleLogout}>
            <View style={[styles.rowIcon, { backgroundColor: '#ff3b30' }]}>
              <IconLogout size={16} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.rowContent}>
              <Text style={[styles.rowLabel, { color: '#ff3b30' }]}>{t('sidebar.signOut')}</Text>
              <View style={styles.rowRight}>
                <IconChevronRight size={16} color={colors.cardTextMuted} strokeWidth={2} />
              </View>
            </View>
          </TouchableOpacity>
        </Group>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Logout Modal */}
      <Modal visible={showLogout} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setShowLogout(false)}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>{t('sidebar.signOut')}</Text>
            <Text style={styles.dialogMessage}>{t('sidebar.signOutConfirm')}</Text>
            <View style={styles.dialogButtons}>
              <TouchableOpacity style={styles.dialogBtn} onPress={() => setShowLogout(false)}>
                <Text style={styles.dialogBtnText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.dialogBtn, styles.dialogBtnDanger]} onPress={confirmLogout}>
                <Text style={[styles.dialogBtnText, styles.dialogBtnDangerText]}>{t('sidebar.signOut')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Theme Modal */}
      <Modal visible={showTheme} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setShowTheme(false)}>
          <View style={styles.langDialog}>
            <Text style={styles.langDialogTitle}>{t('profile.theme')}</Text>
            <Text style={styles.langDialogSub}>{t('profile.selectTheme')}</Text>
            {THEME_OPTIONS.map((opt, index) => {
              const active = themeMode === opt.mode;
              return (
                <TouchableOpacity
                  key={opt.mode}
                  style={[styles.langRow, index < THEME_OPTIONS.length - 1 && styles.langRowBorder]}
                  onPress={() => {
                    setThemeMode(opt.mode);
                    setShowTheme(false);
                  }}
                >
                  <View style={styles.themeIconWrap}>
                    <opt.Icon
                      size={20}
                      color={active ? '#007aff' : colors.cardTextMuted}
                      strokeWidth={2}
                    />
                  </View>
                  <Text style={[styles.langLabel, active && styles.langLabelActive]}>
                    {t(opt.labelKey)}
                  </Text>
                  {active && <IconCheck size={18} color="#007aff" strokeWidth={2.5} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      {/* Language Modal */}
      <Modal visible={showLang} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setShowLang(false)}>
          <View style={styles.langDialog}>
            <Text style={styles.langDialogTitle}>{t('profile.language')}</Text>
            <Text style={styles.langDialogSub}>{t('profile.selectLanguage')}</Text>
            {LANGUAGES.map((lang, index) => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langRow, index < LANGUAGES.length - 1 && styles.langRowBorder]}
                onPress={() => changeLang(lang.code)}
              >
                <Image source={{ uri: lang.flagUrl }} style={styles.langFlagModalImg} />
                <Text style={[styles.langLabel, i18n.language === lang.code && styles.langLabelActive]}>
                  {lang.label}
                </Text>
                {i18n.language === lang.code && (
                  <IconCheck size={18} color="#007aff" strokeWidth={2.5} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </GradientSafeArea>
  );
}

// Styles are created inside the component via useMemo(() => createStyles(colors))
// so they re-calculate whenever the active theme's color palette changes.
function createStyles(colors: ReturnType<typeof useAppTheme>['colors']) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: 'transparent' },
    container: { flex: 1 },
    content: { paddingHorizontal: spacing.lg },
    pageTitle: {
      fontSize: fontSize.xxxl,
      fontWeight: '700',
      color: colors.textOnBackground,
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
      paddingHorizontal: spacing.xs,
    },
    groupCard: {
      backgroundColor: colors.card,
      borderRadius: 5,
      marginBottom: spacing.xxl,
      overflow: 'hidden',
    },
    profileRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'rgba(255,255,255,0.25)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarImage: { width: 60, height: 60, borderRadius: 30 },
    avatarText: { fontSize: fontSize.xxl, fontWeight: '600', color: colors.cardText },
    profileInfo: { flex: 1, marginLeft: spacing.lg },
    profileName: { fontSize: fontSize.lg, fontWeight: '600', color: colors.cardText },
    profileSub: { fontSize: fontSize.sm, color: colors.cardTextMuted, marginTop: 2 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: spacing.lg,
      backgroundColor: colors.card,
    },
    rowIcon: {
      width: 29,
      height: 29,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rowContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingRight: spacing.lg,
      marginLeft: spacing.md,
    },
    rowBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.cardBorder,
    },
    rowLabel: { flex: 1, fontSize: fontSize.md, color: colors.cardText },
    rowRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    rowValue: { fontSize: fontSize.md, color: colors.cardTextMuted },

    // Modals
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dialog: {
      backgroundColor: colors.surface,
      borderRadius: 5,
      width: 270,
      paddingTop: spacing.xl,
      overflow: 'hidden',
    },
    dialogTitle: {
      fontSize: fontSize.lg,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      paddingHorizontal: spacing.lg,
    },
    dialogMessage: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.sm,
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.lg,
    },
    dialogButtons: {
      flexDirection: 'row',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    dialogBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
    dialogBtnText: { fontSize: fontSize.md, color: '#007aff', fontWeight: '400' },
    dialogBtnDanger: {
      borderLeftWidth: StyleSheet.hairlineWidth,
      borderLeftColor: colors.border,
    },
    dialogBtnDangerText: { color: '#ff3b30', fontWeight: '600' },

    // Language modal
    langDialog: {
      backgroundColor: colors.surface,
      borderRadius: 5,
      width: 300,
      paddingTop: spacing.xl,
      paddingBottom: spacing.lg,
      paddingHorizontal: spacing.lg,
      overflow: 'hidden',
    },
    langDialogTitle: {
      fontSize: fontSize.lg,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
    langDialogSub: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.xs,
      marginBottom: spacing.lg,
    },
    langFlagImg: { width: 24, height: 16, borderRadius: 2, marginRight: 6 },
    themeIconWrap: { width: 28, alignItems: 'center', marginRight: 12 },
    langFlagModalImg: { width: 28, height: 19, borderRadius: 2, marginRight: 12 },
    langRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
    langRowBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    langLabel: { flex: 1, fontSize: fontSize.md, color: colors.text },
    langLabelActive: { fontWeight: '600', color: '#007aff' },
  });
}
