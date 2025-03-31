import { useAccount } from '@lifi/wallet-management';
import { notFound } from 'next/navigation';
import generateKey from 'src/app/lib/generateKey';
import { useMerklRewardsOnSpecificToken } from 'src/hooks/useMerklRewardsOnSpecificToken';
import { useMissionsAPY } from 'src/hooks/useMissionsAPY';
import { useTurtleMember } from 'src/hooks/useTurtleMember';
import { type Quest } from 'src/types/loyaltyPass';
import { SuperfestContainer } from '../Superfest.style';
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
  const attributes = quest;
  const CTAs = quest?.CustomInformation?.['CTA'];
  const missionType = quest?.CustomInformation?.['missionType'];
  const rewardType = attributes?.CustomInformation?.['rewardType'];
  const rewardRange = attributes?.CustomInformation?.['rewardRange'];
  const rewards = quest?.CustomInformation?.['rewards'];
  const points = quest?.Points;

  const { account } = useAccount();
  const { pastCampaigns } = useMerklRewardsOnSpecificToken({
    rewardChainId: 10,
    userAddress: account?.address,
    rewardToken: '0x4200000000000000000000000000000000000042', // OP
  });
  const {
    isMember,
    isJumperMember,
    isSuccess: isMemberCheckSuccess,
  } = useTurtleMember({
    userAddress: account?.address,
  });
  const { CTAsWithAPYs } = useMissionsAPY(CTAs);

  if (!quest) {
    return notFound();
  }

  return (
    <SuperfestContainer className="superfest">
      <SuperfestPageMainBox>
        {/* button to go back */}
        <BackButton />
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
        {CTAsWithAPYs?.length > 0 && (
          <MissionCTA
            id={quest.id}
            title={attributes?.Title}
            url={attributes?.Link}
            rewards={!!rewards}
            key={generateKey('cta')}
            CTAs={CTAsWithAPYs}
            variableWeeklyAPY={points > 0 && rewardType === 'weekly'}
            signature={missionType === 'turtle_signature'}
            rewardRange={rewardRange}
          />
        )}
        {/* Subtitle and description */}
        <DescriptionBoxSF
          longTitle={attributes?.Subtitle}
          description={attributes?.Description}
        />
        {/* Steps */}
        {/* Todo: remove the check for steps */}
        {attributes?.Steps && attributes?.Steps?.length > 0 && (
          <StepsBox steps={attributes?.Steps} baseUrl={baseUrl} />
        )}
        {/* Additional Info */}
        {attributes?.Information && (
          <InformationAlertBox information={attributes?.Information} />
        )}
      </SuperfestPageMainBox>
    </SuperfestContainer>
  );
};
