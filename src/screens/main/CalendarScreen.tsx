import React from 'react';
import { EmptyState, GradientBackground } from '../../components/ui';

export function CalendarScreen() {
  return (
    <GradientBackground>
      <EmptyState title="Calendar" subtitle="Your events, deadlines, and schedules." icon="calendar-outline" />
    </GradientBackground>
  );
}
