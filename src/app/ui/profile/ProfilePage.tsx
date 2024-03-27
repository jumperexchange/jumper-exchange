'use client';
import { ProfilePage as ProfilePageComponent } from '@/components/ProfilePage';
import { BackgroundGradient } from 'src/components/BackgroundGradient/BackgroundGradient';
import { Navbar } from 'src/components/Navbar/Navbar';
import { PoweredBy } from 'src/components/PoweredBy/PoweredBy';
import { ReactQueryProvider } from 'src/providers/ReactQueryProvider';
import { ThemeProvider } from 'src/providers/ThemeProvider';
import { WalletProvider } from 'src/providers/WalletProvider/WalletProvider';

const ProfilePage = () => {
  return <ProfilePageComponent />;
};

const ProfilePageWrapper = () => {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        <WalletProvider>
          <BackgroundGradient />
          <Navbar />
          <ProfilePage />
          <PoweredBy />
        </WalletProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
};

export default ProfilePageWrapper;
