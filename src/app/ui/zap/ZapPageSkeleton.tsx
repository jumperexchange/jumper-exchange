'use client';

import { TwoColumnLayout } from '@/components/TwoColumnLayout/TwoColumnLayout';
import { MissionDetailsSkeleton } from '@/app/ui/mission/MissionDetailsSkeleton';
import { WidgetSkeleton } from '@/components/Widgets/variants/base/WidgetSkeleton';

export const ZapPageSkeleton = () => {
  return (
    <TwoColumnLayout
      mainContent={<MissionDetailsSkeleton />}
      sideContent={<WidgetSkeleton />}
      shouldStretchSideContent
    />
  );
};
