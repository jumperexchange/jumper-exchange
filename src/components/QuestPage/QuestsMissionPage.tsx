import { TasksBox } from '@/components/QuestPage/TasksBox';
import { useAccount } from '@lifi/wallet-management';
import generateKey from 'src/app/lib/generateKey';
import { useMerklOpportunities } from 'src/hooks/useMerklOpportunities';
import { useMerklRewards } from 'src/hooks/useMerklRewards';
import { type Quest } from 'src/types/loyaltyPass';
import { BackButton } from './BackButton/BackButton';
import { BannerBox } from './Banner/Banner';
import { MissionCTA } from './CTA/MissionCTA';
import { DescriptionBox } from './DescriptionBox/DescriptionBox';
import { InformationAlertBox } from './InformationBox/InformationAlertBox';
import { QuestPageMainBox, QuestsContainer } from './QuestPage.style';
import { StepsBox } from './StepsBox/StepsBox';

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
  const attributes = quest;
  const missionType = quest?.CustomInformation?.['missionType'];
  const rewardType = attributes?.CustomInformation?.['rewardType'];
  const rewardRange = attributes?.CustomInformation?.['rewardRange'];
  const rewards = quest?.CustomInformation?.['rewards'];
  const rewardsIds = quest?.CustomInformation?.['rewardsIds'];
  const points = quest?.Points;
  const { account } = useAccount();
  const { pastCampaigns } = useMerklRewards({
    userAddress: account.address,
  });

  const { data } = useMerklOpportunities({ rewardsIds });
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
        {data?.length > 0 && (
          <MissionCTA
            id={quest.id}
            title={attributes?.Title}
            url={attributes?.Link}
            activeCampaign={activeCampaign}
            rewards={!!rewards}
            key={generateKey('cta')}
            CTAs={data}
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
        {Array.isArray(attributes?.tasks_verification) &&
        attributes?.tasks_verification?.length > 0 ? (
          <TasksBox
            tasks={attributes?.tasks_verification}
            documentId={quest.documentId}
          />
        ) : attributes?.Steps && attributes?.Steps?.length > 0 ? (
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
