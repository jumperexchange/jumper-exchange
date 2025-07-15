'use client';
import { BannerCampaignSkeleton } from './BannerCampaign/BannerCampaignSkeleton';
import { MissionsListSkeleton } from './MissionsListSkeleton';
import { MissionsPageContainer } from './MissionsPageContainer';
import { MissionsPageContentContainer } from './MissionsPageContentContainer';

export const MissionsPageSkeleton = () => {
  return (
    <MissionsPageContainer>
      <BannerCampaignSkeleton />
      <MissionsPageContentContainer>
        <MissionsListSkeleton count={5} />
      </MissionsPageContentContainer>
    </MissionsPageContainer>
  );
};
