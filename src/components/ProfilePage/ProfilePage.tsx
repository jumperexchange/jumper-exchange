'use client';

import { useAccount } from '@jumperexchange/wallet-management';
import { ProfileProvider } from 'src/providers/ProfileProvider';
import type { PerksDataAttributes, StrapiResponseData } from 'src/types/strapi';
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
}

export const ProfilePage = ({
  walletAddress,
  isPublic,
  perks,
}: ProfilePageProps) => {
  const { account } = useAccount();

  return (
    <ProfileProvider
      walletAddress={walletAddress || account?.address || ''}
      isPublic={isPublic}
      // @Note these flags are not correctly set in @jumperexchange/wallet-management
      isLoading={account?.isConnecting || account?.isReconnecting}
    >
      <PageContainer>
        <IntroSection perks={perks} />
        {isPublic && <RewardsSection />}
        <UnlockedPerksSection perks={perks} />
        <EarnXpSection />
        <YourAchievementsSection />
      </PageContainer>
    </ProfileProvider>
  );
};
