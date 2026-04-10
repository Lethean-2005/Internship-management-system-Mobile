import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input, GradientBackground } from '../../components/ui';
import { register } from '../../api/auth';
import { useAuthStore } from '../../stores/authStore';
import { colors, fontSize, spacing, borderRadius } from '../../lib/theme';
import { IconSchool, IconUsers, IconBriefcase } from '@tabler/icons-react-native';
import type { AuthStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const ROLES = ['intern', 'tutor', 'supervisor'] as const;

export function RegisterScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [step, setStep] = useState(0);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [generation, setGeneration] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!password || password !== passwordConfirmation) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await register({
        name, email, password, password_confirmation: passwordConfirmation,
        phone: phone || undefined, role, department: department || undefined,
        company_name: companyName || undefined, generation: generation || undefined,
      });
      setAuth(res.user, res.token);
    } catch (err: any) {
      let message = 'Registration failed';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (!err.response && err.request) {
        message = 'Cannot reach server. Check your connection.';
      } else if (err.code === 'ECONNABORTED') {
        message = 'Request timed out. Try again.';
      }
      Alert.alert(t('auth.registrationFailed'), message);
    } finally {
      setLoading(false);
    }
  };

  const roleIcons: Record<string, typeof IconSchool> = {
    intern: IconSchool, tutor: IconUsers, supervisor: IconBriefcase,
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always">
        {step === 0 && (
          <View>
            <Text style={styles.title}>{t('auth.selectRole')}</Text>
            <Text style={styles.subtitle}>{t('auth.selectRoleDesc')}</Text>
            {ROLES.map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleCard, role === r && styles.roleCardActive]}
                onPress={() => setRole(r)}
              >
                {React.createElement(roleIcons[r], { size: 28, color: role === r ? colors.text : colors.gray[500], strokeWidth: 1.5 })}
                <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                  {t(`auth.${r}`)}
                </Text>
              </TouchableOpacity>
            ))}
            <Button title={t('auth.next')} onPress={() => setStep(1)} disabled={!role} style={{ marginTop: spacing.lg }} />
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={styles.title}>{t('auth.personalInfo')}</Text>
            <Text style={styles.subtitle}>{t('auth.registeringAs')} {t(`auth.${role}`)}</Text>
            <Input label={t('auth.fullName')} value={name} onChangeText={setName} />
            <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <Input label={`${t('auth.phone')} (${t('auth.optional')})`} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            {role === 'intern' && (
              <>
                <Input label={`${t('auth.department')} (${t('auth.optional')})`} value={department} onChangeText={setDepartment} />
                <Input label={`${t('auth.companyName')} (${t('auth.optional')})`} value={companyName} onChangeText={setCompanyName} />
                <Input label={`${t('auth.generation')} (${t('auth.optional')})`} value={generation} onChangeText={setGeneration} />
              </>
            )}
            <View style={styles.row}>
              <Button title={t('auth.back')} onPress={() => setStep(0)} variant="ghost" style={{ flex: 1, marginRight: spacing.sm }} />
              <Button title={t('auth.next')} onPress={() => setStep(2)} disabled={!name || !email} style={{ flex: 1 }} />
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.title}>{t('auth.security')}</Text>
            <Text style={styles.subtitle}>{t('auth.setPassword')}</Text>
            <Input label={t('auth.password')} value={password} onChangeText={setPassword} secureTextEntry />
            <Input label={t('auth.confirmPassword')} value={passwordConfirmation} onChangeText={setPasswordConfirmation} secureTextEntry />
            <View style={styles.row}>
              <Button title={t('auth.back')} onPress={() => setStep(1)} variant="ghost" style={{ flex: 1, marginRight: spacing.sm }} />
              <Button title={t('auth.createAccount')} onPress={handleRegister} loading={loading} style={{ flex: 1 }} />
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.alreadyHaveAccount')} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>{t('auth.signIn')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: 'transparent' },
  container: { flexGrow: 1, padding: spacing.xxl, justifyContent: 'center' },
  title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.xxl },
  roleCard: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.lg,
    borderWidth: 2, borderColor: colors.border, borderRadius: borderRadius.lg, marginBottom: spacing.md,
  },
  roleCardActive: { borderColor: colors.text, backgroundColor: '#f0f9ff' },
  roleText: { fontSize: fontSize.lg, fontWeight: '600', color: colors.gray[600], marginLeft: spacing.lg },
  roleTextActive: { color: colors.text },
  row: { flexDirection: 'row', marginTop: spacing.lg },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxl },
  footerText: { fontSize: fontSize.sm, color: colors.textSecondary },
  link: { fontSize: fontSize.sm, color: colors.text, fontWeight: '600' },
});
