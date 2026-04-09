import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Modal, Pressable, TextInput, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, Badge, LoadingSpinner, EmptyState, Button, Input } from '../../components/ui';
import { getInterviews, createInterview, updateInterview, deleteInterview, updateResult } from '../../api/interviews';
import { getUsers } from '../../api/users';
import { useAuthStore } from '../../stores/authStore';
import { colors, fontSize, spacing } from '../../lib/theme';
import { IconCalendar, IconMapPin, IconPlus, IconPencil, IconTrash, IconClipboardCheck } from '@tabler/icons-react-native';
import type { CompanyInterview, User } from '../../types/ims';

export function InterviewsScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const userRole = user?.role?.slug;
  const isAdmin = userRole === 'admin' || userRole === 'supervisor';

  const [interviews, setInterviews] = useState<CompanyInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Form modal
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('onsite');
  const [notes, setNotes] = useState('');
  const [employment, setEmployment] = useState('');

  // Assign intern
  const [interns, setInterns] = useState<User[]>([]);
  const [selectedIntern, setSelectedIntern] = useState<number | null>(null);
  const [internSearch, setInternSearch] = useState('');

  // Result modal
  const [resultTarget, setResultTarget] = useState<CompanyInterview | null>(null);
  const [resultValue, setResultValue] = useState('');
  const [feedback, setFeedback] = useState('');

  const fetch = async () => {
    try { const res = await getInterviews(); setInterviews(res.data); } catch {}
    setLoading(false); setRefreshing(false);
  };

  useEffect(() => { fetch(); }, []);

  const resetForm = () => {
    setShowForm(false); setEditId(null); setCompanyName(''); setInterviewDate('');
    setLocation(''); setType('onsite'); setNotes(''); setEmployment('');
    setSelectedIntern(null); setInternSearch('');
  };

  const openCreate = async () => {
    resetForm();
    if (isAdmin) {
      try { const res = await getUsers({ role: 'intern', per_page: 100 }); setInterns(res.data); } catch {}
    }
    setShowForm(true);
  };

  const openEdit = async (item: CompanyInterview) => {
    setEditId(item.id);
    setCompanyName(item.company?.name || '');
    setInterviewDate(item.interview_date);
    setLocation(item.location || '');
    setType(item.type);
    setNotes(item.notes || '');
    setSelectedIntern(item.user_id);
    if (isAdmin) {
      try { const res = await getUsers({ role: 'intern', per_page: 100 }); setInterns(res.data); } catch {}
    }
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!companyName || !interviewDate) return;
    setSaving(true);
    try {
      const payload = {
        user_id: selectedIntern || user!.id,
        company_name: companyName,
        interview_date: interviewDate,
        location: location || null,
        type,
        employment: employment || null,
        notes: notes || null,
      };
      if (editId) {
        await updateInterview(editId, payload);
      } else {
        await createInterview(payload);
      }
      resetForm();
      fetch();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to save');
    }
    setSaving(false);
  };

  const handleDelete = (id: number) => {
    deleteInterview(id).then(() => fetch()).catch(() => {});
  };

  const handleResult = async () => {
    if (!resultTarget || !resultValue) return;
    try {
      await updateResult(resultTarget.id, { result: resultValue, feedback: feedback || null });
      setResultTarget(null); setResultValue(''); setFeedback('');
      fetch();
    } catch {}
  };

  const isPast = (date: string) => new Date(date) < new Date();

  if (loading) return <LoadingSpinner />;

  const filteredInterns = interns.filter((i) =>
    i.name.toLowerCase().includes(internSearch.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={interviews}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetch(); }} />}
        ListEmptyComponent={<EmptyState title={t('interviews.noInterviewsFound')} icon="calendar-outline" />}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.company}>{item.company?.name || 'Company'}</Text>
              <Badge status={item.status} />
            </View>
            {item.user && <Text style={styles.intern}>{item.user.name}</Text>}
            <View style={styles.infoRow}>
              <IconCalendar size={14} color={colors.textSecondary} strokeWidth={1.5} />
              <Text style={styles.date}> {item.interview_date}</Text>
            </View>
            {item.location && (
              <View style={styles.infoRow}>
                <IconMapPin size={14} color={colors.textSecondary} strokeWidth={1.5} />
                <Text style={styles.date}> {item.location}</Text>
              </View>
            )}
            <View style={styles.metaRow}>
              <Text style={styles.type}>{item.type}</Text>
              {item.result && <Badge status={item.result} />}
            </View>
            {item.feedback && <Text style={styles.feedback}>{t('interviews.feedback')}: {item.feedback}</Text>}

            {/* Actions */}
            <View style={styles.actions}>
              {isAdmin && isPast(item.interview_date) && !item.result && (
                <TouchableOpacity style={[styles.actionBtn, styles.resultBtn]} onPress={() => { setResultTarget(item); setResultValue(''); setFeedback(''); }}>
                  <IconClipboardCheck size={14} color="#fff" strokeWidth={2} />
                  <Text style={styles.actionText}>{t('interviews.updateResult')}</Text>
                </TouchableOpacity>
              )}
              {!isPast(item.interview_date) && (
                <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} onPress={() => openEdit(item)}>
                  <IconPencil size={14} color="#fff" strokeWidth={2} />
                </TouchableOpacity>
              )}
              {isAdmin && (
                <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(item.id)}>
                  <IconTrash size={14} color={colors.danger} strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>
          </Card>
        )}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openCreate}>
        <IconPlus size={28} color={colors.white} strokeWidth={2} />
      </TouchableOpacity>

      {/* Create/Edit Form Modal */}
      <Modal visible={showForm} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={resetForm}>
          <Pressable style={styles.formDialog} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.formTitle}>{editId ? t('interviews.editInterview') : t('interviews.scheduleInterview')}</Text>

            {isAdmin && !editId && (
              <>
                <Text style={styles.formLabel}>{t('interviews.assignIntern')}</Text>
                <TextInput
                  style={styles.formSearch}
                  placeholder={t('interviews.searchIntern')}
                  value={internSearch}
                  onChangeText={setInternSearch}
                  placeholderTextColor={colors.gray[400]}
                />
                <View style={styles.internList}>
                  {filteredInterns.slice(0, 5).map((i) => (
                    <TouchableOpacity
                      key={i.id}
                      style={[styles.internRow, selectedIntern === i.id && styles.internRowActive]}
                      onPress={() => setSelectedIntern(i.id)}
                    >
                      <Text style={[styles.internName, selectedIntern === i.id && styles.internNameActive]}>{i.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <Input label={t('companies.companyName') + ' *'} value={companyName} onChangeText={setCompanyName} />
            <Input label={t('interviews.interviewDate') + ' *'} value={interviewDate} onChangeText={setInterviewDate} placeholder="YYYY-MM-DD" />
            <Input label={t('interviews.location')} value={location} onChangeText={setLocation} />

            <Text style={styles.formLabel}>{t('interviews.type')}</Text>
            <View style={styles.typeRow}>
              {['onsite', 'online', 'hybrid'].map((tp) => (
                <TouchableOpacity
                  key={tp}
                  style={[styles.typeChip, type === tp && styles.typeChipActive]}
                  onPress={() => setType(tp)}
                >
                  <Text style={[styles.typeChipText, type === tp && styles.typeChipTextActive]}>
                    {t(`interviews.${tp}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input label={t('interviews.notes')} value={notes} onChangeText={setNotes} multiline numberOfLines={2} style={{ height: 60, textAlignVertical: 'top' }} />

            <View style={styles.formButtons}>
              <Button title={t('common.cancel')} onPress={resetForm} variant="secondary" />
              <View style={{ width: spacing.sm }} />
              <Button title={editId ? t('common.update') : t('common.create')} onPress={handleSubmit} loading={saving} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Result Modal */}
      <Modal visible={!!resultTarget} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setResultTarget(null)}>
          <Pressable style={styles.formDialog} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.formTitle}>{t('interviews.updateResult')}</Text>
            {resultTarget?.user && <Text style={styles.formSub}>{resultTarget.user.name}</Text>}

            <View style={styles.resultRow}>
              {['passed', 'failed'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.resultChip, resultValue === r && (r === 'passed' ? styles.passedChip : styles.failedChip)]}
                  onPress={() => setResultValue(r)}
                >
                  <Text style={[styles.resultChipText, resultValue === r && styles.resultChipTextActive]}>
                    {t(`interviews.${r}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input label={t('interviews.feedback')} value={feedback} onChangeText={setFeedback} multiline numberOfLines={2} style={{ height: 60, textAlignVertical: 'top' }} />

            <View style={styles.formButtons}>
              <Button title={t('common.cancel')} onPress={() => setResultTarget(null)} variant="secondary" />
              <View style={{ width: spacing.sm }} />
              <Button title={t('common.save')} onPress={handleResult} disabled={!resultValue} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  company: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  intern: { fontSize: fontSize.sm, color: colors.accent, marginTop: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  date: { fontSize: fontSize.sm, color: colors.textSecondary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  type: { fontSize: fontSize.xs, color: colors.accent, fontWeight: '500', textTransform: 'capitalize' },
  feedback: { fontSize: fontSize.xs, color: colors.gray[500], marginTop: spacing.xs, fontStyle: 'italic' },

  // Actions
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 5 },
  actionText: { fontSize: fontSize.xs, color: '#fff', fontWeight: '600' },
  resultBtn: { backgroundColor: '#3b82f6' },
  editBtn: { backgroundColor: '#f97316' },
  deleteBtn: { backgroundColor: colors.gray[100] },

  // FAB
  fab: {
    position: 'absolute', bottom: 20, right: 20, width: 56, height: 56,
    borderRadius: 5, backgroundColor: colors.text,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },

  // Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  formDialog: { backgroundColor: colors.white, borderRadius: 5, width: '90%', maxHeight: '85%', padding: spacing.xl },
  formTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  formSub: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.md },
  formLabel: { fontSize: fontSize.sm, fontWeight: '500', color: colors.gray[600], marginBottom: spacing.xs, marginTop: spacing.sm },
  formSearch: {
    borderWidth: 1, borderColor: colors.gray[300], borderRadius: 5,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: fontSize.sm, color: colors.text,
    marginBottom: spacing.xs,
  },
  formButtons: { flexDirection: 'row', marginTop: spacing.lg },

  // Intern list
  internList: { marginBottom: spacing.sm },
  internRow: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: 5, marginBottom: 2 },
  internRowActive: { backgroundColor: colors.gray[100] },
  internName: { fontSize: fontSize.sm, color: colors.text },
  internNameActive: { fontWeight: '600' },

  // Type chips
  typeRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  typeChip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: 5, borderWidth: 1, borderColor: colors.gray[300] },
  typeChipActive: { backgroundColor: colors.text, borderColor: colors.text },
  typeChipText: { fontSize: fontSize.sm, color: colors.textSecondary },
  typeChipTextActive: { color: colors.white, fontWeight: '600' },

  // Result chips
  resultRow: { flexDirection: 'row', gap: spacing.md, marginVertical: spacing.md },
  resultChip: { flex: 1, paddingVertical: 12, borderRadius: 5, borderWidth: 1, borderColor: colors.gray[300], alignItems: 'center' },
  passedChip: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  failedChip: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  resultChipText: { fontSize: fontSize.md, color: colors.textSecondary, fontWeight: '500' },
  resultChipTextActive: { color: '#ffffff' },
});
