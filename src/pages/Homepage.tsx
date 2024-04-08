import { useEffect } from 'react';
import { Layout } from 'src/Layout';
import {
  FeatureCards,
  PoweredBy,
  Snackbar,
  SupportModal,
  WelcomeScreen,
  Widgets,
} from 'src/components';
import { useCookie3, useInitUserTracking } from 'src/hooks';

export const Homepage = () => {
  const { initTracking } = useInitUserTracking();
  const cookie3 = useCookie3();

  useEffect(() => {
    initTracking({});
    cookie3?.trackPageView();
  }, [cookie3, initTracking]);

  return (
    <Layout hideNavbarTabs={false} redirectToLearn={false}>
      <WelcomeScreen />
      <Widgets />
      <FeatureCards />
      <Snackbar />
      <SupportModal />
      <PoweredBy fixedPosition={true} />
    </Layout>
  );
};
