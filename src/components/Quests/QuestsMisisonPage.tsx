import { useAccounts } from '@/hooks/useAccounts';
import generateKey from 'src/app/lib/generateKey';
import { JUMPER_QUESTS_PATH } from 'src/const/urls';
import { useMerklRewards } from 'src/hooks/useMerklRewardsOnSpecificToken';
import { useMissionsAPY } from 'src/hooks/useMissionsAPY';
import { type Quest } from 'src/types/loyaltyPass';
import { SuperfestContainer } from '../Superfest/Superfest.style';
import { BackButton } from '../Superfest/SuperfestPage/BackButton/BackButton';
import { BannerBox } from '../Superfest/SuperfestPage/Banner/Banner';
import { MissionCTA } from '../Superfest/SuperfestPage/CTA/MissionCTA';
import { DescriptionBox } from '../Superfest/SuperfestPage/DescriptionBox/DescriptionBox';
import { InformationAlertBox } from '../Superfest/SuperfestPage/InformationBox/InformationAlertBox';
import { StepsBox } from '../Superfest/SuperfestPage/StepsBox/StepsBox';
import { SuperfestPageMainBox } from '../Superfest/SuperfestPage/SuperfestMissionPage.style';

interface QuestsMissionPageVar {
  quest: Quest;
  baseUrl: string;
  activeCampaign?: string;
}

export const QuestsMissionPage = ({
  quest,
  baseUrl,
  activeCampaign,
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

  return (
    <SuperfestContainer>
      <SuperfestPageMainBox>
        {/* button to go back */}
        <BackButton title={'Quests'} path={JUMPER_QUESTS_PATH} />
        {/* big component with the main information */}
        <BannerBox
          quest={quest}
          baseUrl={baseUrl}
          pastCampaigns={pastCampaigns}
        />
        {/* Big CTA */}
        <MissionCTA
          title={attributes?.Title}
          url={attributes?.Link}
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
      </SuperfestPageMainBox>
    </SuperfestContainer>
  );
};
