import { useEffect } from 'react';
import { Layout } from 'src/Layout';
import { ProfilePage } from 'src/components';
import { useCookie3, useInitUserTracking, useStrapi } from 'src/hooks';

export const LoyaltyPassPage = () => {
  const { initTracking } = useInitUserTracking();
  const cookie3 = useCookie3();

  useEffect(() => {
    initTracking({});
    cookie3?.trackPageView();
  }, [cookie3, initTracking]);

  return (
    <Layout navbarPageReload={true}>
      <ProfilePage />
    </Layout>
  );
};
