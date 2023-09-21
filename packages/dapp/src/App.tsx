import { FeatureCards, Menus, Navbar, Widgets } from 'components';
import { useInitUserTracking } from 'hooks';
import { useEffect } from 'react';
import { AppProvider } from './AppProvider';
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
