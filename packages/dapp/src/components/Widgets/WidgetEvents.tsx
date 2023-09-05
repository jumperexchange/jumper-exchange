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
import {
  TrackingActions,
  TrackingCategories,
  TrackingEventParameters,
} from '../../const';
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
          label: 'execution-start',
          data: {
            [TrackingEventParameters.RouteId]: route.id,
            [TrackingEventParameters.Steps]: route.steps,
            [TrackingEventParameters.FromToken]: route.fromToken,
            [TrackingEventParameters.FromChainId]: route.fromChainId,
            [TrackingEventParameters.ToToken]: route.toToken,
            [TrackingEventParameters.ToChainId]: route.toChainId,
            [TrackingEventParameters.FromAmount]: route.fromAmount,
            [TrackingEventParameters.ToAmount]: route.toAmount,
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
            txhash: update.process.txHash || '',
            category: TrackingCategories.WidgetEvent,
            action: TrackingActions.OnRouteExecutionUpdated,
            data: {
              label: 'execution-update',
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
          label: 'execution-success',
          data: {
            [TrackingEventParameters.RouteId]: route.id,
            [TrackingEventParameters.Steps]: route.steps,
            [TrackingEventParameters.FromChainId]: route.fromChainId,
            [TrackingEventParameters.FromAmountUSD]: route.fromAmountUSD,
            [TrackingEventParameters.FromAmount]: route.fromAmount,
            [TrackingEventParameters.FromToken]: route.fromToken,
            [TrackingEventParameters.FromAddress]: route.fromAddress,
            [TrackingEventParameters.ToChainId]: route.toChainId,
            [TrackingEventParameters.ToAmountUSD]: route.toAmountUSD,
            [TrackingEventParameters.ToAmount]: route.toAmount,
            [TrackingEventParameters.ToAmountMin]: route.toAmountMin,
            [TrackingEventParameters.ToToken]: route.toToken,
          },
        });
      }
    };
    const onRouteExecutionFailed = async (update: RouteExecutionUpdate) => {
      trackEvent({
        category: TrackingCategories.WidgetEvent,
        action: TrackingActions.OnRouteExecutionFailed,
        label: 'execution-error',
        data: {
          [TrackingEventParameters.RouteId]: update.route.id,
          [TrackingEventParameters.TxHash]: update.process.txHash,
          [TrackingEventParameters.Status]: update.process.status,
          [TrackingEventParameters.Message]: update.process.message,
          [TrackingEventParameters.Error]: update.process.error,
          [TrackingEventParameters.Steps]: update.route.steps,
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
          [TrackingEventParameters.Timestamp]: Date.now(),
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
    // prevent endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
