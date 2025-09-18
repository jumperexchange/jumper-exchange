'use client';
import { checkWinningSwap } from '@/components/GoldenRouteModal/utils';
import { MultisigConfirmationModal } from '@/components/MultisigConfirmationModal';
import { MultisigConnectedAlert } from '@/components/MultisigConnectedAlert';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useMultisig } from '@/hooks/useMultisig';
import { useUserTracking } from '@/hooks/userTracking';
import { useActiveTabStore } from '@/stores/activeTab';
import { useChainTokenSelectionStore } from '@/stores/chainTokenSelection';
import { useMenuStore } from '@/stores/menu';
import { useMultisigStore } from '@/stores/multisig';
import { usePortfolioStore } from '@/stores/portfolio';
import type { RouteExtended } from '@lifi/sdk';
import { type Route } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import type {
  ChainTokenSelected,
  ContactSupport,
  RouteExecutionUpdate,
  RouteHighValueLossUpdate,
  SettingUpdated,
} from '@lifi/widget';
import { useWidgetEvents } from '@lifi/widget';
import { useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqualObjects } from 'shallow-equal';
import { GoldenRouteModal } from 'src/components/GoldenRouteModal/GoldenRouteModal';
import type { JumperEventData } from 'src/hooks/useJumperTracking';
import { useContributionStore } from 'src/stores/contribution/ContributionStore';
import { useRouteStore } from 'src/stores/route/RouteStore';
import { TransformedRoute } from 'src/types/internal';
import { handleRouteData } from 'src/utils/routes';
import { parseWidgetSettingsToTrackingData } from 'src/utils/tracking/widget';
import { makePosthogTracker } from './PosthogTracker';
import {
  setupWidgetEvents,
  teardownWidgetEvents,
  WidgetEventsConfig,
} from './WidgetEventsManager';

export function WidgetEvents() {
  const previousRoutesRef = useRef<JumperEventData>({});
  const { activeTab } = useActiveTabStore();
  const {
    sourceChainToken,
    destinationChainToken,
    setDestinationChainToken,
    setSourceChainToken,
  } = useChainTokenSelectionStore();
  const { trackTransaction, trackEvent } = useUserTracking();
  const [setSupportModalState] = useMenuStore((state) => [
    state.setSupportModalState,
  ]);
  const widgetEvents = useWidgetEvents();
  const { isMultisigSigner, shouldOpenMultisigSignatureModal } = useMultisig();
  const [setDestinationChain] = useMultisigStore((state) => [
    state.setDestinationChain,
  ]);
  const setCompletedRoute = useRouteStore((state) => state.setCompletedRoute);

  const { account } = useAccount();

  const [isMultiSigConfirmationModalOpen, setIsMultiSigConfirmationModalOpen] =
    useState(false);

  const [isMultisigConnectedAlertOpen, setIsMultisigConnectedAlertOpen] =
    useState(false);
  const setForceRefresh = usePortfolioStore((state) => state.setForceRefresh);
  const [route, setRoute] = useState<{
    winner: boolean;
    position: number | null;
  }>({ winner: false, position: null });

  const { setContributed, setContributionDisplayed } = useContributionStore(
    (state) => state,
  );

  const posthogTracker = useMemo(() => {
    return makePosthogTracker({ trackTransaction, trackEvent });
  }, [trackTransaction, trackEvent]);

  useEffect(() => {
    const routeExecutionStarted = async (route: RouteExtended) => {
      const data = handleRouteData(route, {
        [TrackingEventParameter.Action]: 'execution_start',
        [TrackingEventParameter.TransactionStatus]: 'STARTED',
      });
      if (route.id) {
        trackTransaction({
          category: TrackingCategory.WidgetEvent,
          action: TrackingAction.OnRouteExecutionStarted,
          label: 'execution_start',
          data,
          enableAddressable: true,
        });
      }
    };

    const routeExecutionUpdated = async (update: RouteExecutionUpdate) => {
      // check if multisig and open the modal
      const isMultisigRouteActive = shouldOpenMultisigSignatureModal(
        update.route,
      );
      if (isMultisigRouteActive) {
        setIsMultiSigConfirmationModalOpen(true);
      }
    };

    const routeExecutionCompleted = async (route: RouteExtended) => {
      //to do: if route is not lifi then refetch position of destination token??

      if (route.id) {
        // Store the completed route
        setCompletedRoute(route);

        // Refresh portfolio value
        setForceRefresh(true);
        const data = handleRouteData(route, {
          [TrackingEventParameter.Action]: 'execution_completed',
          [TrackingEventParameter.TransactionStatus]: 'COMPLETED',
        });

        const txStatus = data.param_transaction_status;
        if (account?.address) {
          if (txStatus !== 'COMPLETED') {
            return;
          }

          const txHash = data.param_transaction_hash;

          if (txHash) {
            const { winner, position } = await checkWinningSwap({
              txHash,
              userAddress: account.address,
              fromChainId: route.fromChainId,
              toChainId: route.toChainId,
              fromToken: {
                address: route.fromToken.address,
                symbol: route.fromToken.symbol,
                decimals: route.fromToken.decimals,
              },
              toToken: {
                address: route.toToken.address,
                symbol: route.toToken.symbol,
                decimals: route.toToken.decimals,
              },
              fromAmount: route.fromAmount,
            });

            setRoute({ winner, position });
          }
        }

        // reset ref obj
        previousRoutesRef.current = {};
        trackTransaction({
          category: TrackingCategory.WidgetEvent,
          action: TrackingAction.OnRouteExecutionCompleted,
          label: 'execution_success',
          data,
          enableAddressable: true,
          isConversion: true,
        });
      }
    };

    const routeExecutionFailed = async (update: RouteExecutionUpdate) => {
      const data = handleRouteData(update.route, {
        [TrackingEventParameter.Action]: 'execution_failed',
        [TrackingEventParameter.TransactionStatus]: 'FAILED',
        [TrackingEventParameter.Message]: update.process.message || '',
        [TrackingEventParameter.IsFinal]: true,
      });
      // reset ref obj
      previousRoutesRef.current = {};
      trackTransaction({
        category: TrackingCategory.WidgetEvent,
        action: TrackingAction.OnRouteExecutionFailed,
        label: 'execution_error',
        data,
        enableAddressable: true,
      });
    };

    const routeHighValueLoss = (update: RouteHighValueLossUpdate) => {
      trackEvent({
        action: TrackingAction.OnRouteHighValueLoss,
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
    };

    const contactSupport = (supportId: ContactSupport) => {
      setSupportModalState(true);
    };

    const sourceChainTokenSelected = async (
      sourceChainData: ChainTokenSelected,
    ) => {
      trackEvent({
        category: TrackingCategory.WidgetEvent,
        action: TrackingAction.OnSourceChainAndTokenSelection,
        label: `select_source_chain_and_token`,
        data: {
          [TrackingEventParameter.SourceChainSelection]:
            sourceChainData.chainId,
          [TrackingEventParameter.SourceTokenSelection]:
            sourceChainData.tokenAddress,
        },
        enableAddressable: true,
      });
      setSourceChainToken(sourceChainData);
    };

    const destinationChainTokenSelectedMultisig = (
      destinationData: ChainTokenSelected,
    ) => {
      setDestinationChain(destinationData.chainId);
    };

    const destinationChainTokenSelectedRaw = async (
      toChainData: ChainTokenSelected,
    ) => {
      trackEvent({
        category: TrackingCategory.WidgetEvent,
        action: TrackingAction.OnDestinationChainAndTokenSelection,
        label: `select_destination_chain_and_token`,
        data: {
          [TrackingEventParameter.DestinationChainSelection]:
            toChainData.chainId,
          [TrackingEventParameter.DestinationTokenSelection]:
            toChainData.tokenAddress,
        },
        enableAddressable: true,
      });
      setDestinationChainToken(toChainData);
    };

    const destinationChainTokenSelected = async (
      destinationData: ChainTokenSelected,
    ) => {
      destinationChainTokenSelectedMultisig(destinationData);
      destinationChainTokenSelectedRaw(destinationData);
    };

    const lowAddressActivityConfirmed = async (props: {
      address: string;
      chainId: number;
    }) => {
      trackEvent({
        category: TrackingCategory.WidgetEvent,
        action: TrackingAction.OnLowAddressActivityConfirmed,
        label: `confirm_low_address_activity_confirmed`,
        data: {
          [TrackingEventParameter.WalletAddress]: props.address,
          [TrackingEventParameter.ChainId]: props.chainId,
        },
        enableAddressable: true,
      });
    };

    const availableRoutes = async (availableRoutes: Route[]) => {
      // current available routes
      const newObj: JumperEventData = {
        [TrackingEventParameter.FromToken]: sourceChainToken.tokenAddress || '',
        [TrackingEventParameter.FromChainId]: sourceChainToken.chainId || '',
        [TrackingEventParameter.ToToken]:
          destinationChainToken.tokenAddress || '',
        [TrackingEventParameter.ToChainId]: destinationChainToken.chainId || '',
      };

      // compare current availableRoutes with the previous one
      const isSameObject = shallowEqualObjects(
        previousRoutesRef.current,
        newObj,
      );
      // if the object has changed, then track the event
      if (
        !isSameObject &&
        previousRoutesRef.current &&
        sourceChainToken.chainId &&
        sourceChainToken.tokenAddress &&
        destinationChainToken.chainId &&
        destinationChainToken.tokenAddress
      ) {
        previousRoutesRef.current = newObj;

        // Transform routes to the expected format
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
          action: TrackingAction.OnAvailableRoutes,
          label: `routes_available`,
          enableAddressable: true,
          data: {
            ...newObj,
            [TrackingEventParameter.FromAmountUSD]: Number(
              availableRoutes?.[0]?.fromAmountUSD,
            ),
            [TrackingEventParameter.NbOfSteps]: availableRoutes.length,
            [TrackingEventParameter.Routes]: transformedRoutes,
          },
        });
      }
    };

    const settingUpdated = (settings: SettingUpdated) => {
      trackEvent({
        category: TrackingCategory.WidgetEvent,
        action: TrackingAction.OnChangeSettings,
        label: 'change_settings',
        enableAddressable: true,
        data: parseWidgetSettingsToTrackingData(settings),
      });
    };

    const pageEntered = async (pageType: unknown) => {
      // Reset contribution state when entering a new page
      setContributed(false);
      setContributionDisplayed(false);
    };

    const config: WidgetEventsConfig = {
      routeExecutionStarted,
      routeExecutionUpdated,
      routeExecutionCompleted,
      routeExecutionFailed,
      routeHighValueLoss,
      contactSupport,
      sourceChainTokenSelected,
      destinationChainTokenSelected,
      lowAddressActivityConfirmed,
      availableRoutes,
      settingUpdated,
      pageEntered,
      routeSelected: posthogTracker.onRouteSelected,
      chainPinned: posthogTracker.onChainPinned,
    };

    setupWidgetEvents(config, widgetEvents);

    return () => {
      teardownWidgetEvents(config, widgetEvents);
    };
  }, [
    activeTab,
    destinationChainToken.chainId,
    destinationChainToken.tokenAddress,
    setDestinationChain,
    setDestinationChainToken,
    setSourceChainToken,
    setSupportModalState,
    shouldOpenMultisigSignatureModal,
    sourceChainToken,
    trackEvent,
    trackTransaction,
    widgetEvents,
    setCompletedRoute,
    setContributed,
    setContributionDisplayed,
  ]);

  const onMultiSigConfirmationModalClose = () => {
    setIsMultiSigConfirmationModalOpen(false);
  };

  const handleMultisigWalletConnectedModalClose = () => {
    setIsMultisigConnectedAlertOpen(false);
  };

  useEffect(() => {
    setIsMultisigConnectedAlertOpen(isMultisigSigner);
    // prevent endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.address]);

  return (
    <>
      <MultisigConnectedAlert
        open={isMultisigConnectedAlertOpen}
        onClose={handleMultisigWalletConnectedModalClose}
      />
      <MultisigConfirmationModal
        open={isMultiSigConfirmationModalOpen}
        onClose={onMultiSigConfirmationModalClose}
      />
      <GoldenRouteModal
        isOpen={
          Boolean(route.winner) ||
          Boolean(!route.winner && route.position && route.position > 1)
        }
        route={route}
        onClose={() => setRoute({ winner: false, position: null })}
      />
    </>
  );
}
