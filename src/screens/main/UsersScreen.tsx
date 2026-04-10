import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IconSearch, IconPlus, IconPencil, IconToggleLeft, IconToggleRight, IconTrash } from '@tabler/icons-react-native';
import { Card, Badge, LoadingSpinner, EmptyState, Button, GradientBackground } from '../../components/ui';
import { getUsers, deleteUser, toggleActive } from '../../api/users';
import { colors, fontSize, spacing, borderRadius } from '../../lib/theme';
import type { User, PaginatedResponse } from '../../types/ims';
import type { ProfileStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<ProfileStackParamList>;

export function UsersScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetch = useCallback(async (p = 1, s = search) => {
    try {
      const res = await getUsers({ page: p, per_page: 20, search: s || undefined });
      setUsers(res.data);
      setPage(res.meta.current_page);
      setLastPage(res.meta.last_page);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  }, [search]);

  useEffect(() => { fetch(); }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => fetch(page));
    return unsubscribe;
  }, [navigation, page]);

  const handleSearch = () => { setLoading(true); fetch(1, search); };

  const handleDelete = (user: User) => {
    Alert.alert('Delete User', `Delete "${user.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await deleteUser(user.id); fetch(page); } catch { Alert.alert('Error', 'Failed to delete user'); }
      }},
    ]);
  };

  const handleToggle = async (user: User) => {
    try { await toggleActive(user.id); fetch(page); } catch { Alert.alert('Error', 'Failed to update status'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <GradientBackground>
      <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <IconSearch size={20} color={colors.white} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetch(page); }} />}
        ListEmptyComponent={<EmptyState title="No users found" icon="people-outline" />}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
              </View>
              <Badge status={item.is_active ? 'active' : 'inactive'} />
            </View>
            <View style={styles.meta}>
              {item.role && <Text style={styles.metaText}>Role: {item.role.name}</Text>}
              {item.department && <Text style={styles.metaText}>Dept: {item.department}</Text>}
              {item.generation && <Text style={styles.metaText}>Gen: {item.generation}</Text>}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('UserForm', { id: item.id })}>
                <IconPencil size={18} color={colors.info} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleToggle(item)}>
                {item.is_active ? <IconToggleRight size={18} color={colors.success} strokeWidth={1.5} /> : <IconToggleLeft size={18} color={colors.gray[400]} strokeWidth={1.5} />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item)}>
                <IconTrash size={18} color={colors.danger} strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
          </Card>
        )}
        ListFooterComponent={lastPage > 1 ? (
          <View style={styles.pagination}>
            <TouchableOpacity disabled={page <= 1} onPress={() => { setLoading(true); fetch(page - 1); }}>
              <Text style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}>← Prev</Text>
            </TouchableOpacity>
            <Text style={styles.pageInfo}>{page} / {lastPage}</Text>
            <TouchableOpacity disabled={page >= lastPage} onPress={() => { setLoading(true); fetch(page + 1); }}>
              <Text style={[styles.pageBtn, page >= lastPage && styles.pageBtnDisabled]}>Next →</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('UserForm', {})}>
        <IconPlus size={28} color={colors.white} strokeWidth={2} />
      </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  searchRow: { flexDirection: 'row', padding: spacing.lg, paddingBottom: 0 },
  searchInput: {
    flex: 1, backgroundColor: colors.white, borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, fontSize: fontSize.md,
    borderWidth: 1, borderColor: colors.border,
  },
  searchBtn: {
    backgroundColor: colors.text, borderRadius: borderRadius.md,
    width: 44, justifyContent: 'center', alignItems: 'center', marginLeft: spacing.sm,
  },
  list: { padding: spacing.lg },
  card: { marginBottom: spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 40, height: 40, borderRadius: 5, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center', marginRight: spacing.md,
  },
  avatarText: { color: colors.white, fontSize: fontSize.md, fontWeight: '700' },
  cardInfo: { flex: 1, marginRight: spacing.sm },
  name: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  email: { fontSize: fontSize.sm, color: colors.textSecondary },
  meta: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm, gap: spacing.sm },
  metaText: { fontSize: fontSize.xs, color: colors.textSecondary, backgroundColor: colors.gray[100], paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing.sm, gap: spacing.md },
  actionBtn: { padding: spacing.xs },
  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.lg },
  pageBtn: { fontSize: fontSize.md, color: colors.text, fontWeight: '600' },
  pageBtnDisabled: { color: colors.gray[300] },
  pageInfo: { fontSize: fontSize.sm, color: colors.textSecondary },
  fab: {
    position: 'absolute', bottom: 20, right: 20, width: 56, height: 56,
    borderRadius: 5, backgroundColor: colors.text,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
});
