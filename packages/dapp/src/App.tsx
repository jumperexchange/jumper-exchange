import { useEffect } from 'react';
import { AppProvider } from './AppProvider';
import { FeatureCards } from './components';
import { DualWidget } from './components/DualWidget';
import { Navbar } from './components/Navbar';
import { Menus } from './components/Navbar/Menu/Menus';
import { useInitUserTracking } from './hooks';

export default function App() {
  const { initTracking } = useInitUserTracking();
  useEffect(() => {
    initTracking({ disableTrackingTool: [] });
  }, [initTracking]);

  return (
    <AppProvider>
      <Navbar />
      <Menus />
      <DualWidget />
      <FeatureCards />
    </AppProvider>
  );
}
