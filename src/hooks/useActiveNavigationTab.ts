import { useWidgetEvents, WidgetEvent } from '@jumperexchange/widget';
import type { NavigationTabKey } from '@jumperexchange/widget';
import { useEffect, useState } from 'react';

export function useActiveNavigationTab(): NavigationTabKey | null {
  const widgetEvents = useWidgetEvents();
  const [activeTab, setActiveTab] = useState<NavigationTabKey | null>(null);

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
