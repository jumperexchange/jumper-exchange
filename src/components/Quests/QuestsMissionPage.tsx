import { useAccounts } from '@/hooks/useAccounts';
import generateKey from 'src/app/lib/generateKey';
import { useMerklRewards } from 'src/hooks/useMerklRewardsOnSpecificToken';
import { useMissionsAPY } from 'src/hooks/useMissionsAPY';
import { type Quest } from 'src/types/loyaltyPass';
import { QuestPageMainBox, QuestsContainer } from './QuestPage.style';
import { BackButton } from './QuestPage/BackButton/BackButton';
import { BannerBox } from './QuestPage/Banner/Banner';
import { MissionCTA } from './QuestPage/CTA/MissionCTA';
import { DescriptionBox } from './QuestPage/DescriptionBox/DescriptionBox';
import { InformationAlertBox } from './QuestPage/InformationBox/InformationAlertBox';
import { StepsBox } from './QuestPage/StepsBox/StepsBox';

interface QuestsMissionPageVar {
  quest: Quest;
  baseUrl: string;
  platform?: string;
  path: string;
}

export const QuestsMissionPage = ({
  quest,
  baseUrl,
  platform,
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
  const { pastCampaigns } = useMerklRewards({
    rewardChainId: 10,
    userAddress: account?.address,
  });
  const { CTAsWithAPYs } = useMissionsAPY(CTAs);
  console.log('PATH', path);
  return (
    <QuestsContainer>
      <QuestPageMainBox>
        {/* button to go back */}
        <BackButton path={path} title={platform} />
        {/* big component with the main information */}
        <BannerBox
          quest={quest}
          baseUrl={baseUrl}
          pastCampaigns={pastCampaigns}
          // rotatingBadge={
          //   rewardType === 'weekly' ? (
          //     <SuperfestWeeklyRewards />
          //   ) : (
          //     <SuperfestDailyRewards />
          //   )
          // }
        />
        {/* Big CTA */}
        <MissionCTA
          title={attributes?.Title}
          url={attributes?.Link}
          platform={platform}
          rewards={rewards}
          key={generateKey('cta')}
          CTAs={CTAsWithAPYs}
          variableWeeklyAPY={points > 0 && rewardType === 'weekly'}
          signature={missionType === 'turtle_signature'}
          rewardRange={rewardRange}
        />
        {/* Subtitle and description */}
        <DescriptionBox
          longTitle={attributes?.Subtitle}
          description={attributes?.Description}
        />
        {/* Steps */}
        {/* Todo: remove the check for steps */}
        {attributes?.Steps && attributes?.Steps?.length > 1 ? (
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
