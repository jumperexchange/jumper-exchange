import { useEffect } from 'react';
import { Layout } from 'src/Layout';
import { FeatureCards, WelcomeScreen, Widgets } from 'src/components';
import { useCookie3, useInitUserTracking } from 'src/hooks';

import { Snackbar, SupportModal } from 'src/components';
import { AppProvider } from 'src/providers';

interface HomepageProps {
  fixedPosition?: boolean;
}

export const Homepage = ({ fixedPosition }: HomepageProps) => {
  const { initTracking } = useInitUserTracking();
  const cookie3 = useCookie3();

  useEffect(() => {
    initTracking({});
    cookie3?.trackPageView();
  }, [cookie3, initTracking]);

  return (
    <AppProvider>
      <Layout
        hideNavbarTabs={false}
        redirectConnect={false}
        fixedPosition={true}
      >
        <WelcomeScreen />
        <Widgets />
        <FeatureCards />
        <Snackbar />
        <SupportModal />
      </Layout>
    </AppProvider>
  );
};
