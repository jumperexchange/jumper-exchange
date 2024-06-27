import { useAccounts } from '@/hooks/useAccounts';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { Box, Stack } from '@mui/material';
import { SuperfestContainer, SuperfestMainBox } from './Superfest.style';
import { RewardsCarousel } from './Rewards/RewardsCarousel';
import { NFTClaimingBox } from './NFTClaimingBox/NFTClaimingBox';
import { HeroBox } from './HeroBox/HeroBox';
import { QuestCompletedList } from './QuestsCompleted/QuestsCompletedList';
import { QuestCarouselSuperfest } from './QuestCarousel/QuestCarousel';
import { SuperfestPresentedByBox } from './SuperfestPresentedBy/SuperfestPresentedByBox';
import { useOngoingFestMissions } from 'src/hooks/useOngoingFestMissions';
import { useMerklRewards } from 'src/hooks/useMerklRewardsOnSpecificToken';

export const Superfest = () => {
  //HOOKS
  const { account } = useAccounts();
  const { quests, isQuestLoading } = useOngoingFestMissions();
  const {
    activePosition,
    availableRewards,
    activeCampaigns,
    isLoading: isRewardLoading,
    isSuccess: isRewardSuccess,
  } = useMerklRewards({
    userAddress: account?.address,
  });
  // HookToCheckNFT eligibility

  // CHECK ACTIVE MISSION
  // create a loading state
  // loop through the missions and check if they are in the activeList, if yes, add the activeState true
  // create a new type that extend mission "MerklRewardedMissions" with the state active or not

  return (
    <SuperfestContainer className="superfest">
      <RewardsCarousel
        isLoading={
          !!account?.address
          // !isRewardLoading && isRewardSuccess
        }
        rewardAmount={
          45.54
          // availableRewards?.[0].amountToClaim as number
        }
        rewardAmountBN={
          '455000000'
          // availableRewards?.[0].amountToClaimBN
        }
        proof={
          ['']
          // availableRewards?.[0].proof
        }
        isMerklSuccess={
          true
          //isRewardSuccess
        }
      />
      <HeroBox />
      <SuperfestMainBox>
        <QuestCarouselSuperfest quests={quests} loading={isQuestLoading} />
        {!account?.address ||
        isQuestLoading ||
        activeCampaigns.length === 0 ? undefined : (
          <QuestCompletedList
            quests={quests}
            loading={isQuestLoading}
            activeCampaigns={activeCampaigns}
          />
        )}
        <NFTClaimingBox />
      </SuperfestMainBox>
    </SuperfestContainer>
  );
};
