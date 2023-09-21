import { Menus, Navbar, Widgets } from 'components';
import { useEffect } from 'react';
import { AppProvider } from './AppProvider';
import { FeatureCards } from './components';
import { useInitUserTracking } from './hooks';

// dummy commit to check testing deployments. TO BE REMOVED

export default function App() {
  const { initTracking } = useInitUserTracking();
  useEffect(() => {
    initTracking({ disableTrackingTool: [] });
  }, [initTracking]);

  return (
    <AppProvider>
      <Navbar />
      <Menus />
      <Widgets />
      <FeatureCards />
    </AppProvider>
  );
}
