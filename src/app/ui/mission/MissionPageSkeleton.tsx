'use client';

import { MissionDetailsSkeleton } from './MissionDetailsSkeleton';
import { MissionPageLayout } from './MissionPageLayout';
import { MissionWidgetSkeleton } from './MissionWidget/MissionWidgetSkeleton';

export const MissionPageSkeleton = () => {
  return (
    <MissionPageLayout
      leftColumn={<MissionDetailsSkeleton />}
      rightColumn={<MissionWidgetSkeleton />}
    />
  );
};
