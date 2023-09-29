import { useEffect } from 'react';
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
  console.log(`url: ${import.meta.env.VITE_LIFI_API_URL}`);
  return (
    <AppProvider>
      <Navbar />
      <Menus />
      <Widgets />
      <FeatureCards />
    </AppProvider>
  );
}
