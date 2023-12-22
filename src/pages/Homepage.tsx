import { useEffect } from 'react';
import { useCookie3, useInitUserTracking } from 'src/hooks';
import {
  BackgroundGradient,
  FeatureCards,
  WelcomeScreen,
  Widgets,
} from 'src/components';
import { Layout } from 'src/Layout';

export const Homepage = () => {
  const { initTracking } = useInitUserTracking();
  const cookie3 = useCookie3();

  useEffect(() => {
    initTracking({});
    cookie3?.trackPageView();
  }, [cookie3, initTracking]);

  return (
    <Layout>
      <BackgroundGradient />
      <WelcomeScreen />
      <Widgets />
      <FeatureCards />
    </Layout>
  );
};
