'use client';

import { FC, useCallback } from 'react';
import { CampaignData } from 'src/types/strapi';
import { BannerCampaignContent } from './BannerCampaignContent';
import { useCampaignDisplayData } from 'src/hooks/campaigns/useCampaignDisplayData';
import { useRouter } from 'next/navigation';
import { MissionHeroStatsCard } from 'src/components/Cards/MissionHeroStatsCard/MissionHeroStatsCard';
import { ChainStack } from 'src/components/ChainStack/ChainStack';

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
  } = useCampaignDisplayData(campaign);

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
        <MissionHeroStatsCard title={benefitLabel} description={benefitValue} />
      )}
      {!!missionsCount && (
        <MissionHeroStatsCard
          title={'Missions'}
          description={missionsCount.toString()}
        />
      )}
      {!!rewardChainIds?.length && (
        <MissionHeroStatsCard
          title={'Rewards'}
          description={<ChainStack chainIds={rewardChainIds} />}
        />
      )}
    </BannerCampaignContent>
  );
};
