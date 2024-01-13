import { useEffect } from 'react';
import { Layout } from 'src/Layout';
import { FeatureCards, WelcomeScreen, Widgets } from 'src/components';
import { useCookie3, useInitUserTracking } from 'src/hooks';

export const Homepage = () => {
  const { initTracking } = useInitUserTracking();
  const cookie3 = useCookie3();

  useEffect(() => {
    initTracking({});
    cookie3?.trackPageView();
  }, [cookie3, initTracking]);

  return (
    <Layout>
      <WelcomeScreen />
      <Widgets />
      <FeatureCards />
    </Layout>
  );
};
