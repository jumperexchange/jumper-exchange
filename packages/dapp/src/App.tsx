import { useEffect } from 'react';
import { AppProvider } from './AppProvider';
import { Navbar } from './components/Navbar';
import { Menus } from './components/Navbar/Menu/Menus';
import { Widgets } from './components/Widgets';
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
      <Widgets />
    </AppProvider>
  );
}
