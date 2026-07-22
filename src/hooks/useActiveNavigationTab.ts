import { useWidgetEvents, WidgetEvent } from '@jumperexchange/widget';
import type { NavigationTabKey } from '@jumperexchange/widget';
import { useEffect, useState } from 'react';

/**
 * Mirrors the widget's own `getInitialActiveTabFromUrl`, so the app's tab
 * state isn't null/stale for the render(s) before the widget's
 * NavigationTabChanged event fires.
 */
function getInitialTabFromUrl(): NavigationTabKey | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return new URLSearchParams(window.location.search).get(
    'tab',
  ) as NavigationTabKey | null;
}

export function useActiveNavigationTab(): NavigationTabKey | null {
  const widgetEvents = useWidgetEvents();
  const [activeTab, setActiveTab] = useState<NavigationTabKey | null>(
    getInitialTabFromUrl,
  );

  useEffect(() => {
    const handler = ({ tab }: { tab: NavigationTabKey }) => {
      setActiveTab(tab);
    };
    widgetEvents.on(WidgetEvent.NavigationTabChanged, handler);
    return () => {
      widgetEvents.off(WidgetEvent.NavigationTabChanged, handler);
    };
  }, [widgetEvents]);

  return activeTab;
}
