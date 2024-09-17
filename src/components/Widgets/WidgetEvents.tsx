'use client';
import { MultisigConfirmationModal } from '@/components/MultisigConfirmationModal';
import { MultisigConnectedAlert } from '@/components/MultisigConnectedAlert';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useAccounts } from '@/hooks/useAccounts';
import { useMultisig } from '@/hooks/useMultisig';
import { useUserTracking } from '@/hooks/userTracking';
import { useActiveTabStore } from '@/stores/activeTab';
import { useChainTokenSelectionStore } from '@/stores/chainTokenSelection';
import { useMenuStore } from '@/stores/menu';
import { useMultisigStore } from '@/stores/multisig';
import type { ChainId, RouteExtended } from '@lifi/sdk';
import { type Route } from '@lifi/sdk';
import type {
  ChainTokenSelected,
  ContactSupport,
  RouteExecutionUpdate,
  RouteHighValueLossUpdate,
} from '@lifi/widget';
import { WidgetEvent, useWidgetEvents } from '@lifi/widget';
import { useEffect, useRef, useState } from 'react';
import { shallowEqualObjects } from 'shallow-equal';
import { handleTransactionDetails } from 'src/utils/routesInterpreterUtils';

interface PreviousRoutesRefProps {
  [TrackingEventParameter.AvailableRoutesCount]: number | undefined;
  [TrackingEventParameter.FromToken]: string | undefined;
  [TrackingEventParameter.FromChainId]: ChainId | undefined;
  [TrackingEventParameter.ToToken]: string | undefined;
  [TrackingEventParameter.ToChainId]: ChainId | undefined;
  [TrackingEventParameter.TxHash]?: string;
}

export function WidgetEvents() {
  const previousRoutesRef = useRef<PreviousRoutesRefProps | null>(null);
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

  const { account } = useAccounts();

  const [isMultiSigConfirmationModalOpen, setIsMultiSigConfirmationModalOpen] =
    useState(false);

  const [isMultisigConnectedAlertOpen, setIsMultisigConnectedAlertOpen] =
    useState(false);

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
      const data = handleTransactionDetails(update.route, {
        [TrackingEventParameter.Action]: 'execution_updated',
      });
      const isMultisigRouteActive = shouldOpenMultisigSignatureModal(
        update.route,
      );

      if (isMultisigRouteActive) {
        setIsMultiSigConfirmationModalOpen(true);
      }

      if (update.process && update.route) {
        if (
          previousRoutesRef.current &&
          update.process.txHash !==
            previousRoutesRef.current[TrackingEventParameter.TxHash]
        ) {
          previousRoutesRef.current[TrackingEventParameter.TxHash] =
            update.process.txHash;
          // trackTransaction({
          //   category: TrackingCategory.WidgetEvent,
          //   action: TrackingAction.OnRouteExecutionUpdated,
          //   label: 'execution_update',
          //   data,
          //   enableAddressable: true,
          // });
        }
      }
    };
    const onRouteExecutionCompleted = async (route: Route) => {
      if (route.id) {
        const data = handleTransactionDetails(route, {
          [TrackingEventParameter.Action]: 'execution_completed',
          [TrackingEventParameter.TransactionStatus]: 'COMPLETED',
        });
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

    const onAvailableRoutes = async (availableRoutes: Route[]) => {
      // previous available routes
      const prevRefObj = previousRoutesRef.current;
      delete prevRefObj?.[TrackingEventParameter.TxHash];
      // current available routes
      const newObj = {
        totalRoutes: availableRoutes.length,
        fromToken: sourceChainToken.tokenAddress,
        fromChain: sourceChainToken.chainId,
        toToken: destinationChainToken.tokenAddress,
        toChain: destinationChainToken.chainId,
      };

      // compare current availableRoutes with the previous one
      const isSameObject = shallowEqualObjects(prevRefObj, newObj);
      if (!isSameObject && previousRoutesRef.current) {
        previousRoutesRef.current[TrackingEventParameter.AvailableRoutesCount] =
          availableRoutes.length;
        previousRoutesRef.current[TrackingEventParameter.FromChainId] =
          sourceChainToken.chainId;
        previousRoutesRef.current[TrackingEventParameter.FromToken] =
          sourceChainToken.tokenAddress;
        previousRoutesRef.current[TrackingEventParameter.ToChainId] =
          destinationChainToken.chainId;
        previousRoutesRef.current[TrackingEventParameter.ToToken] =
          destinationChainToken.tokenAddress;
        trackEvent({
          category: TrackingCategory.WidgetEvent,
          action: TrackingAction.OnAvailableRoutes,
          label: `routes_available`,
          enableAddressable: true,
          data: {
            [TrackingEventParameter.AvailableRoutesCount]:
              availableRoutes.length,
            ...((previousRoutesRef.current[
              TrackingEventParameter.FromChainId
            ] ||
              previousRoutesRef.current[TrackingEventParameter.FromToken] ||
              previousRoutesRef.current[TrackingEventParameter.ToToken] ||
              previousRoutesRef.current[TrackingEventParameter.ToChainId]) && {
              [TrackingEventParameter.FromToken]:
                previousRoutesRef.current[TrackingEventParameter.FromToken],
              [TrackingEventParameter.FromChainId]:
                previousRoutesRef.current[TrackingEventParameter.FromChainId],
              [TrackingEventParameter.ToChainId]:
                previousRoutesRef.current[TrackingEventParameter.ToChainId],
              [TrackingEventParameter.ToToken]:
                previousRoutesRef.current[TrackingEventParameter.ToToken],
            }),
          },
        });
      }
    };
    widgetEvents.on(WidgetEvent.RouteExecutionStarted, onRouteExecutionStarted);
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
    </>
  );
}
