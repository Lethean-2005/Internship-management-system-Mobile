import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, GradientBackground } from '../../components/ui';
import { verifyEmail, resendCode } from '../../api/auth';
import { colors, fontSize, spacing, borderRadius } from '../../lib/theme';

export function VerifyEmailScreen() {
  const { t } = useTranslation();
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 4) {
      Alert.alert('Error', t('verify.enterAllDigits'));
      return;
    }
    setLoading(true);
    try {
      await verifyEmail(fullCode);
      Alert.alert('Success', t('verify.success'));
    } catch {
      Alert.alert('Error', t('verify.failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendCode();
      Alert.alert('Success', t('verify.codeSent'));
    } catch {
      Alert.alert('Error', t('verify.resendFailed'));
    }
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
      <Text style={styles.title}>{t('verify.title')}</Text>
      <Text style={styles.subtitle}>{t('verify.subtitle')}</Text>

      <View style={styles.codeContainer}>
        {code.map((digit, i) => (
          <TextInput
            key={i}
            ref={(ref) => { inputs.current[i] = ref; }}
            style={styles.codeInput}
            value={digit}
            onChangeText={(text) => handleChange(text, i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      <Button title={t('verify.verify')} onPress={handleVerify} loading={loading} />

      <View style={styles.resendRow}>
        <Text style={styles.resendText}>{t('verify.noCode')} </Text>
        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendLink}>{t('verify.clickResend')}</Text>
        </TouchableOpacity>
      </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.xxl, backgroundColor: 'transparent' },
  title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xxxl },
  codeContainer: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: spacing.xxl },
  codeInput: {
    width: 56, height: 56, borderWidth: 2, borderColor: colors.border, borderRadius: borderRadius.lg,
    fontSize: fontSize.xxl, fontWeight: '700', color: colors.text,
  },
  resendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxl },
  resendText: { fontSize: fontSize.sm, color: colors.textSecondary },
  resendLink: { fontSize: fontSize.sm, color: colors.text, fontWeight: '600' },
});
