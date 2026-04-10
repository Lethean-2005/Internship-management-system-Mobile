import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { GradientSafeArea } from '../../components/ui';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import {
  IconChevronRight,
  IconUser,
  IconShieldLock,
  IconBriefcase,
  IconBell,
  IconCamera,
} from '@tabler/icons-react-native';
import { uploadAvatar, getMe } from '../../api/auth';
import { useAuthStore } from '../../stores/authStore';
import { fontSize, spacing } from '../../lib/theme';
import { useAppTheme } from '../../lib/useAppTheme';
import type { ProfileStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<ProfileStackParamList>;

interface RowProps {
  Icon: any;
  iconBg: string;
  label: string;
  value?: string | null;
  onPress?: () => void;
  isLast?: boolean;
  styles: any;
  mutedColor: string;
}

function Row({ Icon, iconBg, label, value, onPress, isLast, styles, mutedColor }: RowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={onPress ? 0.5 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
        <Icon size={18} color="#FFFFFF" strokeWidth={2} />
      </View>
      <View style={[styles.rowContent, !isLast && styles.rowBorder]}>
        <Text style={styles.rowLabel}>{label}</Text>
        <View style={styles.rowRight}>
          {value ? <Text style={styles.rowValue}>{value}</Text> : null}
          <IconChevronRight size={16} color={mutedColor} strokeWidth={2.2} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function EditProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [uploading, setUploading] = useState(false);

  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  const pickAvatar = async () => {
    if (uploading) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(t('profile.avatarFailed'), 'Photo library access is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    // Hard limit: 2 MB to match the profile.avatarTooLarge translation.
    if (asset.fileSize && asset.fileSize > 2 * 1024 * 1024) {
      Alert.alert(t('profile.avatarTooLarge'));
      return;
    }

    const fileName = asset.fileName || `avatar-${Date.now()}.jpg`;
    const mimeType = asset.mimeType || 'image/jpeg';

    setUploading(true);
    try {
      const updated = await uploadAvatar(asset.uri, fileName, mimeType);
      const fresh = await getMe().catch(() => updated);
      setUser(fresh);
      Alert.alert(t('profile.avatarSuccess'));
    } catch (err: any) {
      console.error(
        '[avatar upload] failed — status',
        err?.response?.status,
        'body:',
        JSON.stringify(err?.response?.data, null, 2),
      );
      const body = err?.response?.data;
      const errorList = body?.errors
        ? Object.entries(body.errors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('\n')
        : '';
      const msg = [body?.message, errorList].filter(Boolean).join('\n') || t('profile.avatarFailed');
      Alert.alert(t('profile.avatarFailed'), msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <GradientSafeArea edges={['bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero: avatar + name + email */}
        <View style={styles.hero}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={pickAvatar}
            style={styles.avatarWrap}
          >
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initial}</Text>
              </View>
            )}
            {uploading ? (
              <View style={styles.avatarOverlay}>
                <ActivityIndicator color="#FFFFFF" />
              </View>
            ) : (
              <View style={styles.cameraBadge}>
                <IconCamera size={16} color="#FFFFFF" strokeWidth={2} />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.heroName}>{user?.name}</Text>
          <Text style={styles.heroEmail}>{user?.email}</Text>
        </View>

        {/* Group 1: Account */}
        <View style={styles.groupCard}>
          <Row
            Icon={IconUser}
            iconBg="#007AFF"
            label={t('auth.personalInfo')}
            onPress={() => navigation.navigate('PersonalInformation')}
            styles={styles}
            mutedColor={colors.cardTextMuted}
          />
          <Row
            Icon={IconShieldLock}
            iconBg="#34C759"
            label={t('profile.security')}
            onPress={() => navigation.navigate('Security')}
            styles={styles}
            mutedColor={colors.cardTextMuted}
          />
          <Row
            Icon={IconBriefcase}
            iconBg="#FF9500"
            label={t('users.position')}
            value={user?.position || t('common.notSet')}
            isLast
            styles={styles}
            mutedColor={colors.cardTextMuted}
          />
        </View>

        {/* Group 2: Meta (read-only display) */}
        <View style={styles.groupCard}>
          <Row
            Icon={IconBell}
            iconBg="#AF52DE"
            label={t('users.role')}
            value={user?.role?.name || 'User'}
            isLast
            styles={styles}
            mutedColor={colors.cardTextMuted}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </GradientSafeArea>
  );
}

function createStyles(colors: any) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },

  // Hero
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarWrap: {
    width: 104,
    height: 104,
    marginBottom: spacing.md,
    position: 'relative',
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.gray[400],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 104,
    height: 104,
    borderRadius: 52,
  },
  avatarText: {
    fontSize: 44,
    fontWeight: '600',
    color: colors.white,
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 52,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F2F2F7',
  },
  heroName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textOnBackground,
    marginBottom: 4,
  },
  heroEmail: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
  },

  // Group cards
  groupCard: {
    backgroundColor: colors.card,
    borderRadius: 5,
    marginBottom: spacing.xxl,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.lg,
    backgroundColor: colors.card,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingRight: spacing.lg,
    marginLeft: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardBorder,
  },
  rowLabel: { flex: 1, fontSize: fontSize.md, color: colors.cardText, fontWeight: '500' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue: { fontSize: fontSize.sm, color: colors.cardTextMuted },
  });
}
