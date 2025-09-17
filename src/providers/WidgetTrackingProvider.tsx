import {
  ChainTokenSelected,
  Route,
  RouteExecutionUpdate,
  SettingUpdated,
  useWidgetEvents,
} from '@lifi/widget';
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
    sourceChainAndTokenSelection: TrackingAction;
    availableRoutes: TrackingAction;
    routeExecutionStarted: TrackingAction;
    routeExecutionCompleted: TrackingAction;
    routeExecutionFailed: TrackingAction;
    changeSettings: TrackingAction;
  };
  trackingDataActionKeys?: {
    routeExecutionStarted: TrackingEventDataAction;
    routeExecutionCompleted: TrackingEventDataAction;
    routeExecutionFailed: TrackingEventDataAction;
  };
}

export const WidgetTrackingProvider: FC<WidgetTrackingProviderProps> = ({
  children,
  trackingActionKeys = {
    sourceChainAndTokenSelection:
      TrackingAction.OnSourceChainAndTokenSelectionZap,
    availableRoutes: TrackingAction.OnAvailableRoutesZap,
    routeExecutionStarted: TrackingAction.OnRouteExecutionStartedZap,
    routeExecutionCompleted: TrackingAction.OnRouteExecutionCompletedZap,
    routeExecutionFailed: TrackingAction.OnRouteExecutionFailedZap,
    changeSettings: TrackingAction.OnChangeSettingsZap,
  },
  trackingDataActionKeys = {
    routeExecutionStarted: TrackingEventDataAction.ExecutionStartZap,
    routeExecutionCompleted: TrackingEventDataAction.ExecutionCompletedZap,
    routeExecutionFailed: TrackingEventDataAction.ExecutionFailedZap,
  },
}) => {
  const { trackTransaction, trackEvent } = useUserTracking();
  const sourceChainToken = useRef<ChainTokenSelected | null>(null);
  const destinationChainToken = useRef<ChainTokenSelected | null>(null);
  const isRoutesForCurrentSourceTokenTracked = useRef(false);
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
      if (isRoutesForCurrentSourceTokenTracked.current) {
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
          [TrackingEventParameter.NbOfSteps]: availableRoutes.length,
          [TrackingEventParameter.Routes]: transformedRoutes,
        },
      });

      isRoutesForCurrentSourceTokenTracked.current = true;
    },
    [trackEvent, trackingActionKeys.availableRoutes],
  );

  const routeExecutionStarted = useCallback(
    (route: Route) => {
      if (route.id) {
        trackTransaction({
          category: TrackingCategory.WidgetEvent,
          action: trackingActionKeys.routeExecutionStarted,
          label: 'execution_start',
          data: handleRouteData(route, {
            [TrackingEventParameter.Action]:
              trackingDataActionKeys.routeExecutionStarted,
            [TrackingEventParameter.TransactionStatus]: 'STARTED',
          }),
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

  const routeExecutionCompleted = useCallback(
    (route: Route) => {
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

  const setDestinationChainTokenForTracking = useCallback(
    (destinationToken: ChainTokenSelected) => {
      destinationChainToken.current = destinationToken;
    },
    [],
  );

  const widgetEvents = useWidgetEvents();

  useEffect(() => {
    const config: WidgetEventsConfig = {
      sourceChainTokenSelected,
      availableRoutes,
      routeExecutionStarted,
      routeExecutionCompleted,
      routeExecutionFailed,
      settingUpdated,
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
    routeExecutionCompleted,
    routeExecutionFailed,
    settingUpdated,
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
