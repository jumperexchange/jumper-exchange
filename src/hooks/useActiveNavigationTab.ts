import { useWidgetEvents, WidgetEvent } from '@lifi/widget';
import type { NavigationTabKey } from '@lifi/widget';
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
