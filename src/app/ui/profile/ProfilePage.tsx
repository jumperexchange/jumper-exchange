'use client';
import { ProfilePage as ProfilePageComponent } from '@/components/ProfilePage/ProfilePage';
import { ProfileProvider } from '@/providers/ProfileProvider';
import type { CampaignData, QuestData } from '@/types/strapi';
import { useAccount } from '@lifi/wallet-management';

interface ProfilePageProps {
  walletAddress?: string;
  isPublic?: boolean;
  campaigns?: CampaignData[];
  quests?: QuestData[];
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
