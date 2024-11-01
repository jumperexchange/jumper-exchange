import {
  type AvailableRewards,
  useMerklRewardsOnCampaigns,
} from '@/hooks/useMerklRewardsOnCampaigns';
import { useAccount } from '@lifi/wallet-management';
import { RewardsCarousel } from '@/components/ProfilePage/Rewards/RewardsCarousel';
import { useMemo } from 'react';

const shouldHideComponent = (
  account: { address?: string } | undefined,
  isRewardLoading: boolean,
  isRewardSuccess: boolean,
  availableRewards: AvailableRewards[],
) => {
  return (
    !account?.address ||
    isRewardLoading ||
    !isRewardSuccess ||
    availableRewards?.filter((e) => e?.amountToClaim > 0)?.length === 0
  );
};

export function MerkleRewards() {
  const { account } = useAccount();

  const {
    availableRewards,
    isLoading: isRewardLoading,
    isSuccess: isRewardSuccess,
  } = useMerklRewardsOnCampaigns({
    userAddress: account?.address,
  });

  const hideComponent = useMemo(
    () =>
      shouldHideComponent(
        account,
        isRewardLoading,
        isRewardSuccess,
        availableRewards,
      ),
    [account, isRewardLoading, isRewardSuccess, availableRewards],
  );

  return (
    <RewardsCarousel
      hideComponent={hideComponent}
      availableRewards={availableRewards}
      isMerklSuccess={isRewardSuccess}
    />
  );
}
