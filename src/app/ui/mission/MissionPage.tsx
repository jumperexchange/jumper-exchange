'use client';

import type { FC } from 'react';
import { MissionDetails } from './MissionDetails';
import { MissionWidget } from './MissionWidget/MissionWidget';
import { MissionPageSkeleton } from './MissionPageSkeleton';
import { TwoColumnLayout } from 'src/components/TwoColumnLayout/TwoColumnLayout';
import { MissionPageTracking } from '@/components/headless/tracking/MissionPageTracking';
import { useQuestBySlug } from 'src/hooks/quests/useQuestBySlug';

interface MissionPageProps {
  slug: string;
}

export const MissionPage: FC<MissionPageProps> = ({ slug }) => {
  const { data, isPending } = useQuestBySlug(slug);

  if (isPending || !data) {
    return <MissionPageSkeleton />;
  }

  return (
    <>
      <TwoColumnLayout
        mainContent={<MissionDetails mission={data} />}
        sideContent={
          <MissionWidget customInformation={data.CustomInformation} />
        }
        shouldStretchSideContent
      />
      <MissionPageTracking slug={slug} />
    </>
  );
};
