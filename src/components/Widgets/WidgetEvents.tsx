'use client';
import type { Process, RouteExtended, Step } from '@lifi/sdk';
import { type Route } from '@lifi/sdk';

import { MultisigConfirmationModal } from '@/components/MultisigConfirmationModal';
import { MultisigConnectedAlert } from '@/components/MultisigConnectedAlert';
import { TabsMap } from '@/const/tabsMap';
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
import type {
  ChainTokenSelected,
  ContactSupport,
  Estimate,
  Execution,
  LiFiStep,
  RouteExecutionUpdate,
  RouteHighValueLossUpdate,
} from '@lifi/widget';
import { WidgetEvent, useWidgetEvents } from '@lifi/widget';
import { useEffect, useRef, useState } from 'react';

interface LifiStepProps extends LiFiStep {
  execution: Execution;
  estimate: Estimate;
}

const getStepData = (route: RouteExtended) => {
  let currentStep = {};
  route.steps.map((step) =>
    step.execution?.process.map(
      (process) =>
        process.status !== 'DONE' &&
        step.includedSteps?.forEach((includeStep: Step) => {
          currentStep = {
            [TrackingEventParameter.RouteId]: step.id,
            [TrackingEventParameter.TransactionId]: includeStep.id,
            [TrackingEventParameter.Type]: includeStep.type,
            [TrackingEventParameter.Exchange]: includeStep.tool,
            [TrackingEventParameter.FromToken]:
              includeStep.action.fromToken.address,
            [TrackingEventParameter.ToToken]:
              includeStep.action.toToken.address,
            [TrackingEventParameter.FromChainId]:
              includeStep.action.fromChainId,
            [TrackingEventParameter.ToChainId]: includeStep.action.toChainId,
            [TrackingEventParameter.FromAmount]:
              includeStep.estimate.fromAmount,
            [TrackingEventParameter.FromAmountUSD]:
              includeStep.estimate.fromAmountUSD,
            [TrackingEventParameter.ToAmount]: includeStep.estimate.toAmount,
            [TrackingEventParameter.ToAmountUSD]:
              includeStep.estimate.toAmountUSD,
            [TrackingEventParameter.ToAmountMin]: route.toAmountMin,
            [TrackingEventParameter.Status]: process.status,
            [TrackingEventParameter.TransactionHash]:
              process.map((el: Process) => el.status !== 'DONE' && el.txHash) ||
              '',
            [TrackingEventParameter.TransactionLink]:
              process.map((el: Process) => el.status !== 'DONE' && el.txLink) ||
              '',
            [TrackingEventParameter.GasCostUSD]: route.gasCostUSD || '',
            [TrackingEventParameter.ErrorCode]: process.error?.code || '',
            [TrackingEventParameter.ErrorMessage]: process.error?.message || '',
            [TrackingEventParameter.NonInteraction]: true,
            [TrackingEventParameter.IsFinal]: false,
          };
        }),
    ),
  );
  return currentStep;
};

export function WidgetEvents() {
  const lastTxHashRef = useRef<string>();
  const { activeTab } = useActiveTabStore();
  const { setDestinationChainToken, setSourceChainToken } =
    useChainTokenSelectionStore();
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
      if (route.id) {
        console.log('ROUTE STARTED DATA IN', route);
        trackTransaction({
          category: TrackingCategory.WidgetEvent,
          action: TrackingAction.OnRouteExecutionStarted,
          label: 'execution_start',
          value: parseFloat(route.fromAmountUSD),
          data: {
            [TrackingEventParameter.Type]: 'started',
            [TrackingEventParameter.TransactionId]: route.id,
            [TrackingEventParameter.RouteId]: route.steps[0].id,
            [TrackingEventParameter.Exchange]: route.steps[0].estimate?.tool,
            [TrackingEventParameter.GasCostUSD]: route.gasCostUSD,
            [TrackingEventParameter.Status]: (
              route.steps[route.steps.length - 1] as LifiStepProps
            ).execution?.status,
            [TrackingEventParameter.IsFinal]: false,
            [TrackingEventParameter.FromToken]: route.fromToken.address,
            [TrackingEventParameter.ToToken]: route.toToken.address,
            [TrackingEventParameter.FromChainId]: route.fromToken.chainId,
            [TrackingEventParameter.ToChainId]: route.toToken.chainId,
            [TrackingEventParameter.FromAmount]: route.fromAmount,
            [TrackingEventParameter.ToAmount]: route.toAmount,
            [TrackingEventParameter.ToAmountMin]: route.toAmountMin,
            [TrackingEventParameter.FromAmountUSD]: route.fromAmountUSD,
            [TrackingEventParameter.ToAmountUSD]: route.toAmountUSD,
            [TrackingEventParameter.Variant]: Object.values(TabsMap).filter(
              (el) => el.index === activeTab,
            )[0].variant,
            [TrackingEventParameter.TransactionHash]: undefined,
            [TrackingEventParameter.TransactionLink]: undefined,
            [TrackingEventParameter.ErrorCode]: undefined,
            [TrackingEventParameter.ErrorMessage]: undefined,

            // [TrackingEventParameter.NonInteraction]: undefined,
          },
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

      if (!!update.process && !!update.route) {
        console.log('ROUTE UPDATED DATA IN', update);
        if (update.process.txHash !== lastTxHashRef.current) {
          lastTxHashRef.current = update.process.txHash;
          const stepData = getStepData(update.route);
          trackTransaction({
            category: TrackingCategory.WidgetEvent,
            action: TrackingAction.OnRouteExecutionUpdated,
            label: 'execution_update',
            value: parseFloat(update.route.fromAmountUSD),
            data: {
              ...stepData,
              [TrackingEventParameter.Variant]: Object.values(TabsMap).filter(
                (el) => el.index === activeTab,
              )[0].variant,
            },
          });
        }
      }
    };
    const onRouteExecutionCompleted = async (route: Route) => {
      if (route.id) {
        console.log('ROUTE COMPLETED DATA IN', route);
        trackTransaction({
          category: TrackingCategory.WidgetEvent,
          action: TrackingAction.OnRouteExecutionCompleted,
          label: 'execution_success',
          value: parseFloat(route.fromAmountUSD),
          data: {
            [TrackingEventParameter.RouteId]: route.id,
            [TrackingEventParameter.IsFinal]: true,
            [TrackingEventParameter.FromChainId]: route.fromChainId,
            [TrackingEventParameter.FromAmountUSD]: route.fromAmountUSD,
            [TrackingEventParameter.FromAmount]: route.fromAmount,
            [TrackingEventParameter.FromToken]: route.fromToken.address,
            [TrackingEventParameter.ToChainId]: route.toChainId,
            [TrackingEventParameter.ToAmountUSD]: route.toAmountUSD,
            [TrackingEventParameter.ToAmount]: route.toAmount,
            [TrackingEventParameter.ToAmountMin]: route.toAmountMin,
            [TrackingEventParameter.ToToken]: route.toToken.address,
          },
          enableAddressable: true,
          isConversion: true,
        });
      }
    };
    const onRouteExecutionFailed = async (update: RouteExecutionUpdate) => {
      console.log('ROUTE FAILED DATA IN', update);

      trackTransaction({
        category: TrackingCategory.WidgetEvent,
        action: TrackingAction.OnRouteExecutionFailed,
        label: 'execution_error',
        value: -1,
        data: {
          [TrackingEventParameter.RouteId]: update.route.id,
          [TrackingEventParameter.TxHash]: update.process.txHash || '',
          [TrackingEventParameter.Status]: update.process.status,
          [TrackingEventParameter.Message]: update.process.message || '',
          [TrackingEventParameter.ErrorMessage]:
            update.process.error?.message || '',
          [TrackingEventParameter.IsFinal]: false,
          [TrackingEventParameter.ErrorCode]: update.process.error?.code || '',
        },
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

    const onWidgetExpanded = async (expanded: boolean) => {
      expanded &&
        trackEvent({
          category: TrackingCategory.WidgetEvent,
          action: TrackingAction.OnWidgetExpanded,
          label: `widget_expanded`,
          enableAddressable: true,
        });
    };

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
      trackEvent({
        category: TrackingCategory.WidgetEvent,
        action: TrackingAction.OnAvailableRoutes,
        label: `routes_available`,
        enableAddressable: true,
        data: {
          [TrackingEventParameter.AvailableRoutesCount]: availableRoutes.length,
        },
      });
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
    widgetEvents.on(WidgetEvent.WidgetExpanded, onWidgetExpanded);

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
      widgetEvents.off(WidgetEvent.WidgetExpanded, onWidgetExpanded);
      widgetEvents.off(WidgetEvent.AvailableRoutes, onAvailableRoutes);
    };
  }, [
    activeTab,
    setDestinationChain,
    setDestinationChainToken,
    setSourceChainToken,
    setSupportModalState,
    shouldOpenMultisigSignatureModal,
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
