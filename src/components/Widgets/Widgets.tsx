'use client';
import { useLayoutEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { WidgetEvent, useWidgetEvents } from '@lifi/widget';
import { useEffect } from 'react';
import { WidgetTrackingProvider } from '@/providers/WidgetTrackingProvider';
import type { WidgetTrackingVariant } from '@/components/Widgets/tracking/widgetTrackingPresets';
import { ChainAlert } from '@/components/Alerts';
import { TabsMap } from '@/const/tabsMap';
import { useActiveTabStore } from '@/stores/activeTab';
import { PartnerThemeFooterImage } from '../PartnerThemeFooterImage';
import { WidgetEvents } from './WidgetEvents';

export function Widgets() {
  const { setActiveTab } = useActiveTabStore();
  const pathname = usePathname();
  const widgetEvents = useWidgetEvents();
  const [trackingVariant, setTrackingVariant] =
    useState<WidgetTrackingVariant>('main');

  useLayoutEffect(() => {
    const isAdvanced = TabsMap.Advanced.destination.some((dest) =>
      pathname.includes(dest),
    );
    setActiveTab(isAdvanced ? TabsMap.Advanced.index : TabsMap.Simple.index);
  }, [pathname, setActiveTab]);

  useEffect(() => {
    const handler = ({ tab }: { tab: string }) => {
      if (tab === 'private') {
        setTrackingVariant('private');
      } else if (tab === 'limit') {
        setTrackingVariant('limit');
      } else {
        setTrackingVariant('main');
      }
    };

    widgetEvents.on(WidgetEvent.NavigationTabChanged, handler);
    return () => {
      widgetEvents.off(WidgetEvent.NavigationTabChanged, handler);
    };
  }, [widgetEvents]);

  return (
    <>
      <ChainAlert />
      <PartnerThemeFooterImage />
      <WidgetTrackingProvider variant={trackingVariant}>
        <WidgetEvents />
      </WidgetTrackingProvider>
    </>
  );
}
