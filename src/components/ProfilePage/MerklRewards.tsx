import type { MerklRewardsData } from '@/types/strapi';
import { useAccount } from '@lifi/wallet-management';
import { useMemo } from 'react';
import { useMerklRewards } from 'src/hooks/useMerklRewards';
import { AvailableRewardsExtended } from 'src/types/merkl';
import { RewardsCarousel } from './Rewards/RewardsCarousel';

const shouldHideComponent = (
  account: { address?: string } | undefined,
  isRewardLoading: boolean,
  isRewardSuccess: boolean,
  availableRewards: AvailableRewardsExtended[],
) => {
  return !account?.address || isRewardLoading || !isRewardSuccess;
};

interface MerklRewardsProps {
  merklRewards?: MerklRewardsData[];
}

export const MerklRewards = ({ merklRewards }: MerklRewardsProps) => {
  const { account } = useAccount();
  const { availableRewards, isSuccess, isLoading } = useMerklRewards({
    userAddress: account.address,
    merklRewards,
    includeTokenIcons: true,
    claimableOnly: true,
  });

  const hideComponent = useMemo(
    () => shouldHideComponent(account, isLoading, isSuccess, availableRewards),
    [account, isSuccess, availableRewards],
  );

  if (hideComponent) {
    return null;
  }

  return (
    <RewardsCarousel
      availableRewards={availableRewards}
      isMerklSuccess={isSuccess}
    />
  );
};
