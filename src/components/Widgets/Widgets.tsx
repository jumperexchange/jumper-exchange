'use client';
import { SolanaAlert } from '@/components/Alerts';
import { LinkMap } from '@/const/linkMap';
import { TabsMap } from '@/const/tabsMap';
import { useSession } from '@/hooks/useSession';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';
import { useActiveTabStore } from '@/stores/activeTab';
import type { StarterVariantType } from '@/types/internal';
import type { WidgetSubvariant } from '@lifi/widget';
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
  const [_starterVariant, setStarterVariant] = useState<
    WidgetSubvariant | 'buy'
  >(TabsMap.Exchange.variant);

  // testing! todo: remove
  const sessionID = useSession();
  console.log('sessionId', sessionID);

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
      setStarterVariant(starterVariant);
      setStarterVariantUsed(true);
    } else {
      switch (activeTab) {
        case TabsMap.Exchange.index:
          setStarterVariant(TabsMap.Exchange.variant);
          break;
        case TabsMap.Refuel.index:
          setStarterVariant(TabsMap.Refuel.variant);
          break;
        case TabsMap.Buy.index:
          setStarterVariant(TabsMap.Buy.variant);
          break;
        default:
          setStarterVariant(TabsMap.Exchange.variant);
      }
    }
  }, [activeTab, setActiveTab, starterVariant, starterVariantUsed]);

  useLayoutEffect(() => {
    getActiveWidget();
  }, [getActiveWidget, starterVariant, activeTab]);

  return (
    <>
      <SolanaAlert />
      <WidgetEvents />
    </>
  );
}
