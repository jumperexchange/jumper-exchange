import { useEffect } from 'react';
import { Layout } from 'src/Layout';
import {
  FeatureCards,
  PoweredBy,
  WelcomeScreen,
  Widgets,
} from 'src/components';
import { useCookie3, useInitUserTracking } from 'src/hooks';

import { Snackbar, SupportModal } from 'src/components';
import { AppProvider } from 'src/providers';

export const Homepage = () => {
  const { initTracking } = useInitUserTracking();
  const cookie3 = useCookie3();

  useEffect(() => {
    initTracking({});
    cookie3?.trackPageView();
  }, [cookie3, initTracking]);

  return (
    <AppProvider>
      <Layout hideNavbarTabs={false} redirectToLearn={false}>
        <WelcomeScreen />
        <Widgets />
        <FeatureCards />
        <Snackbar />
        <SupportModal />
        <PoweredBy fixedPosition={true} />
      </Layout>
    </AppProvider>
  );
};
