import { Route } from '@lifi/sdk';
import { useUserTracking } from '../../hooks';

import {
  RouteExecutionUpdate,
  RouteHighValueLossUpdate,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget';
import { useEffect, useRef, useState } from 'react';
import { TrackingActions, TrackingCategories } from '../../const';

import { MultisigConnectedAlert } from '../MultisigConnectedAlert';
import { MultisigConfirmationModal } from '../MultisigConfirmationModal';
import { useWallet } from '../../providers/WalletProvider';

export function WidgetEvents() {
  const lastTxHashRef = useRef<string>();
  const { trackEvent, trackTransaction, trackAttribute } = useUserTracking();

  const { account } = useWallet();

  const [isMultiSigConfirmationModalOpen, setIsMultiSigConfirmationModalOpen] =
    useState(false);

  const [isMultisigConnectedAlertOpen, setIsMultisigConnectedAlertOpen] =
    useState(false);

  const widgetEvents = useWidgetEvents();

  useEffect(() => {
    const onRouteExecutionStarted = async (route: Route) => {
      if (!!route?.id) {
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
      if (!!update?.process && !!update.route) {
        if (update.process.txHash !== lastTxHashRef.current) {
          lastTxHashRef.current = update.process.txHash;
          trackTransaction({
            chain: update.route.fromChainId,
            transactionHash: update.process.txHash,
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
      if (!!route?.id) {
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
          routeId: update?.route?.id,
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

    const onSafeRouteInitiation = (route: Route) => {
      setIsMultiSigConfirmationModalOpen(true);
      console.log('Got the safe route event');
    };

    widgetEvents.on(WidgetEvent.RouteExecutionStarted, onRouteExecutionStarted);
    widgetEvents.on(WidgetEvent.RouteExecutionUpdated, onRouteExecutionUpdated);
    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted,
    );
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, onRouteExecutionFailed);
    widgetEvents.on(WidgetEvent.RouteHighValueLoss, onRouteHighValueLoss);
    widgetEvents.on(WidgetEvent.SafeRouteInitiated, onSafeRouteInitiation);

    return () => widgetEvents.all.clear();
  }, [trackAttribute, trackEvent, trackTransaction, widgetEvents]);

  const handleMultiSigConfirmationModalClose = () => {
    setIsMultiSigConfirmationModalOpen(false);
  };

  const handleMultisigWalletConnectedModalClose = () => {
    setIsMultisigConnectedAlertOpen(false);
  };

  useEffect(() => {
    const isSafeSigner = !!(account?.signer?.provider as any)?.provider?.safe
      ?.safeAddress;

    setIsMultisigConnectedAlertOpen(isSafeSigner);
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
