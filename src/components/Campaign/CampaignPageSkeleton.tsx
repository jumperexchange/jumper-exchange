'use client';

import { PageContainer } from '../Containers/PageContainer';
import { CampaignHeroSkeleton } from './CampaignHero/CampaignHeroSkeleton';
import { MissionsSectionSkeleton } from './MissionsSection/MissionsSectionSkeleton';

export const CampaignPageSkeleton = () => {
  return (
    <PageContainer>
      <CampaignHeroSkeleton />
      <MissionsSectionSkeleton />
    </PageContainer>
  );
};
