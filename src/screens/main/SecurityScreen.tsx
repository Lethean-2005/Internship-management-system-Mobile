import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { GradientSafeArea } from '../../components/ui';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Button, Input } from '../../components/ui';
import { changePassword } from '../../api/auth';
import { colors, fontSize, spacing } from '../../lib/theme';

export function SecurityScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [saving, setSaving] = useState(false);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = async () => {
    if (!current || !next || !confirm) {
      Alert.alert(t('profile.passwordFailed'), 'All fields are required.');
      return;
    }
    if (next !== confirm) {
      Alert.alert(t('profile.passwordFailed'), 'Passwords do not match.');
      return;
    }
    setSaving(true);
    try {
      await changePassword({
        current_password: current,
        password: next,
        password_confirmation: confirm,
      });
      Alert.alert(t('profile.passwordSuccess'));
      navigation.goBack();
    } catch (err: any) {
      const msg = err?.response?.data?.message || t('profile.passwordFailed');
      Alert.alert(t('profile.passwordFailed'), msg);
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
          <Text style={styles.section}>{t('profile.changePassword')}</Text>

          <Input
            label={t('profile.currentPassword')}
            value={current}
            onChangeText={setCurrent}
            secureTextEntry
          />
          <Input
            label={t('profile.newPassword')}
            value={next}
            onChangeText={setNext}
            secureTextEntry
          />
          <Input
            label={t('auth.confirmPassword')}
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
          />

          <View style={styles.actions}>
            <Button title={t('profile.changePassword')} onPress={handleSubmit} loading={saving} />
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
