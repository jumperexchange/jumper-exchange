'use client';

import { FC, useCallback } from 'react';
import { CampaignData } from 'src/types/strapi';
import { BannerCampaignContent } from './BannerCampaignContent';
import { useCampaignDisplayData } from 'src/hooks/campaigns/useCampaignDisplayData';
import { InfoCard } from './InfoCard';
import { ChainStack } from './ChainStack';
import { useRouter } from 'next/navigation';

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
        <InfoCard title={benefitLabel} description={benefitValue} />
      )}
      {!!missionsCount && (
        <InfoCard title={'Missions'} description={missionsCount.toString()} />
      )}
      {!!rewardChainIds?.length && (
        <InfoCard
          title={'Rewards'}
          description={<ChainStack chainIds={rewardChainIds} />}
        />
      )}
    </BannerCampaignContent>
  );
};
