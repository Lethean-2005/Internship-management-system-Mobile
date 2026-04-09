import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input } from '../../components/ui';
import { login } from '../../api/auth';
import { useAuthStore } from '../../stores/authStore';
import { colors, fontSize, spacing, borderRadius } from '../../lib/theme';
import type { AuthStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      const res = await login({ email: email.trim().toLowerCase(), password });
      setAuth(res.user, res.token);
    } catch (err: any) {
      console.log('LOGIN ERROR:', JSON.stringify({
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        code: err.code,
      }, null, 2));
      let message = 'Invalid credentials';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        message = Object.values(errors).flat().join('\n');
      } else if (!err.response && err.request) {
        message = 'Cannot reach server. Check your connection.';
      } else if (err.code === 'ECONNABORTED') {
        message = 'Request timed out. Try again.';
      }
      Alert.alert(t('auth.loginFailed'), message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always">
        <View style={styles.header}>
          <Text style={styles.title}>{t('auth.signIn')}</Text>
          <Text style={styles.subtitle}>{t('auth.signInToAccount')}</Text>
        </View>

        <View style={styles.form}>
          <Input
            label={t('auth.email')}
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
          />
          <Input
            label={t('auth.password')}
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title={t('auth.signIn')} onPress={handleLogin} loading={loading} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.noAccount')} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>{t('auth.register')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  form: {
    marginBottom: spacing.xxl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  link: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '700',
  },
});
