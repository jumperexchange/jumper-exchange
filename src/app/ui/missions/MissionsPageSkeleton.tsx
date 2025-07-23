'use client';

import { GridContainer } from 'src/components/Containers/GridContainer';
import { BannerCampaignSkeleton } from './BannerCampaign/BannerCampaignSkeleton';
import { MissionsListSkeleton } from './MissionsListSkeleton';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import {
  BaseSkeletonBox,
  MissionSectionContainer,
} from './MissionsSection.style';

export const MissionsPageSkeleton = () => {
  return (
    <>
      <BannerCampaignSkeleton />
      <SectionCard>
        <MissionSectionContainer>
          <BaseSkeletonBox
            variant="rounded"
            animation="wave"
            sx={{
              width: 136,
              height: 32,
            }}
          />
          <GridContainer>
            <MissionsListSkeleton count={5} />
          </GridContainer>
        </MissionSectionContainer>
      </SectionCard>
    </>
  );
};
