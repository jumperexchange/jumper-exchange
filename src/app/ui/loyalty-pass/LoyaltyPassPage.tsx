'use client';
import { ProfilePage } from '@/components/ProfilePage';
import '@/i18n/i18next-init-client';
import { Layout } from 'src/Layout';

export const LoyaltyPassPage = () => {
  return (
    <Layout navbarPageReload={true}>
      <ProfilePage />
    </Layout>
  );
};
