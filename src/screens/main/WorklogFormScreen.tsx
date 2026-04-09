import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Button, Input } from '../../components/ui';
import { createWorklog } from '../../api/worklogs';
import { colors, spacing } from '../../lib/theme';

export function WorklogFormScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [weekNumber, setWeekNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tasksCompleted, setTasksCompleted] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [challenges, setChallenges] = useState('');
  const [reflections, setReflections] = useState('');

  const handleSubmit = async () => {
    if (!weekNumber || !startDate || !endDate || !tasksCompleted) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }
    setLoading(true);
    try {
      await createWorklog({
        internship_id: 1,
        week_number: parseInt(weekNumber),
        start_date: startDate,
        end_date: endDate,
        tasks_completed: tasksCompleted,
        hours_worked: parseFloat(hoursWorked) || 0,
        challenges: challenges || null,
        reflections: reflections || null,
      });
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to create worklog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
      <Input label={`${t('worklogs.weekNum')} *`} value={weekNumber} onChangeText={setWeekNumber} keyboardType="number-pad" />
      <Input label={`${t('worklogs.startDate')} *`} value={startDate} onChangeText={setStartDate} placeholder="YYYY-MM-DD" />
      <Input label={`${t('worklogs.endDate')} *`} value={endDate} onChangeText={setEndDate} placeholder="YYYY-MM-DD" />
      <Input label="Tasks Completed *" value={tasksCompleted} onChangeText={setTasksCompleted} multiline numberOfLines={4} style={{ height: 100, textAlignVertical: 'top' }} />
      <Input label={t('worklogs.hours')} value={hoursWorked} onChangeText={setHoursWorked} keyboardType="decimal-pad" />
      <Input label="Challenges" value={challenges} onChangeText={setChallenges} multiline numberOfLines={3} style={{ height: 80, textAlignVertical: 'top' }} />
      <Input label="Reflections" value={reflections} onChangeText={setReflections} multiline numberOfLines={3} style={{ height: 80, textAlignVertical: 'top' }} />
      <Button title={t('worklogs.createWorklog')} onPress={handleSubmit} loading={loading} />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, padding: spacing.xxl },
});
