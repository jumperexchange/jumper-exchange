'use client';
import { ProfilePage as ProfilePageComponent } from '@/components/ProfilePage/ProfilePage';
import { ProfileProvider } from '@/providers/ProfileProvider';
import type { CampaignData } from '@/types/strapi';
import { useAccount } from '@lifi/wallet-management';
import { QuestDataExtended } from 'src/types/merkl';

interface ProfilePageProps {
  walletAddress?: string;
  isPublic?: boolean;
  campaigns?: CampaignData[];
  quests?: QuestDataExtended[];
}

const ProfilePage = ({
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
    >
      <ProfilePageComponent quests={quests} campaigns={campaigns} />
    </ProfileProvider>
  );
};

export default ProfilePage;
