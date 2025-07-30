import { useMemo } from 'react';
import { MissionHeroStatsCardVariant } from 'src/components/Cards/MissionHeroStatsCard/MissionHeroStatsCard.style';
import { AppPaths } from 'src/const/urls';
import { BenefitCardColorMode, CampaignData } from 'src/types/strapi';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';

export const useCampaignDisplayData = (campaign: CampaignData) => {
  return useMemo(() => {
    const apiBaseUrl = getStrapiBaseUrl();

    const getStatsCardVariant = (colorMode?: BenefitCardColorMode) =>
      colorMode === BenefitCardColorMode.Dark
        ? MissionHeroStatsCardVariant.Inverted
        : MissionHeroStatsCardVariant.Default;

    return {
      missionsCount: campaign.MissionCount || campaign.quests?.length || 0,
      slug: campaign.Slug || '',
      title: campaign.Title || '',
      description: campaign.Description || '',
      benefitLabel: campaign.BenefitLabel,
      benefitValue: campaign.BenefitValue || 0,
      rewardChainIds: campaign.merkl_rewards
        ?.map((reward) => reward.ChainId)
        .filter((rewardChainId) => rewardChainId !== null),
      background: `${apiBaseUrl}${campaign.Background?.url || ''}`,
      icon: `${apiBaseUrl}${campaign.Icon?.url || ''}`,
      bannerImage: `${apiBaseUrl}${campaign.ProfileBannerImage?.url || ''}`,
      bannerTitle: campaign.ProfileBannerTitle || '',
      bannerDescription: campaign.ProfileBannerDescription || '',
      link:
        campaign.ProfileBannerCTA ||
        `${AppPaths.Campaign}/${campaign.Slug}` ||
        '',
      bannerStatsCardVariant: getStatsCardVariant(
        campaign.CarouselBenefitCardColorMode,
      ),
      heroStatsCardVariant: getStatsCardVariant(
        campaign.HeroBenefitCardColorMode,
      ),
    };
  }, [campaign]);
};
