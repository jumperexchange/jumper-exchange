import { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { AppProvider } from './AppProvider';
import { FeatureCards } from './components';
import { Navbar } from './components/Navbar';
import { Menus } from './components/Navbar/Menu/Menus';
import { Widgets } from './components/Widgets';
import { useInitUserTracking, useUserTracking } from './hooks';

// dummy commit to check testing deployments. TO BE REMOVED

export default function App() {
  const { initTracking } = useInitUserTracking();
  const [count, setCount] = useState(0);
  const { trackEvent } = useUserTracking();
  useEffect(() => {
    initTracking({ disableTrackingTool: [] });
  }, [initTracking]);

  return (
    <AppProvider>
      <button
        onClick={() => {
          console.log('event', 'test-event', {
            app_name: 'jumper.exchange',
            screen_name: 'Home',
          });
          ReactGA.gtag('event', 'test-event', {
            app_name: 'jumper.exchange',
            screen_name: 'Home',
          });
        }}
      >
        GTAG EVENT
      </button>
      <button
        onClick={() => {
          console.log(count, {
            category: 'test-category-cleaned',
            action: 'test-action',
            data: {
              label: `test-${count}`,
              date: '24-8-23',
            },
          });
          trackEvent({
            category: 'test-category-cleaned',
            action: 'test-action',
            label: `test-${count}`,
            data: {
              eventDate: '25-8-23',
            },
          });
          setCount((el) => el + 1);
        }}
      >
        GA trackEVENT
      </button>

      <button
        onClick={() => {
          console.log('test-ga-event', {
            category: 'test-category',
            action: 'test-action-ga-event',
            label: `react-ga default event ${count}`, // optional
          });
          ReactGA.event('test-ga-event', {
            category: 'test-category',
            action: 'test-action-ga-event',
            label: `react-ga default event ${count}`, // optional
            'test-param': 'more-params',
          });
          setCount((el) => el + 1);
        }}
      >
        GA DEFAULT EVENT
      </button>

      <button
        onClick={() => {
          console.log(count, {
            testProperty: 'test-property',
          });
          ReactGA.set({
            testProperty: 'test-property',
          });
        }}
      >
        GA USER PROPERTY
      </button>

      <button
        onClick={() => {
          console.log(count, {
            testGtagProperty: 'test-property-gtag',
          });
          ReactGA.gtag('set', {
            testGtagProperty: 'test-property-gtag',
          });
        }}
      >
        GTAG USER PROPERTY
      </button>
      <Navbar />
      <Menus />
      <Widgets />
      <FeatureCards />
    </AppProvider>
  );
}
