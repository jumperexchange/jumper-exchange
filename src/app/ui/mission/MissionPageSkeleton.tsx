'use client';

import { TwoColumnLayout } from 'src/components/TwoColumnLayout/TwoColumnLayout';
import { MissionDetailsSkeleton } from './MissionDetailsSkeleton';
import { MissionWidgetSkeleton } from './MissionWidget/MissionWidgetSkeleton';

export const MissionPageSkeleton = () => {
  return (
    <TwoColumnLayout
      mainContent={<MissionDetailsSkeleton />}
      sideContent={<MissionWidgetSkeleton />}
    />
  );
};
