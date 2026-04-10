import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { Card, Button, Input, LoadingSpinner, GradientBackground } from '../../components/ui';
import { getSettings, updateSettings, type Settings } from '../../api/settings';
import { colors, fontSize, spacing, borderRadius } from '../../lib/theme';

function SettingToggle({ label, value, onToggle }: { label: string; value: string; onToggle: (v: string) => void }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value === '1'}
        onValueChange={(v) => onToggle(v ? '1' : '0')}
        trackColor={{ false: colors.gray[300], true: colors.accent }}
        thumbColor={colors.white}
      />
    </View>
  );
}

function SectionHeader({ title, color, icon }: { title: string; color: string; icon?: string }) {
  return (
    <View style={[styles.sectionHeader, { borderLeftColor: color }]}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export function ConfigurationScreen() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then((data) => { setSettings(data); setLoading(false); })
      .catch(() => { Alert.alert('Error', 'Failed to load settings'); setLoading(false); });
  }, []);

  const update = (key: keyof Settings, value: string) => {
    if (settings) setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await updateSettings(settings);
      Alert.alert('Success', 'Settings saved');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to save settings');
    } finally { setSaving(false); }
  };

  if (loading || !settings) return <LoadingSpinner />;

  return (
    <GradientBackground>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
      <SectionHeader title="General" color={colors.info} />
      <Card style={styles.card}>
        <Input label="App Name" value={settings.app_name} onChangeText={(v) => update('app_name', v)} />
        <Input label="Default Language" value={settings.default_language} onChangeText={(v) => update('default_language', v)} />
        <Input label="Contact Email" value={settings.contact_email} onChangeText={(v) => update('contact_email', v)} keyboardType="email-address" />
      </Card>

      <SectionHeader title="Academic Period" color={colors.success} />
      <Card style={styles.card}>
        <Input label="Academic Year" value={settings.academic_year} onChangeText={(v) => update('academic_year', v)} />
        <Input label="Semester" value={settings.semester} onChangeText={(v) => update('semester', v)} />
      </Card>

      <SectionHeader title="Internship Rules" color={colors.warning} />
      <Card style={styles.card}>
        <Input label="Max Interns Per Tutor" value={settings.max_interns_per_tutor} onChangeText={(v) => update('max_interns_per_tutor', v)} keyboardType="number-pad" />
        <Input label="Max Leave Days Per Intern" value={settings.max_leave_days_per_intern} onChangeText={(v) => update('max_leave_days_per_intern', v)} keyboardType="number-pad" />
        <Input label="Worklog Submission Day" value={settings.worklog_submission_day} onChangeText={(v) => update('worklog_submission_day', v)} />
      </Card>

      <SectionHeader title="Approvals" color="#8b5cf6" />
      <Card style={styles.card}>
        <SettingToggle label="Require Worklog Approval" value={settings.require_worklog_approval} onToggle={(v) => update('require_worklog_approval', v)} />
        <SettingToggle label="Require Report Approval" value={settings.require_report_approval} onToggle={(v) => update('require_report_approval', v)} />
        <SettingToggle label="Require Slide Approval" value={settings.require_slide_approval} onToggle={(v) => update('require_slide_approval', v)} />
      </Card>

      <SectionHeader title="Notifications" color="#ec4899" />
      <Card style={styles.card}>
        <SettingToggle label="Notify Tutor on Submission" value={settings.notify_tutor_on_submission} onToggle={(v) => update('notify_tutor_on_submission', v)} />
        <SettingToggle label="Notify Intern on Review" value={settings.notify_intern_on_review} onToggle={(v) => update('notify_intern_on_review', v)} />
        <SettingToggle label="Notify Admin on Registration" value={settings.notify_admin_on_registration} onToggle={(v) => update('notify_admin_on_registration', v)} />
      </Card>

      <SectionHeader title="Users & Registration" color={colors.info} />
      <Card style={styles.card}>
        <SettingToggle label="Allow Registration" value={settings.allow_registration} onToggle={(v) => update('allow_registration', v)} />
        <SettingToggle label="Require Email Verification" value={settings.require_email_verification} onToggle={(v) => update('require_email_verification', v)} />
      </Card>

      <SectionHeader title="Security" color={colors.danger} />
      <Card style={styles.card}>
        <Input label="Password Min Length" value={settings.password_min_length} onChangeText={(v) => update('password_min_length', v)} keyboardType="number-pad" />
        <SettingToggle label="Maintenance Mode" value={settings.maintenance_mode} onToggle={(v) => update('maintenance_mode', v)} />
      </Card>

      <Button title="Save Settings" onPress={handleSave} loading={saving} />
      <View style={{ height: 40 }} />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', padding: spacing.lg },
  sectionHeader: { borderLeftWidth: 4, paddingLeft: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text },
  card: { marginBottom: spacing.sm },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  toggleLabel: { fontSize: fontSize.md, color: colors.text, flex: 1, marginRight: spacing.md },
});
