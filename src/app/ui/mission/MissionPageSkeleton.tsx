'use client';

import { MissionDetailsSkeleton } from './MissionDetailsSkeleton';
import { MissionPageLayout } from './MissionPageLayout';
import { MissionWidgetSkeleton } from './MissionWidgetSkeleton';

export const MissionPageSkeleton = () => {
  return (
    <MissionPageLayout
      leftColumn={<MissionDetailsSkeleton />}
      rightColumn={<MissionWidgetSkeleton />}
    />
  );
};
