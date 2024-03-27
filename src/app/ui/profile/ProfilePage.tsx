'use client';
import { ProfilePage as ProfilePageComponent } from '@/components/ProfilePage';
import { AppProvider } from 'src/providers/AppProvider';

const ProfilePage = () => {
  return (
    <AppProvider>
      <ProfilePageComponent />;
    </AppProvider>
  );
};

export default ProfilePage;
