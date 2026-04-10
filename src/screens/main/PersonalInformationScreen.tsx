import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { GradientSafeArea } from '../../components/ui';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Button, Input } from '../../components/ui';
import { updateProfile, getMe, type ProfileUpdatePayload } from '../../api/auth';
import { useAuthStore } from '../../stores/authStore';
import { colors, fontSize, spacing } from '../../lib/theme';

export function PersonalInformationScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [department, setDepartment] = useState(user?.department ?? '');
  const [companyName, setCompanyName] = useState(user?.company_name ?? '');
  const [position, setPosition] = useState(user?.position ?? '');
  const [supervisorName, setSupervisorName] = useState(user?.supervisor_name ?? '');
  const [generation, setGeneration] = useState(user?.generation ?? '');

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert(t('common.cancel'), 'Name and email are required.');
      return;
    }
    setSaving(true);
    try {
      const payload: ProfileUpdatePayload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        department: department.trim() || null,
        company_name: companyName.trim() || null,
        position: position.trim() || null,
        supervisor_name: supervisorName.trim() || null,
        generation: generation.trim() || null,
      };
      const updated = await updateProfile(payload);
      const fresh = await getMe().catch(() => updated);
      setUser(fresh);
      Alert.alert(t('profile.updateSuccess'));
      navigation.goBack();
    } catch (err: any) {
      const msg = err?.response?.data?.message || t('profile.updateFailed');
      Alert.alert(t('profile.updateFailed'), msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <GradientSafeArea edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.section}>{t('auth.personalInfo')}</Text>
          <Input label={t('auth.fullName')} value={name} onChangeText={setName} />
          <Input
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label={t('auth.phone')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Input label={t('auth.department')} value={department} onChangeText={setDepartment} />

          <Text style={styles.section}>{t('users.internshipDetails')}</Text>
          <Input label={t('auth.companyName')} value={companyName} onChangeText={setCompanyName} />
          <Input label={t('users.position')} value={position} onChangeText={setPosition} />
          <Input
            label={t('users.supervisorName')}
            value={supervisorName}
            onChangeText={setSupervisorName}
          />
          <Input label={t('auth.generation')} value={generation} onChangeText={setGeneration} />

          <View style={styles.actions}>
            <Button title={t('common.save')} onPress={handleSubmit} loading={saving} />
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientSafeArea>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  container: { flex: 1 },
  content: { padding: spacing.xxl },
  section: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  actions: { marginTop: spacing.xl },
});
