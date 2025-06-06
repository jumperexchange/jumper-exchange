'use client';
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
} from '@lifi/widget';
import { useWidgetEvents, WidgetEvent } from '@lifi/widget';
import { useEffect, useRef, useState } from 'react';
import { shallowEqualObjects } from 'shallow-equal';
import type { JumperEventData } from 'src/hooks/useJumperTracking';
import type { TransformedRoute } from 'src/types/internal';
import { calcPriceImpact } from 'src/utils/calcPriceImpact';
import { handleTransactionDetails } from 'src/utils/routesInterpreterUtils';
import { GoldenTicketModal } from 'src/components/GoldenTicketModal/GoldenTicketModal';
import { checkWinningSwap } from '@/components/GoldenTicketModal/utils';

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

  const { account } = useAccount();

  const [isMultiSigConfirmationModalOpen, setIsMultiSigConfirmationModalOpen] =
    useState(false);

  const [isMultisigConnectedAlertOpen, setIsMultisigConnectedAlertOpen] =
    useState(false);
  const setForceRefresh = usePortfolioStore((state) => state.setForceRefresh);
  const [ticket, setTicket] = useState<{
    winner: boolean;
    position: number | null;
  }>({ winner: false, position: null });

  useEffect(() => {
    const onRouteExecutionStarted = async (route: RouteExtended) => {
      const data = handleTransactionDetails(route, {
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

    const onRouteExecutionUpdated = async (update: RouteExecutionUpdate) => {
      // check if multisig and open the modal
      const isMultisigRouteActive = shouldOpenMultisigSignatureModal(
        update.route,
      );
      if (isMultisigRouteActive) {
        setIsMultiSigConfirmationModalOpen(true);
      }
    };

    const onRouteExecutionCompleted = async (route: Route) => {
      //to do: if route is not lifi then refetch position of destination token??

      if (route.id) {
        // Refresh portfolio value
        setForceRefresh(true);

        const data = handleTransactionDetails(route, {
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

            setTicket({ winner, position });
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

    const onRouteExecutionFailed = async (update: RouteExecutionUpdate) => {
      const data = handleTransactionDetails(update.route, {
        [TrackingEventParameter.Action]: 'execution_failed',
        [TrackingEventParameter.TransactionStatus]: 'FAILED',
        [TrackingEventParameter.Message]: update.process.message || '',
        [TrackingEventParameter.ErrorMessage]:
          update.process.error?.message || '',
        [TrackingEventParameter.IsFinal]: true,
        [TrackingEventParameter.ErrorCode]: update.process.error?.code || '',
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

    const onRouteHighValueLoss = (update: RouteHighValueLossUpdate) => {
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

    const onRouteContactSupport = (supportId: ContactSupport) => {
      setSupportModalState(true);
    };

    const onMultisigChainTokenSelected = (
      destinationData: ChainTokenSelected,
    ) => {
      setDestinationChain(destinationData.chainId);
    };

    const onSourceChainTokenSelection = async (
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

    // const onWidgetExpanded = async (expanded: boolean) => {
    //   expanded &&
    //     trackEvent({
    //       category: TrackingCategory.WidgetEvent,
    //       action: TrackingAction.OnWidgetExpanded,
    //       label: `widget_expanded`,
    //       enableAddressable: true,
    //       data: {},
    //     });
    // };

    const onDestinationChainTokenSelection = async (
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

    const onLowAddressActivityConfirmed = async (props: {
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

    const onAvailableRoutes = async (availableRoutes: Route[]) => {
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
        const transformedRoutes = availableRoutes.reduce<
          Record<number, TransformedRoute>
        >((acc, route, index) => {
          const priceImpact = calcPriceImpact(route);
          acc[index] = {
            [TrackingEventParameter.NbOfSteps]: route.steps.length,
            [TrackingEventParameter.Steps]: route.steps.map(
              (step) => step.tool,
            ),
            [TrackingEventParameter.ToAmountUSD]: Number(route.toAmountUSD),
            [TrackingEventParameter.GasCostUSD]: route.steps.reduce(
              (acc, step) =>
                acc +
                (step.estimate.gasCosts?.reduce(
                  (sum, gasCost) => sum + parseFloat(gasCost.amountUSD),
                  0,
                ) || 0),
              0,
            ),
            [TrackingEventParameter.Time]: route.steps.reduce(
              (acc, step) => acc + step.estimate.executionDuration,
              0,
            ),
            [TrackingEventParameter.Slippage]: priceImpact,
          };
          return acc;
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

    // const onTokenSearch = async ({ value, tokens }: TokenSearchProps) => {
    //   const lowercaseValue = value?.toLowerCase();
    //   const { isValid, addressType } = isValidEvmOrSvmAddress(lowercaseValue);
    //   const SearchNothingFound = tokens?.length > 0 ? false : true;
    //   const tokenAddress = tokens?.length > 0 ? tokens?.[0]?.address : '';
    //   const tokenName = tokens?.length > 0 ? tokens?.[0]?.name : '';
    //   const tokenSymbol = tokens?.length > 0 ? tokens?.[0]?.symbol : '';
    //   const tokenChainId = tokens?.length > 0 ? tokens?.[0]?.chainId : '';

    //   trackEvent({
    //     category: TrackingCategory.WidgetEvent,
    //     action: TrackingAction.OnTokenSearch,
    //     label: `token_search`,
    //     data: {
    //       [TrackingEventParameter.SearchValue]: lowercaseValue,
    //       [TrackingEventParameter.SearchIsAddress]: isValid,
    //       [TrackingEventParameter.SearchAddressType]: addressType as string,
    //       [TrackingEventParameter.SearchNumberOfResult]: tokens?.length,
    //       [TrackingEventParameter.SearchNothingFound]: SearchNothingFound,
    //       [TrackingEventParameter.SearchFirstResultAddress]: tokenAddress,
    //       [TrackingEventParameter.SearchFirstResultName]: tokenName,
    //       [TrackingEventParameter.SearchFirstResultSymbol]: tokenSymbol,
    //       [TrackingEventParameter.SearchFirstResultChainId]: tokenChainId,
    //     },
    //   });
    // };

    // const onRouteSelected = async ({ route, routes }: RouteSelectedProps) => {
    //   const position = routes.findIndex((elem: Route) => elem.id === route.id);
    //   const data = handleRouteEventDetails(route, {
    //     [TrackingEventParameter.RoutePosition]: position,
    //   });

    //   trackEvent({
    //     category: TrackingCategory.WidgetEvent,
    //     action: TrackingAction.OnRouteSelected,
    //     label: `route_selected`,
    //     data,
    //   });
    // };

    widgetEvents.on(WidgetEvent.RouteExecutionStarted, onRouteExecutionStarted);
    widgetEvents.on(
      WidgetEvent.LowAddressActivityConfirmed,
      onLowAddressActivityConfirmed,
    );
    widgetEvents.on(WidgetEvent.RouteExecutionUpdated, onRouteExecutionUpdated);
    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted,
    );
    widgetEvents.on(WidgetEvent.AvailableRoutes, onAvailableRoutes);
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, onRouteExecutionFailed);
    widgetEvents.on(WidgetEvent.RouteHighValueLoss, onRouteHighValueLoss);
    widgetEvents.on(WidgetEvent.ContactSupport, onRouteContactSupport);
    widgetEvents.on(
      WidgetEvent.DestinationChainTokenSelected,
      onMultisigChainTokenSelected,
    );
    widgetEvents.on(
      WidgetEvent.SourceChainTokenSelected,
      onSourceChainTokenSelection,
    );
    widgetEvents.on(
      WidgetEvent.DestinationChainTokenSelected,
      onDestinationChainTokenSelection,
    );
    // widgetEvents.on(WidgetEvent.RouteSelected, onRouteSelected);
    // widgetEvents.on(WidgetEvent.TokenSearch, onTokenSearch);

    // widgetEvents.on(WidgetEvent.WidgetExpanded, onWidgetExpanded);

    return () => {
      widgetEvents.off(
        WidgetEvent.RouteExecutionStarted,
        onRouteExecutionStarted,
      );
      widgetEvents.off(
        WidgetEvent.RouteExecutionUpdated,
        onRouteExecutionUpdated,
      );
      widgetEvents.off(
        WidgetEvent.RouteExecutionCompleted,
        onRouteExecutionCompleted,
      );
      widgetEvents.off(
        WidgetEvent.RouteExecutionFailed,
        onRouteExecutionFailed,
      );
      widgetEvents.off(WidgetEvent.RouteHighValueLoss, onRouteHighValueLoss);
      widgetEvents.off(WidgetEvent.ContactSupport, onRouteContactSupport);
      widgetEvents.off(
        WidgetEvent.DestinationChainTokenSelected,
        onMultisigChainTokenSelected,
      );
      widgetEvents.off(
        WidgetEvent.SourceChainTokenSelected,
        onSourceChainTokenSelection,
      );
      widgetEvents.off(
        WidgetEvent.DestinationChainTokenSelected,
        onDestinationChainTokenSelection,
      );
      widgetEvents.off(
        WidgetEvent.LowAddressActivityConfirmed,
        onLowAddressActivityConfirmed,
      );
      // widgetEvents.off(WidgetEvent.WidgetExpanded, onWidgetExpanded);
      widgetEvents.off(WidgetEvent.AvailableRoutes, onAvailableRoutes);
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
      <GoldenTicketModal
        isOpen={
          Boolean(ticket.winner) ||
          Boolean(!ticket.winner && ticket.position && ticket.position > 1)
        }
        ticket={ticket}
        onClose={() => setTicket({ winner: false, position: null })}
      />
    </>
  );
}
