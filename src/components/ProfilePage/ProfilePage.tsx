import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { useAccount } from '@lifi/wallet-management';
import { useMemo } from 'react';
import type { AvailableRewards } from 'src/hooks/useMerklRewardsOnCampaigns';
import { useMerklRewardsOnCampaigns } from 'src/hooks/useMerklRewardsOnCampaigns';
import { useTraits } from 'src/hooks/useTraits';
import { AddressCard } from './AddressCard/AddressCard';
import { LeaderboardCard } from './LeaderboardCard/LeaderboardCard';
import { TierBox } from './LevelBox/TierBox';
import {
  PageContainer,
  ProfileHeaderBox,
  ProfileInfoBox,
} from './ProfilePage.style';
import { QuestsCompletedCarousel } from './QuestsCompletedCarousel/QuestsCompletedCarousel';
import { QuestsOverview } from './QuestsOverview/QuestsOverview';
import { RewardsCarousel } from './Rewards/RewardsCarousel';
// import { useABTest } from 'src/hooks/useABTest';

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

export const ProfilePage = () => {
  const { account } = useAccount();
  const { isLoading, points, tier, pdas } = useLoyaltyPass();
  const { traits } = useTraits();
  // const { isEnabled: isABTestEnabled } = useABTest({
  //   feature: 'test_ab_1',
  //   user: account?.address || '',
  // });
  const {
    availableRewards,
    pastCampaigns,
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
    <PageContainer className="profile-page">
      {!hideComponent && (
        <RewardsCarousel
          availableRewards={availableRewards}
          isMerklSuccess={isRewardSuccess}
        />
      )}
      <ProfileHeaderBox>
        <AddressCard
          address={account?.address}
          isEVM={account?.chainType === 'EVM'}
        />
        <ProfileInfoBox sx={{ display: 'flex', flex: 2, gap: 2 }}>
          <TierBox points={points} tier={tier} loading={isLoading} />
          <LeaderboardCard address={account?.address} />
        </ProfileInfoBox>
      </ProfileHeaderBox>
      <QuestsOverview pastCampaigns={pastCampaigns} traits={traits} />
      <QuestsCompletedCarousel pdas={pdas} loading={isLoading} />
    </PageContainer>
  );
};
