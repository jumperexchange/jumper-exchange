'use client';

import { TwoColumnLayout } from 'src/components/TwoColumnLayout/TwoColumnLayout';
import { MissionDetailsSkeleton } from './MissionDetailsSkeleton';
// import { WidgetSkeleton } from 'src/components/Widgets/variants/base/WidgetSkeleton';

export const MissionPageSkeleton = () => {
  return (
    <TwoColumnLayout
      mainContent={<MissionDetailsSkeleton />}
      sideContent={null}
      // @TODO enable once widget is in
      // sideContent={<WidgetSkeleton />}
    />
  );
};
