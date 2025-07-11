import { CampaignWithBanner } from 'src/components/ProfilePage';
import { CampaignData } from 'src/types/strapi';

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
