import { RewardsCarousel } from '@/components/ProfilePage/Rewards/RewardsCarousel';
import {
  type AvailableRewards,
  useMerklRewardsOnCampaigns,
} from '@/hooks/useMerklRewardsOnCampaigns';
import type { CampaignData } from '@/types/strapi';
import { useAccount } from '@lifi/wallet-management';
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

interface MerklRewardsProps {
  campaign?: CampaignData;
}

export function MerklRewards({ campaign }: MerklRewardsProps) {
  const { account } = useAccount();

  const {
    availableRewards,
    isLoading: isRewardLoading,
    isSuccess: isRewardSuccess,
  } = useMerklRewardsOnCampaigns({
    userAddress: account?.address,
    claimableTokens: campaign?.ClaimableTokens,
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
