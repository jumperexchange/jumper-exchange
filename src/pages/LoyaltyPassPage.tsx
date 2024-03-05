import { Snackbar } from '@mui/material';
import { useEffect } from 'react';
import { Layout } from 'src/Layout';
import { Navbar, PoweredBy, ProfilePage, SupportModal } from 'src/components';
import { useCookie3, useInitUserTracking, useStrapi } from 'src/hooks';
import { AppProvider } from 'src/providers';

export const LoyaltyPassPage = () => {
  const { initTracking } = useInitUserTracking();
  const cookie3 = useCookie3();

  useEffect(() => {
    initTracking({});
    cookie3?.trackPageView();
  }, [cookie3, initTracking]);

  return (
    <Layout>
      <ProfilePage />
    </Layout>
  );
};
