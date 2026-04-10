import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert, TextInput } from 'react-native';
import { IconPencil, IconTrash, IconPlus } from '@tabler/icons-react-native';
import { Card, LoadingSpinner, EmptyState, Button, Input, GradientBackground } from '../../components/ui';
import { getRoles, createRole, updateRole, deleteRole } from '../../api/roles';
import { colors, fontSize, spacing, borderRadius } from '../../lib/theme';
import type { Role } from '../../types/ims';

function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function RolesScreen() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    try { const data = await getRoles(); setRoles(data); } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetch(); }, []);

  const resetForm = () => { setName(''); setSlug(''); setDescription(''); setEditId(null); setShowForm(false); };

  const handleEdit = (role: Role) => {
    setEditId(role.id);
    setName(role.name);
    setSlug(role.slug);
    setDescription(role.description || '');
    setShowForm(true);
  };

  const handleDelete = (role: Role) => {
    Alert.alert('Delete Role', `Delete "${role.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await deleteRole(role.id); fetch(); } catch { Alert.alert('Error', 'Failed to delete role'); }
      }},
    ]);
  };

  const handleSubmit = async () => {
    if (!name || !slug) { Alert.alert('Error', 'Name and slug are required'); return; }
    setSaving(true);
    try {
      if (editId) {
        await updateRole(editId, { name, slug, description: description || null });
      } else {
        await createRole({ name, slug, description: description || null });
      }
      resetForm();
      fetch();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to save role');
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <GradientBackground>
      <View style={styles.container}>
      {showForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>{editId ? 'Edit Role' : 'New Role'}</Text>
          <Input label="Name *" value={name} onChangeText={(v) => { setName(v); if (!editId) setSlug(toSlug(v)); }} />
          <Input label="Slug *" value={slug} onChangeText={setSlug} autoCapitalize="none" />
          <Input label="Description" value={description} onChangeText={setDescription} multiline numberOfLines={2} style={{ height: 60, textAlignVertical: 'top' }} />
          <View style={styles.formActions}>
            <Button title="Cancel" onPress={resetForm} />
            <View style={{ width: spacing.sm }} />
            <Button title={editId ? 'Update' : 'Create'} onPress={handleSubmit} loading={saving} />
          </View>
        </View>
      )}

      <FlatList
        data={roles}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetch(); }} />}
        ListEmptyComponent={<EmptyState title="No roles found" icon="shield-outline" />}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.row}>
              <View style={styles.info}>
                <Text style={styles.roleName}>{item.name}</Text>
                <Text style={styles.roleSlug}>{item.slug}</Text>
                {item.description && <Text style={styles.roleDesc} numberOfLines={2}>{item.description}</Text>}
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(item)}>
                  <IconPencil size={18} color={colors.info} strokeWidth={1.5} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item)}>
                  <IconTrash size={18} color={colors.danger} strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        )}
      />

      {!showForm && (
        <TouchableOpacity style={styles.fab} onPress={() => setShowForm(true)}>
          <IconPlus size={28} color={colors.white} strokeWidth={2} />
        </TouchableOpacity>
      )}
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  formContainer: { backgroundColor: colors.white, padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  formTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  formActions: { flexDirection: 'row', marginTop: spacing.sm },
  list: { padding: spacing.lg },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1 },
  roleName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  roleSlug: { fontSize: fontSize.sm, color: colors.text, fontFamily: 'monospace', marginTop: 2 },
  roleDesc: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
  actions: { flexDirection: 'row', gap: spacing.md },
  actionBtn: { padding: spacing.xs },
  fab: {
    position: 'absolute', bottom: 20, right: 20, width: 56, height: 56,
    borderRadius: 5, backgroundColor: colors.text,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
});
