import { useAccounts } from '@/hooks/useAccounts';
import generateKey from 'src/app/lib/generateKey';
import { useMerklRewards } from 'src/hooks/useMerklRewardsOnSpecificToken';
import { useMissionsAPY } from 'src/hooks/useMissionsAPY';
import { useTurtleMember } from 'src/hooks/useTurtleMember';
import { type Quest } from 'src/types/loyaltyPass';
import { QuestsContainer } from '../Quests.style';
import { BackButton } from './BackButton/BackButton';
import { BannerBox } from './Banner/Banner';
import { MissionCTA } from './CTA/MissionCTA';
import { DescriptionBoxSF } from './DescriptionBoxSF/DescriptionBoxSF';
import { InformationAlertBox } from './InformationBox/InformationAlertBox';
import { StepsBox } from './StepsBox/StepsBox';
import { SuperfestPageMainBox } from './SuperfestMissionPage.style';

interface SuperfestMissionPageVar {
  quest: Quest;
  baseUrl: string;
}

export const SuperfestMissionPage = ({
  quest,
  baseUrl,
}: SuperfestMissionPageVar) => {
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
  const {
    isMember,
    isJumperMember,
    isSuccess: isMemberCheckSuccess,
  } = useTurtleMember({
    userAddress: account?.address,
  });
  const { CTAsWithAPYs } = useMissionsAPY(CTAs);

  return (
    <QuestsContainer className="quests">
      <SuperfestPageMainBox>
        {/* button to go back */}
        <BackButton title="Discover" />
        {/* big component with the main information */}
        <BannerBox
          quest={quest}
          baseUrl={baseUrl}
          pastCampaigns={pastCampaigns}
          isRewardCompleted={
            missionType === 'turtle_signature' &&
            isMemberCheckSuccess &&
            isMember &&
            isJumperMember
          }
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
          isTurtleMember={isMember}
          rewardRange={rewardRange}
        />
        {/* Subtitle and description */}
        <DescriptionBoxSF
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
    </QuestsContainer>
  );
};
