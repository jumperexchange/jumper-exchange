'use client';
import { ProfilePage as ProfilePageComponent } from '@/components/ProfilePage/ProfilePage';
import { useAccount } from '@lifi/wallet-management';
import { ProfileProvider } from '@/providers/ProfileProvider';

interface ProfilePageProps {
  walletAddress?: string;
  isPublic?: boolean;
};
const ProfilePage = ({ walletAddress, isPublic }: ProfilePageProps) => {
  const { account } = useAccount();

  console.log('---sdsfagwefa', walletAddress, account, account?.address, isPublic);

  return (
    <ProfileProvider walletAddress={walletAddress || account?.address} isPublic={isPublic}>
      <ProfilePageComponent />
    </ProfileProvider>
  )
};

export default ProfilePage;
