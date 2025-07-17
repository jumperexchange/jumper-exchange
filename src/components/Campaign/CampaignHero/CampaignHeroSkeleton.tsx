'use client';

import Box from '@mui/material/Box';
import { BaseSkeletonBox, CampaignHeroContainer } from './CampaignHero.style';
import { CampaignHeroCardSkeleton } from './CampaignHeroCardSkeletion';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';

export const CampaignHeroSkeleton = () => {
  return (
    <SectionCardContainer>
      <CampaignHeroContainer>
        <Box sx={{ width: '100%' }}>
          <BaseSkeletonBox
            animation="wave"
            variant="rounded"
            sx={{ width: 120, height: 36 }}
          />
        </Box>
        <Box sx={{ width: '100%' }}>
          <CampaignHeroCardSkeleton />
        </Box>
      </CampaignHeroContainer>
    </SectionCardContainer>
  );
};
