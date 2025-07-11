'use client';

import { FC } from 'react';
import { CampaignWithBanner } from 'src/components/ProfilePage';
import { CampaignData } from 'src/types/strapi';
import { CampaignWrapper } from './CampaignWrapper';
import { CampaignCarousel } from './CampaignCarousel';

interface CampaignCarouselWrapperProps {
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

export const CampaignCarouselWrapper: FC<CampaignCarouselWrapperProps> = ({
  campaigns,
}) => {
  const validBannerCampaigns = campaigns?.filter(isBannerCampaign) || [];
  return (
    <CampaignCarousel>
      {validBannerCampaigns.map((campaign, index) => (
        <CampaignWrapper
          key={`campaign-banner-${campaign.id}-${index}`}
          campaign={campaign}
        />
      ))}
    </CampaignCarousel>
  );
};
