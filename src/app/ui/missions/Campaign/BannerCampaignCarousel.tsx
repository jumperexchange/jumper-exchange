'use client';

import { FC } from 'react';
import { CampaignData } from 'src/types/strapi';
import { BannerCampaignSlide } from './BannerCampaignSlide';
import { CarouselShell } from './CarouselShell';

interface BannerCampaignCarouselProps {
  campaigns: CampaignData[];
}

export const BannerCampaignCarousel: FC<BannerCampaignCarouselProps> = ({
  campaigns,
}) => {
  if (campaigns.length === 0) return null;

  return (
    <CarouselShell>
      {campaigns.map((campaign, index) => (
        <BannerCampaignSlide
          key={`campaign-${campaign.id}-${index}`}
          campaign={campaign}
        />
      ))}
    </CarouselShell>
  );
};
