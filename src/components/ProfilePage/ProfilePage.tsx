'use client';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import type { CampaignData, QuestData, StrapiMediaData } from '@/types/strapi';
import { useContext } from 'react';
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
import { useMerklRewards } from 'src/hooks/useMerklRewards';
import { CampaignBanner } from './CampaignBanner/CampaignBanner';

interface ProfilePageProps {
  campaigns?: CampaignData[];
  quests?: QuestData[];
}

// Type guard to filter campaigns that can be displayed in banners
interface CampaignWithBanner extends CampaignData {
  ProfileBannerImage: StrapiMediaData;
  ProfileBannerTitle: string;
  ProfileBannerDescription: string;
  ProfileBannerBadge: string;
  ProfileBannerCTA?: string;
  Slug: string;
}

const isBannerCampaign = (
  campaign: CampaignData,
): campaign is CampaignWithBanner =>
  Boolean(
    campaign.ProfileBannerImage?.url &&
      campaign.ProfileBannerTitle &&
      campaign.ProfileBannerDescription &&
      campaign.ProfileBannerBadge &&
      campaign.Slug,
  );

export const ProfilePage = ({ campaigns, quests }: ProfilePageProps) => {
  const { walletAddress, isPublic } = useContext(ProfileContext);
  const { isLoading, points, pdas } = useLoyaltyPass(walletAddress);
  const { traits } = useTraits();

  // const { isEnabled: isABTestEnabled } = useABTest({
  //   feature: 'test_ab_1',
  //   user: account?.address || '',
  // });

  const { pastCampaigns } = useMerklRewards({
    userAddress: walletAddress,
  });

  const validBannerCampaigns = campaigns?.filter(isBannerCampaign) || [];

  return (
    <PageContainer className="profile-page">
      {!isPublic && <MerklRewards />}
      <ProfileHeaderBox>
        <AddressCard address={walletAddress} />
        <ProfileInfoBox sx={{ display: 'flex', flex: 2, gap: 2 }}>
          <TierBox points={points} loading={isLoading} />
          <LeaderboardCard address={walletAddress} />
        </ProfileInfoBox>
      </ProfileHeaderBox>
      {validBannerCampaigns.length > 0 && (
        <CampaignBanner campaigns={validBannerCampaigns} />
      )}
      {Array.isArray(quests) && quests?.length > 0 && (
        <QuestsOverview
          quests={quests}
          pastCampaigns={pastCampaigns}
          traits={traits}
        />
      )}
      <QuestsCompletedCarousel pdas={pdas} loading={isLoading} />
    </PageContainer>
  );
};
