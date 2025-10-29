import {
  ChainTokenSelected,
  Route,
  RouteExecutionUpdate,
  RouteHighValueLossUpdate,
  SettingUpdated,
  useWidgetEvents,
} from '@lifi/widget';
import { isEqual, omit } from 'lodash';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { makePosthogTracker } from 'src/components/Widgets/PosthogTracker';
import {
  setupWidgetEvents,
  teardownWidgetEvents,
  WidgetEventsConfig,
} from 'src/components/Widgets/WidgetEventsManager';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventDataAction,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';
import { TransformedRoute } from 'src/types/internal';
import { TrackTransactionDataProps } from 'src/types/userTracking';
import { handleRouteData } from 'src/utils/routes';
import { parseWidgetSettingsToTrackingData } from 'src/utils/tracking/widget';

interface WidgetTrackingState {
  setDestinationChainTokenForTracking: (
    destinationToken: ChainTokenSelected,
  ) => void;
}

export const WidgetTrackingContext = createContext<WidgetTrackingState>({
  setDestinationChainTokenForTracking: () => {},
});

export const useWidgetTrackingContext = () => {
  const widgetTrackingContext = useContext(WidgetTrackingContext);

  if (!widgetTrackingContext) {
    throw new Error(
      'This hook must be used within the "WidgetTrackingContext" provider',
    );
  }

  return widgetTrackingContext;
};

interface WidgetTrackingProviderProps extends PropsWithChildren {
  trackingActionKeys?: {
    destinationChainAndTokenSelection?: TrackingAction;
    sourceChainAndTokenSelection: TrackingAction;
    availableRoutes: TrackingAction;
    routeExecutionStarted: TrackingAction;
    routeExecutionCompleted: TrackingAction;
    routeExecutionFailed: TrackingAction;
    changeSettings: TrackingAction;
    routeExecutionUpdated?: TrackingAction;
    routeHighValueLoss?: TrackingAction;
    lowAddressActivityConfirmed?: TrackingAction;
  };
  trackingDataActionKeys?: {
    routeExecutionStarted: TrackingEventDataAction;
    routeExecutionCompleted: TrackingEventDataAction;
    routeExecutionFailed: TrackingEventDataAction;
    routeExecutionUpdated?: TrackingEventDataAction;
  };
}

export const WidgetTrackingProvider: FC<WidgetTrackingProviderProps> = ({
  children,
  trackingActionKeys = {
    destinationChainAndTokenSelection: '',
    sourceChainAndTokenSelection:
      TrackingAction.OnSourceChainAndTokenSelectionZap,
    availableRoutes: TrackingAction.OnAvailableRoutesZap,
    routeExecutionStarted: TrackingAction.OnRouteExecutionStartedZap,
    routeExecutionCompleted: TrackingAction.OnRouteExecutionCompletedZap,
    routeExecutionFailed: TrackingAction.OnRouteExecutionFailedZap,
    changeSettings: TrackingAction.OnChangeSettingsZap,
    routeExecutionUpdated: '',
    routeHighValueLoss: '',
    lowAddressActivityConfirmed: '',
  },
  trackingDataActionKeys = {
    routeExecutionStarted: TrackingEventDataAction.ExecutionStartZap,
    routeExecutionCompleted: TrackingEventDataAction.ExecutionCompletedZap,
    routeExecutionFailed: TrackingEventDataAction.ExecutionFailedZap,
    routeExecutionUpdated: '',
  },
}) => {
  const { trackTransaction, trackEvent } = useUserTracking();
  const sourceChainToken = useRef<ChainTokenSelected | null>(null);
  const destinationChainToken = useRef<ChainTokenSelected | null>(null);
  const isRoutesForCurrentSourceTokenTracked = useRef(false);
  const isRoutesForCurrentDestinationTokenTracked = useRef(false);
  const isRoutesForCurrentFromAmountTracked = useRef(false);
  const currentFromAmount = useRef<string | null>(null);
  const trackedRoutesData = useRef<Record<string, TrackTransactionDataProps>>(
    {},
  );
  const posthogTracker = useMemo(() => {
    return makePosthogTracker({ trackTransaction, trackEvent });
  }, [trackTransaction, trackEvent]);

  const sourceChainTokenSelected = useCallback(
    (sourceToken: ChainTokenSelected) => {
      trackEvent({
        category: TrackingCategory.WidgetEvent,
        action: trackingActionKeys.sourceChainAndTokenSelection,
        label: `select_source_chain_and_token`,
        data: {
          [TrackingEventParameter.SourceChainSelection]: sourceToken.chainId,
          [TrackingEventParameter.SourceTokenSelection]:
            sourceToken.tokenAddress,
        },
        enableAddressable: true,
      });
      if (
        sourceChainToken.current?.tokenAddress !== sourceToken.tokenAddress &&
        sourceChainToken.current?.chainId !== sourceToken.chainId
      ) {
        isRoutesForCurrentSourceTokenTracked.current = false;
        sourceChainToken.current = sourceToken;
      }
    },
    [trackEvent, trackingActionKeys.sourceChainAndTokenSelection],
  );

  const availableRoutes = useCallback(
    (availableRoutes: Route[]) => {
      if (currentFromAmount.current !== availableRoutes[0]?.fromAmount) {
        currentFromAmount.current = availableRoutes[0]?.fromAmount;
        isRoutesForCurrentFromAmountTracked.current = false;
      }

      if (
        isRoutesForCurrentSourceTokenTracked.current &&
        isRoutesForCurrentDestinationTokenTracked.current &&
        isRoutesForCurrentFromAmountTracked.current
      ) {
        return;
      }

      const transformedRoutes: Record<number, TransformedRoute> =
        availableRoutes.reduce((acc, route, index) => {
          const routeData = handleRouteData(route);
          const transformedRoute: TransformedRoute = {
            [TrackingEventParameter.NbOfSteps]:
              routeData[TrackingEventParameter.NbOfSteps] || 0,
            [TrackingEventParameter.Steps]: {
              tools: routeData[TrackingEventParameter.Steps],
            },
            [TrackingEventParameter.ToAmount]:
              routeData[TrackingEventParameter.ToAmount] || '',
            [TrackingEventParameter.ToAmountUSD]:
              Number(routeData[TrackingEventParameter.ToAmountUSD]) || 0,
            [TrackingEventParameter.GasCostUSD]:
              Number(routeData[TrackingEventParameter.GasCostUSD]) || null,
            [TrackingEventParameter.Time]:
              routeData[TrackingEventParameter.Time] || 0,
            [TrackingEventParameter.Slippage]:
              routeData[TrackingEventParameter.Slippage] || 0,
          };

          return {
            ...acc,
            [index]: transformedRoute,
          };
        }, {});

      trackEvent({
        category: TrackingCategory.WidgetEvent,
        action: trackingActionKeys.availableRoutes,
        label: `routes_available`,
        enableAddressable: true,
        data: {
          [TrackingEventParameter.FromToken]:
            sourceChainToken.current?.tokenAddress || '',
          [TrackingEventParameter.FromChainId]:
            sourceChainToken.current?.chainId || '',
          [TrackingEventParameter.ToToken]:
            destinationChainToken.current?.tokenAddress || '',
          [TrackingEventParameter.ToChainId]:
            destinationChainToken.current?.chainId || '',
          [TrackingEventParameter.FromAmountUSD]: Number(
            availableRoutes?.[0]?.fromAmountUSD,
          ),
          [TrackingEventParameter.FromAmount]: availableRoutes?.[0]?.fromAmount,
          [TrackingEventParameter.NbOfSteps]: availableRoutes.length,
          [TrackingEventParameter.Routes]: transformedRoutes,
        },
      });

      isRoutesForCurrentSourceTokenTracked.current = true;
      isRoutesForCurrentDestinationTokenTracked.current = true;
      isRoutesForCurrentFromAmountTracked.current = true;
    },
    [trackEvent, trackingActionKeys.availableRoutes],
  );

  const routeExecutionStarted = useCallback(
    (route: Route) => {
      if (route.id) {
        const routeData = handleRouteData(route, {
          [TrackingEventParameter.Action]:
            trackingDataActionKeys.routeExecutionStarted,
          [TrackingEventParameter.TransactionStatus]: 'STARTED',
        });

        trackedRoutesData.current[route.id] = routeData;

        trackTransaction({
          category: TrackingCategory.WidgetEvent,
          action: trackingActionKeys.routeExecutionStarted,
          label: 'execution_start',
          data: routeData,
          enableAddressable: true,
        });
      }
    },
    [
      trackTransaction,
      trackingActionKeys.routeExecutionStarted,
      trackingDataActionKeys.routeExecutionStarted,
    ],
  );

  const routeExecutionUpdated = useCallback(
    (update: RouteExecutionUpdate) => {
      if (
        !trackingActionKeys.routeExecutionUpdated ||
        !trackingDataActionKeys.routeExecutionUpdated
      ) {
        return;
      }
      const updatedRouteData = handleRouteData(update.route, {
        [TrackingEventParameter.Action]:
          trackingDataActionKeys.routeExecutionUpdated,
        [TrackingEventParameter.TransactionStatus]: 'UPDATED',
      });
      const routeData = trackedRoutesData.current[update.route.id];
      const shouldTrack = !isEqual(
        omit(routeData, [
          TrackingEventParameter.TransactionStatus,
          TrackingEventParameter.IsFinal,
          TrackingEventParameter.Action,
        ]),
        omit(updatedRouteData, [
          TrackingEventParameter.TransactionStatus,
          TrackingEventParameter.IsFinal,
          TrackingEventParameter.Action,
        ]),
      );
      if (!shouldTrack) {
        return;
      }
      trackedRoutesData.current[update.route.id] = updatedRouteData;

      trackTransaction({
        category: TrackingCategory.WidgetEvent,
        action: trackingActionKeys.routeExecutionUpdated,
        label: `execution_updated`,
        data: routeData,
        enableAddressable: true,
      });
    },
    [
      trackTransaction,
      trackingActionKeys.routeExecutionUpdated,
      trackingDataActionKeys.routeExecutionUpdated,
    ],
  );

  const routeExecutionCompleted = useCallback(
    (route: Route) => {
      delete trackedRoutesData.current[route.id];

      trackTransaction({
        category: TrackingCategory.WidgetEvent,
        action: trackingActionKeys.routeExecutionCompleted,
        label: 'execution_success',
        data: handleRouteData(route, {
          [TrackingEventParameter.Action]:
            trackingDataActionKeys.routeExecutionCompleted,
          [TrackingEventParameter.TransactionStatus]: 'COMPLETED',
        }),
        enableAddressable: true,
        isConversion: true,
      });
    },
    [
      trackTransaction,
      trackingActionKeys.routeExecutionCompleted,
      trackingDataActionKeys.routeExecutionCompleted,
    ],
  );

  const routeExecutionFailed = useCallback(
    (update: RouteExecutionUpdate) => {
      trackTransaction({
        category: TrackingCategory.WidgetEvent,
        action: trackingActionKeys.routeExecutionFailed,
        label: 'execution_error',
        data: handleRouteData(update.route, {
          [TrackingEventParameter.Action]:
            trackingDataActionKeys.routeExecutionFailed,
          [TrackingEventParameter.TransactionStatus]: 'FAILED',
          [TrackingEventParameter.Message]: update.process.message || '',
          [TrackingEventParameter.IsFinal]: true,
        }),
        enableAddressable: true,
      });
    },
    [
      trackTransaction,
      trackingActionKeys.routeExecutionFailed,
      trackingDataActionKeys.routeExecutionFailed,
    ],
  );

  const settingUpdated = useCallback(
    (settings: SettingUpdated) => {
      trackEvent({
        category: TrackingCategory.WidgetEvent,
        action: trackingActionKeys.changeSettings,
        label: 'change_settings',
        enableAddressable: true,
        data: parseWidgetSettingsToTrackingData(settings),
      });
    },
    [trackEvent, trackingActionKeys.changeSettings],
  );

  const routeHighValueLoss = useCallback(
    (update: RouteHighValueLossUpdate) => {
      if (!trackingActionKeys.routeHighValueLoss) {
        return;
      }
      trackEvent({
        action: trackingActionKeys.routeHighValueLoss,
        category: TrackingCategory.WidgetEvent,
        label: 'click_high_value_loss_accepted',
        data: {
          [TrackingEventParameter.FromAmountUSD]: update.fromAmountUSD,
          [TrackingEventParameter.ToAmountUSD]: update.toAmountUSD,
          [TrackingEventParameter.GasCostUSD]: update.gasCostUSD || '',
          [TrackingEventParameter.FeeCostUSD]: update.feeCostUSD || '',
          [TrackingEventParameter.ValueLoss]: update.valueLoss,
          [TrackingEventParameter.Timestamp]: new Date(
            Date.now(),
          ).toUTCString(),
        },
        enableAddressable: true,
      });
    },
    [trackEvent, trackingActionKeys.routeHighValueLoss],
  );

  const lowAddressActivityConfirmed = useCallback(
    (props: { address: string; chainId: number }) => {
      if (!trackingActionKeys.lowAddressActivityConfirmed) {
        return;
      }
      trackEvent({
        category: TrackingCategory.WidgetEvent,
        action: trackingActionKeys.lowAddressActivityConfirmed,
        label: `confirm_low_address_activity_confirmed`,
        data: {
          [TrackingEventParameter.WalletAddress]: props.address,
          [TrackingEventParameter.ChainId]: props.chainId,
        },
        enableAddressable: true,
      });
    },
    [trackEvent, trackingActionKeys.lowAddressActivityConfirmed],
  );

  const destinationChainTokenSelected = useCallback(
    (toChainData: ChainTokenSelected) => {
      if (!trackingActionKeys.destinationChainAndTokenSelection) {
        return;
      }
      trackEvent({
        category: TrackingCategory.WidgetEvent,
        action: trackingActionKeys.destinationChainAndTokenSelection,
        label: `select_destination_chain_and_token`,
        data: {
          [TrackingEventParameter.DestinationChainSelection]:
            toChainData.chainId,
          [TrackingEventParameter.DestinationTokenSelection]:
            toChainData.tokenAddress,
        },
        enableAddressable: true,
      });
      destinationChainToken.current = toChainData;
      isRoutesForCurrentDestinationTokenTracked.current = false;
    },
    [trackEvent, trackingActionKeys.destinationChainAndTokenSelection],
  );

  const setDestinationChainTokenForTracking = useCallback(
    (destinationToken: ChainTokenSelected) => {
      destinationChainToken.current = destinationToken;
      isRoutesForCurrentDestinationTokenTracked.current = false;
    },
    [],
  );

  const widgetEvents = useWidgetEvents();

  useEffect(() => {
    const config: WidgetEventsConfig = {
      sourceChainTokenSelected,
      destinationChainTokenSelected,
      availableRoutes,
      routeExecutionStarted,
      routeExecutionUpdated,
      routeExecutionCompleted,
      routeExecutionFailed,
      settingUpdated,
      routeHighValueLoss,
      lowAddressActivityConfirmed,
      routeSelected: posthogTracker.onRouteSelected,
      chainPinned: posthogTracker.onChainPinned,
    };

    setupWidgetEvents(config, widgetEvents);

    return () => {
      teardownWidgetEvents(config, widgetEvents);
    };
  }, [
    widgetEvents,
    sourceChainTokenSelected,
    availableRoutes,
    routeExecutionStarted,
    routeExecutionUpdated,
    routeExecutionCompleted,
    routeExecutionFailed,
    settingUpdated,
    destinationChainTokenSelected,
    routeHighValueLoss,
    lowAddressActivityConfirmed,
    posthogTracker.onRouteSelected,
    posthogTracker.onChainPinned,
  ]);

  const value = useMemo(
    () => ({
      setDestinationChainTokenForTracking,
    }),
    [setDestinationChainTokenForTracking],
  );

  return (
    <WidgetTrackingContext.Provider value={value}>
      {children}
    </WidgetTrackingContext.Provider>
  );
};
