'use client';
import { useAccount } from '@jumperexchange/wallet-management';
import type {
  ChainTokenSelected,
  FormFieldChanged,
  LimitPriceChanged,
  RouteExecutionUpdate,
} from '@jumperexchange/widget';
import { useWidgetEvents } from '@jumperexchange/widget';
import type { RouteExtended } from '@lifi/sdk';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@/utils/queries/getQueryKey';
import { useLimitOrdersFilterStore } from '@/stores/limitOrderPrice/LimitOrdersFilterStore';
import { useContributionStore } from 'src/stores/contribution/ContributionStore';
import { useRouteStore } from 'src/stores/route/RouteStore';
import { useWidgetCacheStore } from 'src/stores/widgetCache/WidgetCacheStore';
import { getRouteStatus } from 'src/utils/routes';
import { checkWinningSwap } from '@/components/GoldenRouteModal/utils';
import { MultisigConfirmationModal } from '@/components/MultisigConfirmationModal';
import { MultisigConnectedAlert } from '@/components/MultisigConnectedAlert';
import { useMultisig } from '@/hooks/useMultisig';
import { usePortfolioState } from '@/providers/PortfolioProvider/PortfolioContext';
import { useActiveTabStore } from '@/stores/activeTab';
import { useChainTokenSelectionStore } from '@/stores/chainTokenSelection';
import { useLimitOrderPriceStore } from '@/stores/limitOrderPrice/LimitOrderPriceStore';
import { useMultisigStore } from '@/stores/multisig';
import { useContactSupportEvent } from './events/hooks/useContactSupportEvent';
import type { WidgetEventsConfig } from './WidgetEventsManager';
import { setupWidgetEvents, teardownWidgetEvents } from './WidgetEventsManager';

const GoldenRouteModal = dynamic(() =>
  import('src/components/GoldenRouteModal/GoldenRouteModal').then(
    (mod) => mod.GoldenRouteModal,
  ),
);

export function WidgetEvents() {
  useContactSupportEvent();
  const { activeTab } = useActiveTabStore();
  const { setDestinationChainToken, setSourceChainToken } =
    useChainTokenSelectionStore();
  const { setFromChainId, setFromToken, setToChainId, setToToken } =
    useWidgetCacheStore((state) => state);
  const widgetEvents = useWidgetEvents();
  const { isSafe, shouldOpenMultisigSignatureModal } = useMultisig();
  const [setDestinationChain] = useMultisigStore((state) => [
    state.setDestinationChain,
  ]);
  const setCompletedRoute = useRouteStore((state) => state.setCompletedRoute);
  const setLimitPrice = useLimitOrderPriceStore((state) => state.setLimitPrice);
  const setProtocolFilter = useLimitOrdersFilterStore(
    (state) => state.setProtocolFilter,
  );
  const queryClient = useQueryClient();

  const { account } = useAccount();

  const [isMultiSigConfirmationModalOpen, setIsMultiSigConfirmationModalOpen] =
    useState(false);

  const [isMultisigConnectedAlertOpen, setIsMultisigConnectedAlertOpen] =
    useState(false);
  const { refreshByAddress } = usePortfolioState();
  const [route, setRoute] = useState<{
    winner: boolean;
    position: number | null;
  }>({ winner: false, position: null });

  const { setContributed, setContributionDisplayed } = useContributionStore(
    (state) => state,
  );

  useEffect(() => {
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

      if (!route.id) {
        return;
      }

      // Store the completed route
      setCompletedRoute(route);

      const placedTool = route.steps?.[0]?.tool;
      const limitOrderTools = ['cowswap', '1inch'];
      if (placedTool && limitOrderTools.includes(placedTool)) {
        setProtocolFilter(placedTool);
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: [getQueryKey('limit-orders')],
          });
        }, 1500);
      }

      const fromAddress = route.fromAddress;
      const toAddress = route.toAddress;

      // Refresh portfolio value
      refreshByAddress(fromAddress ?? '');
      if (fromAddress !== toAddress) {
        refreshByAddress(toAddress ?? '');
      }

      const routeStatus = getRouteStatus(route);

      const txStatus = routeStatus === 'DONE' ? 'COMPLETED' : 'FAILED';
      if (account?.address) {
        if (txStatus !== 'COMPLETED') {
          return;
        }

        const actions = route.steps[0].execution?.actions;

        if (!Array.isArray(actions) || actions.length === 0) {
          return;
        }

        const txHash = actions[actions.length - 1]?.txHash;

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
    };

    const sourceChainTokenSelected = async (
      sourceChainData: ChainTokenSelected,
    ) => {
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
      setDestinationChainToken(toChainData);
    };

    const destinationChainTokenSelected = async (
      destinationData: ChainTokenSelected,
    ) => {
      destinationChainTokenSelectedMultisig(destinationData);
      destinationChainTokenSelectedRaw(destinationData);
    };

    const pageEntered = async (pageType: unknown) => {
      // Reset contribution state when entering a new page
      setContributed(false);
      setContributionDisplayed(false);
    };

    const formFieldChanged = (formFieldData: FormFieldChanged) => {
      if (formFieldData?.fieldName === 'fromChain') {
        setFromChainId(formFieldData.newValue);
        return;
      }
      if (formFieldData?.fieldName === 'toChain') {
        setToChainId(formFieldData.newValue);
        return;
      }
      if (formFieldData?.fieldName === 'fromToken') {
        // Empty string blocks placeholder fallback via `??` — store as unset.
        setFromToken(formFieldData.newValue || undefined);
        return;
      }
      if (formFieldData?.fieldName === 'toToken') {
        setToToken(formFieldData.newValue || undefined);
        return;
      }
    };

    const limitPriceChanged = (data: LimitPriceChanged) => {
      setLimitPrice(data);
    };

    const config: WidgetEventsConfig = {
      routeExecutionUpdated,
      routeExecutionCompleted,
      sourceChainTokenSelected,
      destinationChainTokenSelected,
      pageEntered,
      formFieldChanged,
      limitPriceChanged,
    };

    setupWidgetEvents(config, widgetEvents);

    return () => {
      teardownWidgetEvents(config, widgetEvents);
    };
  }, [
    widgetEvents,
    activeTab,
    setDestinationChain,
    setDestinationChainToken,
    setSourceChainToken,
    shouldOpenMultisigSignatureModal,
    setCompletedRoute,
    setContributed,
    setContributionDisplayed,
    setFromChainId,
    setToChainId,
    setFromToken,
    setToToken,
    refreshByAddress,
    setLimitPrice,
  ]);

  const onMultiSigConfirmationModalClose = () => {
    setIsMultiSigConfirmationModalOpen(false);
  };

  const handleMultisigWalletConnectedModalClose = () => {
    setIsMultisigConnectedAlertOpen(false);
  };

  useEffect(() => {
    setIsMultisigConnectedAlertOpen(isSafe);
    // prevent endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.address]);

  const isGoldenRouteModalOpen =
    Boolean(route.winner) ||
    Boolean(!route.winner && route.position && route.position > 1);

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
      {isGoldenRouteModalOpen && (
        <GoldenRouteModal
          isOpen={isGoldenRouteModalOpen}
          route={route}
          onClose={() => setRoute({ winner: false, position: null })}
        />
      )}
    </>
  );
}
