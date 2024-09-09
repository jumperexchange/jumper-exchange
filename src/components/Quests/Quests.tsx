import { useAccounts } from '@/hooks/useAccounts';
import { JUMPER_QUESTS_PATH } from 'src/const/urls';
import { useMerklRewards } from 'src/hooks/useMerklRewardsOnSpecificToken';
import { useOngoingFestMissions } from 'src/hooks/useOngoingFestMissions';
import {
  SuperfestContainer,
  SuperfestMainBox,
} from '../Superfest/Superfest.style';
import { ActiveQuestsMissionsCarousel } from './ActiveQuestsMissionsCarousel/ActiveQuestsMissionsCarousel';
import { AvailableMissionsList } from './AvailableMissionsList/AvailableMissionsList';
import { RewardsCarousel } from './Rewards/RewardsCarousel';
import {
  REWARD_TOKEN_ADDRESS,
  REWARD_TOKEN_CHAINID,
} from 'src/const/partnerRewardsTheme';

export const Quests = () => {
  //HOOKS
  const { account } = useAccounts();
  const { quests, isQuestLoading } = useOngoingFestMissions();
  const {
    availableRewards,
    activeCampaigns,
    pastCampaigns,
    isLoading: isRewardLoading,
    isSuccess: isRewardSuccess,
  } = useMerklRewards({
    rewardChainId: REWARD_TOKEN_CHAINID,
    userAddress: account?.address,
    rewardToken: REWARD_TOKEN_ADDRESS,
  });

  return (
    <SuperfestContainer>
      <RewardsCarousel
        hideComponent={!account?.address || isRewardLoading || !isRewardSuccess}
        rewardAmount={availableRewards?.[0]?.amountToClaim as number}
        accumulatedAmountForContractBN={
          availableRewards?.[0]?.accumulatedAmountForContractBN
        }
        proof={availableRewards?.[0]?.proof}
        isMerklSuccess={isRewardSuccess}
      />
      <SuperfestMainBox>
        {!account?.address ||
        isQuestLoading ||
        !activeCampaigns ||
        activeCampaigns.length === 0 ? undefined : (
          <ActiveQuestsMissionsCarousel
            path={JUMPER_QUESTS_PATH}
            quests={quests}
            loading={isQuestLoading}
            activeCampaigns={activeCampaigns}
            pastCampaigns={pastCampaigns}
          />
        )}
        <AvailableMissionsList
          path={JUMPER_QUESTS_PATH}
          quests={quests}
          loading={isQuestLoading}
          pastCampaigns={pastCampaigns}
        />
      </SuperfestMainBox>
    </SuperfestContainer>
  );
};
