import { CampaignData, StrapiMediaData } from 'src/types/strapi';

export interface CampaignWithBanner extends CampaignData {
  ProfileBannerImage: StrapiMediaData;
  ProfileBannerTitle: string;
  ProfileBannerDescription: string;
  ProfileBannerBadge: string;
  ProfileBannerCTA?: string;
  Slug: string;
}

export const isBannerCampaign = (
  campaign: CampaignData,
): campaign is CampaignWithBanner =>
  Boolean(
    campaign.ProfileBannerImage?.url &&
      campaign.ProfileBannerTitle &&
      campaign.ProfileBannerDescription &&
      campaign.ProfileBannerBadge &&
      campaign.Slug,
  );
