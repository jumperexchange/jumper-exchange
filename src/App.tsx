import { useEffect } from 'react';
import { FeatureCards, Menus, Navbar, Widgets } from 'src/components';
import { useInitUserTracking } from 'src/hooks';
import { AppProvider } from './AppProvider';

export function App() {
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
