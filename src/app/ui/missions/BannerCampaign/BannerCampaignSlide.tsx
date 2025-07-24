'use client';

import { FC, useCallback } from 'react';
import { CampaignData } from 'src/types/strapi';
import { BannerCampaignContent } from './BannerCampaignContent';
import { useCampaignDisplayData } from 'src/hooks/campaigns/useCampaignDisplayData';
import { useRouter } from 'next/navigation';
import { MissionHeroStatsCard } from 'src/components/Cards/MissionHeroStatsCard/MissionHeroStatsCard';
import { ChainStack } from 'src/components/ChainStack/ChainStack';
import { useTranslation } from 'react-i18next';

interface BannerCampaignSlideProps {
  campaign: CampaignData;
}

export const BannerCampaignSlide: FC<BannerCampaignSlideProps> = ({
  campaign,
}) => {
  const router = useRouter();
  const {
    bannerImage,
    bannerTitle,
    title,
    benefitLabel,
    benefitValue,
    rewardChainIds,
    missionsCount,
    link,
    statsCardVariant,
  } = useCampaignDisplayData(campaign);

  const { t } = useTranslation();

  const onClickHandler = useCallback(() => {
    router.push(link);
  }, [router, link]);

  return (
    <BannerCampaignContent
      imageSrc={bannerImage}
      alt={`${bannerTitle || title} banner`}
      onClick={onClickHandler}
    >
      {!!benefitLabel && !!benefitValue && (
        <MissionHeroStatsCard
          title={benefitLabel ?? t('campaign.stats.totalRewards')}
          description={benefitValue}
          variant={statsCardVariant}
        />
      )}
      {!!missionsCount && (
        <MissionHeroStatsCard
          title={t('campaign.stats.missions')}
          description={missionsCount.toString()}
          variant={statsCardVariant}
        />
      )}
      {!!rewardChainIds?.length && (
        <MissionHeroStatsCard
          title={t('campaign.stats.rewards')}
          description={<ChainStack chainIds={rewardChainIds} />}
          variant={statsCardVariant}
        />
      )}
    </BannerCampaignContent>
  );
};
