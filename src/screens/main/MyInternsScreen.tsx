import React from 'react';
import { EmptyState, GradientBackground } from '../../components/ui';

export function MyInternsScreen() {
  return (
    <GradientBackground>
      <EmptyState title="My Interns" subtitle="Interns assigned to you will appear here." icon="people-outline" />
    </GradientBackground>
  );
}
