'use client';
import { SolanaAlert } from '@/components/Alerts';
import { LinkMap } from '@/const/linkMap';
import { TabsMap } from '@/const/tabsMap';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';
import { useActiveTabStore } from '@/stores/activeTab';
import type { StarterVariantType, ThemeVariantType } from '@/types/internal';
import { usePathname } from 'next/navigation';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { ThemesMap } from 'src/const/themesMap';
import type { ThemeModesSupported } from 'src/types/settings';
import { WidgetEvents } from './WidgetEvents';

interface WidgetsProps {
  widgetVariant: StarterVariantType;
  activeTheme: ThemeModesSupported | undefined;
  closedWelcomeScreen: boolean;
}

export function Widgets({ widgetVariant, closedWelcomeScreen }: WidgetsProps) {
  const { activeTab, setActiveTab } = useActiveTabStore();
  const { setWelcomeScreenClosed } = useWelcomeScreen(closedWelcomeScreen);
  const pathname = usePathname();
  const [starterVariantUsed, setStarterVariantUsed] = useState(false);

  const starterVariant: StarterVariantType = useMemo(() => {
    if (widgetVariant) {
      return widgetVariant;
    } else {
      let url = window?.location.pathname.slice(1);
      if (Object.values(LinkMap).includes(url as LinkMap)) {
        if (!!TabsMap.Buy.destination.filter((el) => el === url).length) {
          return TabsMap.Buy.variant;
        } else if (
          !!TabsMap.Refuel.destination.filter((el) => el === url).length
        ) {
          return TabsMap.Refuel.variant;
        } else {
          return TabsMap.Exchange.variant;
        }
      } else {
        // default and fallback: Exchange-Tab
        return TabsMap.Exchange.variant;
      }
    }
  }, [widgetVariant]);

  const themeVariant: ThemeVariantType | undefined = useMemo(() => {
    if (pathname?.includes('memecoins')) {
      setWelcomeScreenClosed(true);
      //Todo: review the logic of the tab selection.
      setActiveTab(false);
      return ThemesMap.Memecoins;
    }
    // remove setWelcomeScreenClosed from array to prevent infinite re-rendering
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, setActiveTab]);

  const getActiveWidget = useCallback(() => {
    if (!starterVariantUsed) {
      switch (starterVariant) {
        case TabsMap.Exchange.variant:
          setActiveTab(TabsMap.Exchange.index);
          break;
        case TabsMap.Refuel.variant:
          setActiveTab(TabsMap.Refuel.index);
          break;
        case TabsMap.Buy.variant:
          setActiveTab(TabsMap.Buy.index);
          break;
        default:
          setActiveTab(TabsMap.Exchange.index);
      }
      setStarterVariantUsed(true);
    }
  }, [setActiveTab, starterVariant, starterVariantUsed]);

  useLayoutEffect(() => {
    getActiveWidget();
  }, [getActiveWidget, starterVariant, activeTab, themeVariant]);

  return (
    <>
      <SolanaAlert />
      <WidgetEvents />
    </>
  );
}
