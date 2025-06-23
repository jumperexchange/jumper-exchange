import { TasksBox } from '@/components/QuestPage/TasksBox';
import { useAccount } from '@lifi/wallet-management';
import generateKey from 'src/app/lib/generateKey';
import { MerklOpportunity } from 'src/app/lib/getMerklOpportunities';
import { useMerklRewards } from 'src/hooks/useMerklRewards';
import { TaskVerificationWithApy, type Quest } from 'src/types/loyaltyPass';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import { BackButton } from './BackButton/BackButton';
import { BannerBox } from './Banner/Banner';
import { MissionCTA } from './CTA/MissionCTA';
import { DescriptionBox } from './DescriptionBox/DescriptionBox';
import { InformationAlertBox } from './InformationBox/InformationAlertBox';
import { QuestPageMainBox, QuestsContainer } from './QuestPage.style';
import { StepsBox } from './StepsBox/StepsBox';

interface QuestsMissionPageVar {
  quest: Quest;
  activeCampaign?: string;
  path: string;
  merklOpportunities?: MerklOpportunity[];
  tasksVerification?: TaskVerificationWithApy[];
}

export const QuestsMissionPage = ({
  quest,
  activeCampaign,
  path,
  merklOpportunities = [],
  tasksVerification = [],
}: QuestsMissionPageVar) => {
  const baseUrl = getStrapiBaseUrl();
  const attributes = quest;
  const missionType = quest?.CustomInformation?.['missionType'];
  const rewardType = attributes?.CustomInformation?.['rewardType'];
  const rewardRange = attributes?.CustomInformation?.['rewardRange'];
  const rewards = quest?.CustomInformation?.['rewards'];
  const points = quest?.Points;
  const { account } = useAccount();
  const { pastCampaigns } = useMerklRewards({
    userAddress: account?.address,
  });

  return (
    <QuestsContainer>
      <QuestPageMainBox>
        <BackButton path={path} title={activeCampaign} />
        {/* big component with the main information */}
        <BannerBox quest={quest} pastCampaigns={pastCampaigns} />
        {/* Big CTA */}
        {merklOpportunities.length > 0 && (
          <MissionCTA
            id={quest.id}
            title={attributes?.Title}
            activeCampaign={activeCampaign}
            rewards={!!rewards}
            key={generateKey('cta')}
            CTAs={merklOpportunities}
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
        {Array.isArray(tasksVerification) && tasksVerification?.length > 0 ? (
          <TasksBox tasks={tasksVerification} documentId={quest.documentId} />
        ) : attributes?.Steps && attributes?.Steps?.length > 0 ? (
          <StepsBox steps={attributes?.Steps} />
        ) : undefined}
        {/* Additional Info */}
        {attributes?.Information && (
          <InformationAlertBox information={attributes?.Information} />
        )}
      </QuestPageMainBox>
    </QuestsContainer>
  );
};
