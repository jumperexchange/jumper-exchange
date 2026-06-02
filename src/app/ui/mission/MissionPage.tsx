import type { FC } from 'react';
import { notFound } from 'next/navigation';

import { getQuestBySlug } from 'src/app/lib/getQuestBySlug';
import { MissionDetails } from './MissionDetails';
import { MissionWidget } from './MissionWidget/MissionWidget';
import { TwoColumnLayout } from 'src/components/TwoColumnLayout/TwoColumnLayout';
import { MissionPageTracking } from '@/components/headless/tracking/MissionPageTracking';

interface MissionPageProps {
  slug: string;
}

export const MissionPage: FC<MissionPageProps> = async ({ slug }) => {
  const { data } = await getQuestBySlug(slug);
  if (!data) {
    return notFound();
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
