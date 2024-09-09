import { useAccounts } from '@/hooks/useAccounts';
import { useMerklRewards } from 'src/hooks/useMerklRewardsOnSpecificToken';
import { useOngoingFestMissions } from 'src/hooks/useOngoingFestMissions';
import { useTurtleMember } from 'src/hooks/useTurtleMember';
import { ActiveSuperfestMissionsCarousel } from './ActiveSuperfestMissionsCarousel/ActiveSuperfestMissionsCarousel';
import { AvailableMissionsList } from './AvailableMissionsList/AvailableMissionsList';
import { HeroBox } from './HeroBox/HeroBox';
import { NFTClaimingBox } from './NFTClaimingBox/NFTClaimingBox';
import { RewardsCarousel } from './Rewards/RewardsCarousel';
import { SuperfestContainer, SuperfestMainBox } from './Superfest.style';

export const Superfest = () => {
  //HOOKS
  const { account } = useAccounts();
  const { quests, isQuestLoading } = useOngoingFestMissions('superfest');
  const {
    availableRewards,
    activeCampaigns,
    pastCampaigns,
    isLoading: isRewardLoading,
    isSuccess: isRewardSuccess,
  } = useMerklRewards({
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

  return (
    <SuperfestContainer className="superfest">
      <RewardsCarousel
        hideComponent={!account?.address || isRewardLoading || !isRewardSuccess}
        rewardAmount={availableRewards?.[0]?.amountToClaim as number}
        accumulatedAmountForContractBN={
          availableRewards?.[0]?.accumulatedAmountForContractBN
        }
        proof={availableRewards?.[0]?.proof}
        isMerklSuccess={isRewardSuccess}
      />
      <HeroBox />
      <SuperfestMainBox>
        {!account?.address ||
        isQuestLoading ||
        !activeCampaigns ||
        activeCampaigns.length === 0 ? undefined : (
          <ActiveSuperfestMissionsCarousel
            quests={quests}
            loading={isQuestLoading}
            activeCampaigns={activeCampaigns}
            pastCampaigns={pastCampaigns}
          />
        )}
        <AvailableMissionsList
          quests={quests}
          loading={isQuestLoading}
          pastCampaigns={pastCampaigns}
          isJumperTurtleMember={
            isMember && isJumperMember && isMemberCheckSuccess
          }
        />
        <NFTClaimingBox />
      </SuperfestMainBox>
    </SuperfestContainer>
  );
};
