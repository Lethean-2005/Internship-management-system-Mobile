import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Modal, Pressable, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, Badge, LoadingSpinner, EmptyState, Button, GradientBackground } from '../../components/ui';
import { getLeaves, reviewLeave, deleteLeave } from '../../api/internLeaves';
import { useAuthStore } from '../../stores/authStore';
import { colors, fontSize, spacing } from '../../lib/theme';
import { IconCheck, IconX, IconTrash } from '@tabler/icons-react-native';
import type { InternLeave } from '../../types/ims';

export function LeavesScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const userRole = user?.role?.slug;
  const canReview = userRole === 'admin' || userRole === 'tutor';

  const [leaves, setLeaves] = useState<InternLeave[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Review modal
  const [reviewTarget, setReviewTarget] = useState<InternLeave | null>(null);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected'>('approved');
  const [reviewNote, setReviewNote] = useState('');
  const [reviewing, setReviewing] = useState(false);

  const fetch = async () => {
    try { const res = await getLeaves(); setLeaves(res.data); } catch {}
    setLoading(false); setRefreshing(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleReview = async () => {
    if (!reviewTarget) return;
    setReviewing(true);
    try {
      await reviewLeave(reviewTarget.id, { status: reviewAction, review_note: reviewNote || null });
      setReviewTarget(null);
      setReviewNote('');
      fetch();
    } catch {}
    setReviewing(false);
  };

  const handleDelete = (leave: InternLeave) => {
    setReviewTarget(null);
    // Use a simple confirm approach
    deleteLeave(leave.id).then(() => fetch()).catch(() => {});
  };

  if (loading) return <LoadingSpinner />;

  return (
    <GradientBackground>
      <View style={styles.container}>
      <FlatList
        data={leaves}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetch(); }} />}
        ListEmptyComponent={<EmptyState title={t('leaves.noLeaveRequests')} icon="airplane-outline" />}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.type}>{item.type.replace('_', ' ')}</Text>
              <Badge status={item.status} />
            </View>
            {item.user && <Text style={styles.userName}>{item.user.name}</Text>}
            <Text style={styles.date}>{item.start_date}  →  {item.end_date}</Text>
            <Text style={styles.reason} numberOfLines={2}>{item.reason}</Text>

            {item.reviewer && (
              <Text style={styles.reviewInfo}>
                {t('leaves.reviewedBy')}: {item.reviewer.name}
              </Text>
            )}
            {item.review_note && (
              <Text style={styles.reviewNote}>{t('leaves.note')}: {item.review_note}</Text>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              {canReview && item.status === 'pending' && (
                <>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.approveBtn]}
                    onPress={() => { setReviewTarget(item); setReviewAction('approved'); }}
                  >
                    <IconCheck size={14} color="#ffffff" strokeWidth={2.5} />
                    <Text style={styles.actionBtnText}>{t('leaves.approve')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.rejectBtn]}
                    onPress={() => { setReviewTarget(item); setReviewAction('rejected'); }}
                  >
                    <IconX size={14} color="#ffffff" strokeWidth={2.5} />
                    <Text style={styles.actionBtnText}>{t('leaves.reject')}</Text>
                  </TouchableOpacity>
                </>
              )}
              {(item.status === 'pending' && (item.user_id === user?.id || canReview)) && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => handleDelete(item)}
                >
                  <IconTrash size={14} color={colors.danger} strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>
          </Card>
        )}
      />

      {/* Review Modal */}
      <Modal visible={!!reviewTarget} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setReviewTarget(null)}>
          <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.dialogTitle}>
              {reviewAction === 'approved' ? t('leaves.approveLeave') : t('leaves.rejectLeave')}
            </Text>
            {reviewTarget?.user && (
              <Text style={styles.dialogSub}>
                {reviewAction === 'approved' ? t('leaves.approveFor') : t('leaves.rejectFor')} {reviewTarget.user.name}
              </Text>
            )}
            <Text style={styles.dialogLabel}>{t('leaves.noteOptional')}</Text>
            <TextInput
              style={styles.dialogInput}
              placeholder={t('leaves.addNote')}
              value={reviewNote}
              onChangeText={setReviewNote}
              multiline
              numberOfLines={3}
              placeholderTextColor={colors.gray[400]}
            />
            <View style={styles.dialogButtons}>
              <TouchableOpacity style={styles.dialogBtn} onPress={() => setReviewTarget(null)}>
                <Text style={styles.dialogCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogBtn, reviewAction === 'approved' ? styles.dialogApprove : styles.dialogReject]}
                onPress={handleReview}
                disabled={reviewing}
              >
                <Text style={styles.dialogConfirmText}>
                  {reviewing ? '...' : reviewAction === 'approved' ? t('leaves.approve') : t('leaves.reject')}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  list: { padding: spacing.lg },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  type: { fontSize: fontSize.md, fontWeight: '600', color: colors.text, textTransform: 'capitalize' },
  userName: { fontSize: fontSize.sm, color: colors.accent, marginTop: 2 },
  date: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
  reason: { fontSize: fontSize.sm, color: colors.gray[600], marginTop: spacing.xs },
  reviewInfo: { fontSize: fontSize.xs, color: colors.gray[500], marginTop: spacing.sm },
  reviewNote: { fontSize: fontSize.xs, color: colors.gray[500], marginTop: 2, fontStyle: 'italic' },

  // Actions
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5,
  },
  actionBtnText: { fontSize: fontSize.xs, color: '#ffffff', fontWeight: '600' },
  approveBtn: { backgroundColor: '#22c55e' },
  rejectBtn: { backgroundColor: '#ef4444' },
  deleteBtn: { backgroundColor: colors.gray[100], paddingHorizontal: 8 },

  // Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  dialog: { backgroundColor: colors.white, borderRadius: 5, width: 300, padding: spacing.xl },
  dialogTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text },
  dialogSub: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4 },
  dialogLabel: { fontSize: fontSize.sm, color: colors.gray[600], marginTop: spacing.lg, marginBottom: spacing.xs },
  dialogInput: {
    borderWidth: 1, borderColor: colors.gray[300], borderRadius: 5,
    padding: spacing.md, fontSize: fontSize.sm, color: colors.text,
    minHeight: 80, textAlignVertical: 'top',
  },
  dialogButtons: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  dialogBtn: { flex: 1, paddingVertical: 10, borderRadius: 5, alignItems: 'center' },
  dialogCancelText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '500' },
  dialogApprove: { backgroundColor: '#22c55e' },
  dialogReject: { backgroundColor: '#ef4444' },
  dialogConfirmText: { fontSize: fontSize.sm, color: '#ffffff', fontWeight: '600' },
});
