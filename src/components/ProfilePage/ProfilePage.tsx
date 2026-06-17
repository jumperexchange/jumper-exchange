'use client';

import { useAccount } from '@lifi/wallet-management';
import { ProfileProvider } from 'src/providers/ProfileProvider';
import { PerksDataAttributes, StrapiResponseData } from 'src/types/strapi';
import { PageContainer } from '../Containers/PageContainer';
import { IntroSection } from './sections/IntroSection';
import { RewardsSection } from './sections/RewardsSection';
import { TabsSection } from './TabsSection/TabsSection';
import { AvailableTabs } from './TabsSection/constants';
import { PerksList } from './components/PerksList/PerksList';
import { GridContainer } from '../Containers/GridContainer';
import { AchievementsList } from './components/AchievementsList/AchievementsList';

interface ProfilePageProps {
  walletAddress?: string;
  isPublic?: boolean;
  perks: StrapiResponseData<PerksDataAttributes>;
  hasMorePerks: boolean;
}

export const ProfilePage = ({
  walletAddress,
  isPublic,
  perks,
  hasMorePerks,
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
        <IntroSection />
        {isPublic && <RewardsSection />}
        <TabsSection>
          {(activeTab: string) => {
            if (activeTab === AvailableTabs.Achievements) {
              return (
                <GridContainer gridTemplateColumns="repeat(auto-fit, minmax(322px, 1fr))">
                  <AchievementsList />
                </GridContainer>
              );
            } else if (activeTab === AvailableTabs.Perks) {
              return (
                <GridContainer>
                  <PerksList
                    initialPerks={perks}
                    shouldLoadMore={hasMorePerks}
                  />
                </GridContainer>
              );
            }
          }}
        </TabsSection>
      </PageContainer>
    </ProfileProvider>
  );
};
