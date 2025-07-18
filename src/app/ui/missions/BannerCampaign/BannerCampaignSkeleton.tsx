'use client';

import { CarouselOuterContainer } from './BannerCarousel.style';
import { ResponsiveBannerSkeleton } from './ResponsiveBannerSkeleton';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';

export const BannerCampaignSkeleton = () => {
  return (
    <SectionCard>
      <CarouselOuterContainer
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <ResponsiveBannerSkeleton />
      </CarouselOuterContainer>
    </SectionCard>
  );
};
