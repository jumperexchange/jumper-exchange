import { useEffect } from 'react';
import { Layout } from 'src/Layout';
import { FeatureCards, WelcomeScreen, Widgets } from 'src/components';
import { useCookie3, useInitUserTracking } from 'src/hooks';

import React from 'react';
import { PoweredBy, Snackbar, SupportModal } from 'src/components';
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
      <Layout>
        <WelcomeScreen />
        <Widgets />
        <FeatureCards />
        <PoweredBy />
        <Snackbar />
        <SupportModal />
      </Layout>
    </AppProvider>
  );
};
