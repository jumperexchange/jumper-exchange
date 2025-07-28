'use client';
import { useAccount } from '@lifi/wallet-management';
import { ProfileProvider } from 'src/providers/ProfileProvider';
import { QuestDataExtended } from 'src/types/merkl';
import { CampaignData } from 'src/types/strapi';
import { PageContainer } from '../Containers/PageContainer';
import { IntroSection } from './sections/IntroSection';
import { RewardsSection } from './sections/RewardsSection';
import { TabsSection } from './TabsSection/TabsSection';
import { AvailableTabs } from './TabsSection/constants';

interface ProfilePageProps {
  walletAddress?: string;
  isPublic?: boolean;
  campaigns?: CampaignData[];
  quests?: QuestDataExtended[];
}

export const ProfilePage = ({
  walletAddress,
  isPublic,
  campaigns,
  quests,
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
        <RewardsSection />
        <TabsSection>
          {(activeTab: string) => {
            if (activeTab === AvailableTabs.Achievements) {
              return <p>Achievements</p>;
            } else if (activeTab === AvailableTabs.Perks) {
              return <p>Perks</p>;
            }
          }}
        </TabsSection>
      </PageContainer>
    </ProfileProvider>
  );
};
