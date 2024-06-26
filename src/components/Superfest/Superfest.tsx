import { useAccounts } from '@/hooks/useAccounts';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { Box, Stack } from '@mui/material';
import { SuperfestContainer } from './Superfest.style';
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
          false
          // !isRewardLoading && isRewardSuccess
        }
        rewardAmount={
          45.54
          // availableRewards?.[0] as number
        }
      />
      <HeroBox />
      <Box
        sx={{
          minWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <QuestCarouselSuperfest quests={quests} loading={isQuestLoading} />
        {isQuestLoading || activeCampaigns.length === 0 ? undefined : (
          <QuestCompletedList
            quests={quests}
            loading={isQuestLoading}
            activeCampaigns={activeCampaigns}
          />
        )}
        <NFTClaimingBox />
      </Box>
    </SuperfestContainer>
  );
};
