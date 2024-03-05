import { useEffect } from 'react';
import { useCookie3, useInitUserTracking } from 'src/hooks';
import {
  FeatureCards,
  Navbar,
  PoweredBy,
  Snackbar,
  SupportModal,
  WelcomeScreen,
  Widgets,
} from './components';
import { AppProvider } from './providers';

export function App() {
  const { initTracking } = useInitUserTracking();
  const cookie3 = useCookie3();

  useEffect(() => {
    initTracking({});
    cookie3?.trackPageView();
  }, [cookie3, initTracking]);

  return (
    <AppProvider>
      <Navbar />
      <WelcomeScreen />
      <Widgets />
      <FeatureCards />
      <PoweredBy />
      <Snackbar />
      <SupportModal />
    </AppProvider>
  );
}
