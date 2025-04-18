import { RewardsCarousel } from '@/components/ProfilePage/Rewards/RewardsCarousel';
import type { CampaignData } from '@/types/strapi';
import { useAccount } from '@lifi/wallet-management';
import { useMemo } from 'react';
import type { AvailableRewards } from 'src/hooks/useMerklUserRewardsOnCampaign';
import { useMerklUserRewardsOnCampaign } from 'src/hooks/useMerklUserRewardsOnCampaign';

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

export const MerklRewards = ({ campaign }: MerklRewardsProps) => {
  const { account } = useAccount();
  const {
    availableRewards,
    activeCampaigns,
    pastCampaigns,
    isLoading: isRewardLoading,
    isSuccess: isRewardSuccess,
  } = useMerklUserRewardsOnCampaign({
    userAddress: account.address,
    MerklRewards: campaign?.merkl_rewards,
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
};
