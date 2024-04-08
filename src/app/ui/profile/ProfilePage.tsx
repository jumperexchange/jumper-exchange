'use client';
import { ProfilePage as ProfilePageComponent } from '@/components/ProfilePage';
import { SupportModal } from '@/components/SupportModal/SupportModal';

const ProfilePage = () => {
  return (
    <>
      <ProfilePageComponent />;
      <SupportModal />
    </>
  );
};

export default ProfilePage;
