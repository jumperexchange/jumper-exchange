'use client';
import { ChainAlert } from '@/components/Alerts';
import { LinkMap } from '@/const/linkMap';
import { TabsMap } from '@/const/tabsMap';
import { useActiveTabStore } from '@/stores/activeTab';
import type { StarterVariantType } from '@/types/internal';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { PartnerThemeFooterImage } from '../PartnerThemeFooterImage';
import { WidgetEvents } from './WidgetEvents';
import {
  TrackingAction,
  TrackingEventDataAction,
} from 'src/const/trackingKeys';
import { WidgetTrackingProvider } from 'src/providers/WidgetTrackingProvider';
import { AB_TEST_NAME, AbTests } from '@/const/abtests';
import { useABTest } from '@/hooks/useABTest';
import { useAccount } from '@lifi/wallet-management';

interface WidgetsProps {
  widgetVariant: StarterVariantType;
}

export function Widgets({ widgetVariant }: WidgetsProps) {
  const { activeTab, setActiveTab } = useActiveTabStore();
  const [starterVariantUsed, setStarterVariantUsed] = useState(false);

  const { account } = useAccount();
  const tradeABTest = useABTest({
    feature: AB_TEST_NAME.A_B_TEST_TRADE_DISPLAY,
    address: account?.address ?? '',
  });

  const starterVariant: StarterVariantType = useMemo(() => {
    if (widgetVariant) {
      return widgetVariant;
    } else {
      const url = window?.location.pathname.slice(1);
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
      setStarterVariantUsed(true);
    }
  }, [setActiveTab, starterVariant, starterVariantUsed]);

  useLayoutEffect(() => {
    getActiveWidget();
  }, [getActiveWidget, starterVariant, activeTab]);

  return (
    <>
      <ChainAlert />
      <PartnerThemeFooterImage />
      <WidgetTrackingProvider
        trackingActionKeys={{
          destinationChainAndTokenSelection:
            TrackingAction.OnDestinationChainAndTokenSelection,
          sourceChainAndTokenSelection:
            TrackingAction.OnSourceChainAndTokenSelection,
          availableRoutes: TrackingAction.OnAvailableRoutes,
          routeExecutionStarted: TrackingAction.OnRouteExecutionStarted,
          routeExecutionUpdated: TrackingAction.OnRouteExecutionUpdated,
          routeExecutionCompleted: TrackingAction.OnRouteExecutionCompleted,
          routeExecutionFailed: TrackingAction.OnRouteExecutionFailed,
          changeSettings: TrackingAction.OnChangeSettings,
          routeHighValueLoss: TrackingAction.OnRouteHighValueLoss,
          lowAddressActivityConfirmed:
            TrackingAction.OnLowAddressActivityConfirmed,
          sendToWalletToggled: TrackingAction.OnSendToWalletToggled,
          formFieldChanged: TrackingAction.OnFormFieldChanged,
        }}
        trackingDataActionKeys={{
          routeExecutionStarted: TrackingEventDataAction.ExecutionStart,
          routeExecutionUpdated: TrackingEventDataAction.ExecutionUpdated,
          routeExecutionCompleted: TrackingEventDataAction.ExecutionCompleted,
          routeExecutionFailed: TrackingEventDataAction.ExecutionFailed,
        }}
        trackingDataProperties={{
          routeExecutionCompleted: {
            abTestVariants: {
              [AbTests[AB_TEST_NAME.A_B_TEST_TRADE_DISPLAY].name]:
                tradeABTest.value,
            },
          },
          routeExecutionStarted: {
            abTestVariants: {
              [AbTests[AB_TEST_NAME.A_B_TEST_TRADE_DISPLAY].name]:
                tradeABTest.value,
            },
          },
        }}
      >
        <WidgetEvents />
      </WidgetTrackingProvider>
    </>
  );
}
