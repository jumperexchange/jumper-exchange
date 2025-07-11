import { FC } from 'react';
import { CampaignData } from 'src/types/strapi';
import { useCampaignDisplayData } from './hooks';
import { Campaign } from './Campaign';
import { CampaignInfoCard } from './CampaignInfoCard';
import { ChainStack } from './ChainStack';

interface CampaignProps {
  campaign: CampaignData;
}

export const CampaignWrapper: FC<CampaignProps> = ({ campaign }) => {
  const {
    bannerImage,
    bannerTitle,
    title,
    benefitLabel,
    benefitValue,
    rewardChainIds,
    missionsCount,
  } = useCampaignDisplayData(campaign);

  return (
    <Campaign imageSrc={bannerImage} alt={`${bannerTitle || title} banner`}>
      {!!benefitLabel && !!benefitValue && (
        <CampaignInfoCard title={benefitLabel} description={benefitValue} />
      )}
      {!!missionsCount && (
        <CampaignInfoCard
          title={'Missions'}
          description={missionsCount.toString()}
        />
      )}
      {!!rewardChainIds?.length && (
        <CampaignInfoCard
          title={'Rewards'}
          description={<ChainStack chainIds={rewardChainIds} />}
        />
      )}
    </Campaign>
  );
};
