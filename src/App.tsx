import { useEffect } from 'react';
import { useInitUserTracking } from 'src/hooks';
import { AppProvider } from './AppProvider';
import { FeatureCards, Header, Menus, Widgets } from './organisms';

export function App() {
  const { initTracking } = useInitUserTracking();
  useEffect(() => {
    initTracking({ disableTrackingTool: [] });
  }, [initTracking]);

  return (
    <AppProvider>
      <Header />
      <Menus />
      <Widgets />
      <FeatureCards />
    </AppProvider>
  );
}
