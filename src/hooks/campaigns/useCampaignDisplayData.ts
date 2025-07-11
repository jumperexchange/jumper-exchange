import { useMemo } from 'react';
import { AppPaths } from 'src/const/urls';
import { CampaignData } from 'src/types/strapi';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';

export const useCampaignDisplayData = (campaign: CampaignData) => {
  const apiBaseUrl = getStrapiBaseUrl();
  return useMemo(() => {
    return {
      missionsCount: campaign.MissionCount || campaign.quests?.length || 0,
      slug: campaign.Slug || '',
      title: campaign.Title || '',
      isDefaultInfoCard: !!campaign.LightMode,
      benefitLabel: campaign.BenefitLabel,
      benefitValue: campaign.BenefitValue || 0,
      rewardChainIds: campaign.merkl_rewards
        ?.map((reward) => reward.ChainId)
        .filter((rewardChainId) => rewardChainId !== null),
      bannerImage: `${apiBaseUrl}${campaign.ProfileBannerImage?.url || ''}`,
      bannerTitle: campaign.ProfileBannerTitle || '',
      bannerDescription: campaign.ProfileBannerDescription || '',
      link:
        campaign.ProfileBannerCTA ||
        `${AppPaths.Campaign}/${campaign.Slug}` ||
        '',
    };
  }, [apiBaseUrl, campaign]);
};
