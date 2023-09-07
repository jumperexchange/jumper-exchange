import { Route } from '@lifi/sdk';
import { useUserTracking } from '../../hooks';

import {
  ChainTokenSelected,
  RouteContactSupport,
  RouteExecutionUpdate,
  RouteHighValueLossUpdate,
  WidgetEvent,
  useWidgetEvents,
} from '@lifi/widget';
import { useEffect, useRef, useState } from 'react';
import { TrackingActions, TrackingCategories } from '../../const';
import { useMultisig } from '../../hooks/useMultisig';
import { useWallet } from '../../providers/WalletProvider';
import { useMenuStore, useMultisigStore } from '../../stores';
import { MultisigConfirmationModal } from '../MultisigConfirmationModal';
import { MultisigConnectedAlert } from '../MultisigConnectedAlert';

export function WidgetEvents() {
  const lastTxHashRef = useRef<string>();
  const { trackEvent, trackTransaction } = useUserTracking();
  const [onOpenSupportModal] = useMenuStore((state) => [
    state.onOpenSupportModal,
  ]);
  const widgetEvents = useWidgetEvents();
  const { isMultisigSigner, shouldOpenMultisigSignatureModal } = useMultisig();
  const [onDestinationChainSelected] = useMultisigStore((state) => [
    state.onDestinationChainSelected,
  ]);

  const { account } = useWallet();

  const [isMultiSigConfirmationModalOpen, setIsMultiSigConfirmationModalOpen] =
    useState(false);

  const [isMultisigConnectedAlertOpen, setIsMultisigConnectedAlertOpen] =
    useState(false);

  useEffect(() => {
    const onRouteExecutionStarted = async (route: Route) => {
      if (!!route.id) {
        trackEvent({
          category: TrackingCategories.WidgetEvent,
          action: TrackingActions.OnRouteExecutionStarted,
          data: {
            routeId: route.id,
            steps: route.steps,
            fromToken: route.fromToken,
            fromChainId: route.fromChainId,
            toToken: route.toToken,
            toChainId: route.toChainId,
            fromAmount: route.fromAmount,
            toAmount: route.toAmount,
          },
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

      if (!!update.process && !!update.route) {
        if (update.process.txHash !== lastTxHashRef.current) {
          lastTxHashRef.current = update.process.txHash;
          trackTransaction({
            chain: update.route.fromChainId,
            transactionHash: update.process.txHash || '',
            category: TrackingCategories.WidgetEvent,
            action: TrackingActions.OnRouteExecutionUpdated,
            data: {
              routeId: `${update.route.id}`,
              transactionLink: update.process.txLink,
              steps: update.route.steps,
              status: update.process.status,
              nonInteraction: true,
            },
          });
        }
      }
    };
    const onRouteExecutionCompleted = async (route: Route) => {
      if (!!route.id) {
        trackEvent({
          category: TrackingCategories.WidgetEvent,
          action: TrackingActions.OnRouteExecutionCompleted,
          data: {
            routeId: route.id,
            steps: route.steps,
            fromChainId: route.fromChainId,
            fromAmountUSD: route.fromAmountUSD,
            fromAmount: route.fromAmount,
            fromToken: route.fromToken,
            fromAddress: route.fromAddress,
            toChainId: route.toChainId,
            toAmountUSD: route.toAmountUSD,
            toAmount: route.toAmount,
            toAmountMin: route.toAmountMin,
            toToken: route.toToken,
          },
        });
      }
    };
    const onRouteExecutionFailed = async (update: RouteExecutionUpdate) => {
      trackEvent({
        category: TrackingCategories.WidgetEvent,
        action: TrackingActions.OnRouteExecutionFailed,
        data: {
          routeId: update.route.id,
          transactionHash: update.process.txHash,
          status: update.process.status,
          message: update.process.message,
          error: update.process.error,
          steps: update.route.steps,
        },
      });
    };

    const onRouteHighValueLoss = (update: RouteHighValueLossUpdate) => {
      trackEvent({
        action: TrackingActions.OnRouteHighValueLoss,
        category: TrackingCategories.WidgetEvent,
        label: 'click-highValueLossAccepted',
        data: {
          ...update,
          timestamp: Date.now(),
        },
      });
    };

    const onRouteContactSupport = (supportId: RouteContactSupport) => {
      onOpenSupportModal(true);
    };

    const handleMultisigChainTokenSelected = (
      destinationData: ChainTokenSelected,
    ) => {
      onDestinationChainSelected(destinationData.chainId);
    };

    widgetEvents.on(WidgetEvent.RouteExecutionStarted, onRouteExecutionStarted);
    widgetEvents.on(WidgetEvent.RouteExecutionUpdated, onRouteExecutionUpdated);
    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted,
    );
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, onRouteExecutionFailed);
    widgetEvents.on(WidgetEvent.RouteHighValueLoss, onRouteHighValueLoss);
    widgetEvents.on(WidgetEvent.RouteContactSupport, onRouteContactSupport);
    widgetEvents.on(
      WidgetEvent.DestinationChainTokenSelected,
      handleMultisigChainTokenSelected,
    );

    return () => widgetEvents.all.clear();
  }, [
    onDestinationChainSelected,
    onOpenSupportModal,
    shouldOpenMultisigSignatureModal,
    trackEvent,
    trackTransaction,
    widgetEvents,
  ]);

  const handleMultiSigConfirmationModalClose = () => {
    setIsMultiSigConfirmationModalOpen(false);
  };

  const handleMultisigWalletConnectedModalClose = () => {
    setIsMultisigConnectedAlertOpen(false);
  };

  useEffect(() => {
    setIsMultisigConnectedAlertOpen(isMultisigSigner);
  }, [account.address]);

  return (
    <>
      <MultisigConnectedAlert
        open={isMultisigConnectedAlertOpen}
        onClose={handleMultisigWalletConnectedModalClose}
      />
      <MultisigConfirmationModal
        open={isMultiSigConfirmationModalOpen}
        onClose={handleMultiSigConfirmationModalClose}
      />
    </>
  );
}
