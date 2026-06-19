'use client';

import { useAccount } from '@lifi/wallet-management';
import { ProfileProvider } from 'src/providers/ProfileProvider';
import type {
  MerklRewardsData,
  PerksDataAttributes,
  StrapiResponseData,
} from 'src/types/strapi';
import { PageContainer } from '../Containers/PageContainer';
import { EarnXpSection } from './sections/EarnXpSection/EarnXpSection';
import { IntroSection } from './sections/IntroSection';
import { RewardsSection } from './sections/RewardsSection';
import { UnlockedPerksSection } from './sections/UnlockedPerksSection/UnlockedPerksSection';
import { YourAchievementsSection } from './sections/YourAchievementsSection/YourAchievementsSection';

interface ProfilePageProps {
  walletAddress?: string;
  isPublic?: boolean;
  perks: StrapiResponseData<PerksDataAttributes>;
  merklRewards?: StrapiResponseData<MerklRewardsData>;
}

export const ProfilePage = ({
  walletAddress,
  isPublic,
  perks,
  merklRewards,
}: ProfilePageProps) => {
  const { account } = useAccount();

  return (
    <ProfileProvider
      walletAddress={walletAddress || account?.address || ''}
      isPublic={isPublic}
      // @Note these flags are not correctly set in @lifi/wallet-management
      isLoading={account?.isConnecting || account?.isReconnecting}
    >
      <PageContainer>
        <IntroSection perks={perks} />
        <UnlockedPerksSection perks={perks} />
        <EarnXpSection />
        {isPublic && <RewardsSection merklRewards={merklRewards} />}
        <YourAchievementsSection />
      </PageContainer>
    </ProfileProvider>
  );
};
