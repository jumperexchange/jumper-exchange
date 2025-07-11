'use client';
import { CampaignCarouselSkeleton } from './Campaign/CampaignCarouselSkeleton';
import { MissionsListSkeleton } from './MissionsListSkeleton';
import { MissionsPageContainer } from './MissionsPageContainer';
import { MissionsPageContentContainer } from './MissionsPageContentContainer';

export const MissionsPageSkeleton = () => {
  return (
    <MissionsPageContainer>
      <CampaignCarouselSkeleton />
      <MissionsPageContentContainer>
        <MissionsListSkeleton count={5} />
      </MissionsPageContentContainer>
    </MissionsPageContainer>
  );
};
