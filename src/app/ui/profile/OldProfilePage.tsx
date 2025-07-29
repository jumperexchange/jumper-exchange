'use client';
import { ProfileProvider } from '@/providers/ProfileProvider';
import type { CampaignData } from '@/types/strapi';
import { useAccount } from '@lifi/wallet-management';
import { OldProfilePage as ProfilePageComponent } from 'src/components/ProfilePage/OldProfilePage';
import { QuestDataExtended } from 'src/types/merkl';

interface ProfilePageProps {
  walletAddress?: string;
  isPublic?: boolean;
  campaigns?: CampaignData[];
  quests?: QuestDataExtended[];
}

const OldProfilePage = ({
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
      <ProfilePageComponent quests={quests} campaigns={campaigns} />
    </ProfileProvider>
  );
};

export default OldProfilePage;
