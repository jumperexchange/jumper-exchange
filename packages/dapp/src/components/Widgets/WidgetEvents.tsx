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
import { TabsMap } from '../../const/tabsMap';
import { useMultisig } from '../../hooks/useMultisig';
import { useWallet } from '../../providers/WalletProvider';
import {
  useActiveTabStore,
  useMenuStore,
  useMultisigStore,
} from '../../stores';
import { MultisigConfirmationModal } from '../MultisigConfirmationModal';
import { MultisigConnectedAlert } from '../MultisigConnectedAlert';

export function WidgetEvents() {
  const lastTxHashRef = useRef<string>();
  const { activeTab } = useActiveTabStore();
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
          label: 'execution_start',
          data: {
            [TrackingEventParameters.RouteId]: route.id,
            [TrackingEventParameters.FromToken]: route.fromToken,
            [TrackingEventParameters.ToToken]: route.toToken,
            [TrackingEventParameters.FromChainId]: route.fromChainId,
            [TrackingEventParameters.ToChainId]: route.toChainId,
            [TrackingEventParameters.FromAmount]: route.fromAmount,
            [TrackingEventParameters.ToAmount]: route.toAmount,
            [TrackingEventParameters.FromAmountUSD]: route.fromAmountUSD,
            [TrackingEventParameters.ToAmountUSD]: route.toAmountUSD,
            [TrackingEventParameters.Variant]: Object.values(TabsMap).filter(
              (el) => el.index === activeTab,
            )[0].variant,
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
              label: 'execution_update',
              [TrackingEventParameters.FromAmountUSD]:
                update.route.fromAmountUSD,
              [TrackingEventParameters.ToAmountUSD]: update.route.toAmountUSD,
              [TrackingEventParameters.FromAmount]: update.route.fromAmount,
              [TrackingEventParameters.ToAmount]: update.route.toAmount,
              [TrackingEventParameters.FromToken]: update.route.fromToken,
              [TrackingEventParameters.ToToken]: update.route.toToken,
              [TrackingEventParameters.FromChainId]: update.route.fromChainId,
              [TrackingEventParameters.ToChainId]: update.route.toChainId,
              [TrackingEventParameters.RouteId]: `${update.route.id}`,
              [TrackingEventParameters.Status]: update.process.status,
              [TrackingEventParameters.TxHash]: update.process.txHash || '',
              [TrackingEventParameters.TxLink]: update.process.txLink || '',
              [TrackingEventParameters.Type]: update.process.type,
              [TrackingEventParameters.GasCostUSD]: update.route.gasCostUSD,
              [TrackingEventParameters.ErrorCode]:
                update.process.error?.code || '',
              [TrackingEventParameters.ErrorMessage]:
                update.process.error?.message || '',
              [TrackingEventParameters.InsuranceFeeAmountUSD]:
                update.route.insurance.feeAmountUsd,
              [TrackingEventParameters.InsuranceState]:
                update.route.insurance?.state,
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
          label: 'execution_success',
          data: {
            [TrackingEventParameters.RouteId]: route.id,
            [TrackingEventParameters.FromChainId]: route.fromChainId,
            [TrackingEventParameters.FromAmountUSD]: route.fromAmountUSD,
            [TrackingEventParameters.FromAmount]: route.fromAmount,
            [TrackingEventParameters.FromToken]: route.fromToken,
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
        label: 'execution_error',
        data: {
          [TrackingEventParameters.RouteId]: update.route.id,
          [TrackingEventParameters.TxHash]: update.process.txHash,
          [TrackingEventParameters.Status]: update.process.status,
          [TrackingEventParameters.Message]: update.process.message || '',
          [TrackingEventParameters.ErrorMessage]:
            update.process.error?.message || '',
          [TrackingEventParameters.ErrorCode]: update.process.error?.code || '',
        },
      });
    };

    const onRouteHighValueLoss = (update: RouteHighValueLossUpdate) => {
      trackEvent({
        action: TrackingActions.OnRouteHighValueLoss,
        category: TrackingCategories.WidgetEvent,
        label: 'click_high_value_loss_accepted',
        data: {
          [TrackingEventParameters.FromAmountUSD]: update.fromAmountUsd,
          [TrackingEventParameters.ToAmountUSD]: update.toAmountUSD,
          [TrackingEventParameters.GasCostUSD]: update.gasCostUSD,
          [TrackingEventParameters.ValueLoss]: update.valueLoss,
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
    activeTab,
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
