import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, Badge, LoadingSpinner, EmptyState, GradientBackground } from '../../components/ui';
import { getSlides } from '../../api/slides';
import { colors, fontSize, spacing } from '../../lib/theme';
import type { FinalSlide } from '../../types/ims';

export function SlidesScreen() {
  const { t } = useTranslation();
  const [slides, setSlides] = useState<FinalSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = async () => {
    try { const res = await getSlides(); setSlides(res.data); } catch {}
    setLoading(false); setRefreshing(false);
  };

  useEffect(() => { fetch(); }, []);
  if (loading) return <LoadingSpinner />;

  return (
    <GradientBackground>
      <FlatList
        data={slides}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetch(); }} />}
        ListEmptyComponent={<EmptyState title={t('slides.noSlidesFound')} icon="easel-outline" />}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <Badge status={item.status} />
            </View>
            {item.presentation_date && <Text style={styles.date}>{item.presentation_date}</Text>}
          </Card>
        )}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  list: { padding: spacing.lg },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: fontSize.md, fontWeight: '600', color: colors.text, flex: 1, marginRight: spacing.sm },
  date: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
});
