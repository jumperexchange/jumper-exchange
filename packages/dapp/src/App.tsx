import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { AppProvider } from './AppProvider';
import { FeatureCards } from './components';
import { Navbar } from './components/Navbar';
import { Menus } from './components/Navbar/Menu/Menus';
import { Widgets } from './components/Widgets';
import { useInitUserTracking } from './hooks';

// dummy commit to check testing deployments. TO BE REMOVED

export default function App() {
  const { initTracking } = useInitUserTracking();
  useEffect(() => {
    initTracking({ disableTrackingTool: [] });
  }, [initTracking]);

  return (
    <AppProvider>
      <button
        onClick={() => {
          console.log('consent', 'default', {
            ad_storage: 'granted',
            analytics_storage: 'granted',
          });
          ReactGA.gtag('consent', 'default', {
            ad_storage: 'granted',
            analytics_storage: 'granted',
            functionality_storage: 'granted',
            personalization_storage: 'granted',
            security_storage: 'granted',
          });
        }}
      >
        GRANT CONSENT
      </button>
      <Navbar />
      <Menus />
      <Widgets />
      <FeatureCards />
    </AppProvider>
  );
}
