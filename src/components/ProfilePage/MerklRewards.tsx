import { RewardsCarousel } from '@/components/ProfilePage/Rewards/RewardsCarousel';
import type { MerklRewardsData } from '@/types/strapi';
import { useAccount } from '@lifi/wallet-management';
import { useMemo } from 'react';
import { useMerklRewards } from 'src/hooks/useMerklRewards';
import { AvailableRewardsExtended } from 'src/types/merkl';

const shouldHideComponent = (
  account: { address?: string } | undefined,
  isRewardLoading: boolean,
  isRewardSuccess: boolean,
  availableRewards: AvailableRewardsExtended[],
) => {
  return !account?.address || isRewardLoading || !isRewardSuccess;
};

interface MerklRewardsProps {
  merkl_rewards?: MerklRewardsData[];
}

export const MerklRewards = ({ merkl_rewards }: MerklRewardsProps) => {
  const { account } = useAccount();
  const { availableRewards, isSuccess, isLoading } = useMerklRewards({
    userAddress: '0xb29601eB52a052042FB6c68C69a442BD0AE90082',
    MerklRewards: merkl_rewards,
    includeTokenIcons: true,
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
