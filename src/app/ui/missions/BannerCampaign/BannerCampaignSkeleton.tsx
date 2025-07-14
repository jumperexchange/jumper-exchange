'use client';

import Box from '@mui/material/Box';
import { CarouselOuterContainer } from './BannerCarousel.style';
import { ResponsiveBannerSkeleton } from './ResponsiveBannerSkeleton';

export const BannerCampaignSkeleton = () => {
  return (
    <CarouselOuterContainer>
      <Box
        sx={{
          position: 'relative',
          paddingX: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <ResponsiveBannerSkeleton />
      </Box>
    </CarouselOuterContainer>
  );
};
