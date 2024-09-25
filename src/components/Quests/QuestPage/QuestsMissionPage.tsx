import { useAccounts } from '@/hooks/useAccounts';
import generateKey from 'src/app/lib/generateKey';
import { useMissionsAPY } from 'src/hooks/useMissionsAPY';
import { type Quest } from 'src/types/loyaltyPass';
import { QuestPageMainBox, QuestsContainer } from '../Quests.style';
import { BackButton } from './BackButton/BackButton';
import { BannerBox } from './Banner/Banner';
import { MissionCTA } from './CTA/MissionCTA';
import { DescriptionBox } from './DescriptionBox/DescriptionBox';
import { InformationAlertBox } from './InformationBox/InformationAlertBox';
import { StepsBox } from './StepsBox/StepsBox';
import { useMerklRewardsOnCampaigns } from 'src/hooks/useMerklRewardsOnCampaigns';

interface QuestsMissionPageVar {
  quest: Quest;
  baseUrl: string;
  activeCampaign?: string;
  path: string;
}

export const QuestsMissionPage = ({
  quest,
  baseUrl,
  activeCampaign,
  path,
}: QuestsMissionPageVar) => {
  const attributes = quest?.attributes;
  const CTAs = quest?.attributes?.CustomInformation?.['CTA'];
  const missionType = quest?.attributes?.CustomInformation?.['missionType'];
  const rewardType = attributes?.CustomInformation?.['rewardType'];
  const rewardRange = attributes?.CustomInformation?.['rewardRange'];
  const rewards = quest.attributes.CustomInformation?.['rewards'];
  const points = quest?.attributes?.Points;

  const { account } = useAccounts();
  const { pastCampaigns } = useMerklRewardsOnCampaigns({
    userAddress: account?.address,
  });
  const { CTAsWithAPYs } = useMissionsAPY(CTAs);

  return (
    <QuestsContainer>
      <QuestPageMainBox>
        <BackButton path={path} title={activeCampaign} />
        {/* big component with the main information */}
        <BannerBox
          quest={quest}
          baseUrl={baseUrl}
          pastCampaigns={pastCampaigns}
        />
        {/* Big CTA */}
        {CTAsWithAPYs?.length > 0 && (
          <MissionCTA
            id={quest.id}
            title={attributes?.Title}
            url={attributes?.Link}
            activeCampaign={activeCampaign}
            rewards={rewards}
            key={generateKey('cta')}
            CTAs={CTAsWithAPYs}
            variableWeeklyAPY={points > 0 && rewardType === 'weekly'}
            signature={missionType === 'turtle_signature'}
            rewardRange={rewardRange}
          />
        )}
        {/* Subtitle and description */}
        {attributes?.Subtitle && (
          <DescriptionBox
            longTitle={attributes?.Subtitle}
            description={attributes?.Description}
          />
        )}
        {/* Steps */}
        {attributes?.Steps && attributes?.Steps?.length > 0 ? (
          <StepsBox steps={attributes?.Steps} baseUrl={baseUrl} />
        ) : undefined}
        {/* Additional Info */}
        {attributes?.Information && (
          <InformationAlertBox information={attributes?.Information} />
        )}
      </QuestPageMainBox>
    </QuestsContainer>
  );
};
