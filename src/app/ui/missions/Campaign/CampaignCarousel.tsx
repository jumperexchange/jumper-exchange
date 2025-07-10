'use client';

import Box from '@mui/material/Box';
import { FC } from 'react';
import { AnimatedPagination } from 'src/components/Carousel/AnimatedPagination';
import { Carousel } from 'src/components/Carousel/Carousel';
import { CampaignWithBanner } from 'src/components/ProfilePage';
import { CampaignData } from 'src/types/strapi';
import { Campaign } from './Campaign';
import { FloatingNavigation } from 'src/components/Carousel/FloatingNavigation';
import { CampaignCarouselContainer } from './Campaign.style';

interface CampaignCarouselProps {
  campaigns?: CampaignData[];
}

const isBannerCampaign = (
  campaign: CampaignData,
): campaign is CampaignWithBanner =>
  Boolean(
    campaign.ProfileBannerImage?.url &&
      campaign.ProfileBannerTitle &&
      campaign.ProfileBannerDescription &&
      campaign.ProfileBannerBadge &&
      campaign.Slug,
  );

export const CampaignCarousel: FC<CampaignCarouselProps> = ({ campaigns }) => {
  const validBannerCampaigns = campaigns?.filter(isBannerCampaign) || [];
  return (
    <CampaignCarouselContainer>
      <Box sx={{ position: 'relative', paddingX: 3 }}>
        <Carousel
          CarouselNavigation={FloatingNavigation}
          CarouselPagination={AnimatedPagination}
          autoplay={{
            delay: 5000,
          }}
          sx={{
            marginBottom: 1,
            '& .swiper': {
              marginTop: 0,
            },
          }}
        >
          {validBannerCampaigns.map((campaign, index) => (
            <Campaign
              key={`campaign-banner-${campaign.id}-${index}`}
              campaign={campaign}
            />
          ))}
        </Carousel>
      </Box>
    </CampaignCarouselContainer>
  );
};
