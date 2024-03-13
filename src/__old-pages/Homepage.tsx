import { FeatureCards, PoweredBy, WelcomeScreen, Widgets } from '@/components';
import { useInitUserTracking } from '@/hooks';
import { Layout } from 'src/Layout';

import { Snackbar, SupportModal } from '@/components';
import { AppProvider } from 'src/providers';

interface HomepageProps {
  lng: string;
}

export const Homepage = ({ lng }: HomepageProps) => {
  const { initTracking } = useInitUserTracking();
  // todo: enable cookie3
  // const cookie3 = useCookie3();

  // useEffect(() => {
  //   initTracking({});
  //   cookie3?.trackPageView();
  // }, [cookie3, initTracking]);

  return (
    <AppProvider lng={lng}>
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
