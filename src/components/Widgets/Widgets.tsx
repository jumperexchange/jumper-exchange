'use client';
import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useActiveNavigationTab } from '@/hooks/useActiveNavigationTab';
import { WidgetTrackingProvider } from '@/providers/WidgetTrackingProvider';
import type { WidgetTrackingVariant } from '@/components/Widgets/tracking/widgetTrackingPresets';
import { ChainAlert } from '@/components/Alerts';
import { TabsMap } from '@/const/tabsMap';
import { useActiveTabStore } from '@/stores/activeTab';
import { useRepeatOrderFlowStore } from '@/stores/limitOrderFlow/RepeatOrderFlowStore';
import { useModifyOrderFlowStore } from '@/stores/limitOrderFlow/ModifyOrderFlowStore';
import { PartnerThemeFooterImage } from '../PartnerThemeFooterImage';
import { WidgetEvents } from './WidgetEvents';

export function Widgets() {
  const { setActiveTab } = useActiveTabStore();
  const pathname = usePathname();
  const activeNavigationTab = useActiveNavigationTab();
  const isRepeatModalOpen = useRepeatOrderFlowStore((s) => s.isModalOpen);
  const isModifyModalOpen = useModifyOrderFlowStore((s) => s.isModalOpen);

  useLayoutEffect(() => {
    const isAdvanced = TabsMap.Advanced.destination.some((dest) =>
      pathname.includes(dest),
    );
    setActiveTab(isAdvanced ? TabsMap.Advanced.index : TabsMap.Simple.index);
  }, [pathname, setActiveTab]);

  const trackingVariant: WidgetTrackingVariant =
    activeNavigationTab === 'private'
      ? 'private'
      : pathname.includes('advanced')
        ? 'advanced'
        : 'main';

  return (
    <>
      <ChainAlert />
      <PartnerThemeFooterImage />
      <WidgetTrackingProvider
        variant={trackingVariant}
        enabled={!isRepeatModalOpen && !isModifyModalOpen}
      >
        <WidgetEvents />
      </WidgetTrackingProvider>
    </>
  );
}
