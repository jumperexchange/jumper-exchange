'use client';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { useAccount } from '@lifi/wallet-management';
import { useContext } from 'react';
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
// import { useABTest } from 'src/hooks/useABTest';

import { MerklRewards } from '@/components/ProfilePage/MerklRewards';
import { ProfileContext } from '@/providers/ProfileProvider';

export const ProfilePage = () => {
  const { account } = useAccount();
  const { isLoading, points, pdas } = useLoyaltyPass(account?.address);
  const { traits } = useTraits();
  const { walletAddress, isPublic } = useContext(ProfileContext);

  // const { isEnabled: isABTestEnabled } = useABTest({
  //   feature: 'test_ab_1',
  //   user: account?.address || '',
  // });

  const { pastCampaigns } = useMerklRewardsOnCampaigns({
    userAddress: walletAddress,
  });

  return (
    <PageContainer className="profile-page">
      {!isPublic && <MerklRewards />}
      <ProfileHeaderBox>
        <AddressCard address={account?.address} />
        <ProfileInfoBox sx={{ display: 'flex', flex: 2, gap: 2 }}>
          <TierBox points={points} loading={isLoading} />
          <LeaderboardCard address={account?.address} />
        </ProfileInfoBox>
      </ProfileHeaderBox>
      <QuestsOverview pastCampaigns={pastCampaigns} traits={traits} />
      <QuestsCompletedCarousel pdas={pdas} loading={isLoading} />
    </PageContainer>
  );
};
