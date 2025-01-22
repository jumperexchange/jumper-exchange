'use client';
import { MerklRewards } from '@/components/ProfilePage/MerklRewards';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { ProfileContext } from '@/providers/ProfileProvider';
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
  ProfileInfoBoxCards,
} from './ProfilePage.style';
import { QuestsCompletedCarousel } from './QuestsCompletedCarousel/QuestsCompletedCarousel';
import { QuestsOverview } from './QuestsOverview/QuestsOverview';
import { Traits } from './Traits/Traits';
// import { useABTest } from 'src/hooks/useABTest';
// import { CampaignBanner } from './CampaignBanner/CampaignBanner';

export const ProfilePage = () => {
  const { walletAddress, isPublic } = useContext(ProfileContext);
  const { isLoading, points, pdas } = useLoyaltyPass(walletAddress);
  const { traits } = useTraits();

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
        <AddressCard address={walletAddress} />
        <ProfileInfoBox>
          <ProfileInfoBoxCards>
            <TierBox points={points} loading={isLoading} />
            <LeaderboardCard address={walletAddress} />
          </ProfileInfoBoxCards>
          <Traits />
        </ProfileInfoBox>
      </ProfileHeaderBox>
      {/* <CampaignBanner /> */}
      <QuestsOverview pastCampaigns={pastCampaigns} traits={traits} />
      <QuestsCompletedCarousel pdas={pdas} loading={isLoading} />
    </PageContainer>
  );
};
