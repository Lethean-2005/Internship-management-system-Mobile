import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Button, Input, LoadingSpinner, GradientBackground } from '../../components/ui';
import { getUser, createUser, updateUser } from '../../api/users';
import { getRoles } from '../../api/roles';
import { colors, fontSize, spacing, borderRadius } from '../../lib/theme';
import type { Role } from '../../types/ims';
import type { ProfileStackParamList } from '../../navigation/types';

type FormRoute = RouteProp<ProfileStackParamList, 'UserForm'>;

export function UserFormScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<FormRoute>();
  const editId = route.params?.id;
  const isEdit = !!editId;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState<number | null>(null);
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    getRoles().then(setRoles).catch(() => {});
    if (editId) {
      getUser(editId).then((user) => {
        setName(user.name);
        setEmail(user.email);
        setRoleId(user.role_id);
        setPhone(user.phone || '');
        setDepartment(user.department || '');
        setLoading(false);
      }).catch(() => { Alert.alert('Error', 'Failed to load user'); navigation.goBack(); });
    }
  }, [editId]);

  const handleSubmit = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }
    if (!isEdit && !password) {
      Alert.alert('Error', 'Password is required for new users');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name, email, role_id: roleId,
        phone: phone || null, department: department || null,
        ...(password ? { password } : {}),
      };
      if (isEdit) {
        await updateUser(editId!, payload);
      } else {
        await createUser(payload as any);
      }
      navigation.goBack();
    } catch (err: any) {
      const msg = err.response?.data?.message || (isEdit ? 'Failed to update user' : 'Failed to create user');
      Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <GradientBackground>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
      <Text style={styles.section}>Account</Text>
      <Input label="Name *" value={name} onChangeText={setName} />
      <Input label="Email *" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Input label={isEdit ? 'Password (leave blank to keep)' : 'Password *'} value={password} onChangeText={setPassword} secureTextEntry />

      <Text style={styles.section}>Role</Text>
      <View style={styles.roleList}>
        {roles.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={[styles.roleChip, roleId === r.id && styles.roleChipActive]}
            onPress={() => setRoleId(r.id)}
          >
            <Text style={[styles.roleChipText, roleId === r.id && styles.roleChipTextActive]}>{r.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.section}>Personal Info</Text>
      <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label="Department" value={department} onChangeText={setDepartment} />

      <Button title={isEdit ? 'Update User' : 'Create User'} onPress={handleSubmit} loading={saving} />
      <View style={{ height: 40 }} />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', padding: spacing.xxl },
  section: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  roleList: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  roleChip: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.white,
  },
  roleChipActive: { backgroundColor: colors.text, borderColor: colors.text },
  roleChipText: { fontSize: fontSize.sm, color: colors.textSecondary },
  roleChipTextActive: { color: colors.white, fontWeight: '600' },
});
