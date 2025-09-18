'use client';
import { checkWinningSwap } from '@/components/GoldenRouteModal/utils';
import { MultisigConfirmationModal } from '@/components/MultisigConfirmationModal';
import { MultisigConnectedAlert } from '@/components/MultisigConnectedAlert';
import { useMultisig } from '@/hooks/useMultisig';
import { useActiveTabStore } from '@/stores/activeTab';
import { useChainTokenSelectionStore } from '@/stores/chainTokenSelection';
import { useMenuStore } from '@/stores/menu';
import { useMultisigStore } from '@/stores/multisig';
import { usePortfolioStore } from '@/stores/portfolio';
import type { RouteExtended } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import type {
  ChainTokenSelected,
  ContactSupport,
  RouteExecutionUpdate,
} from '@lifi/widget';
import { useWidgetEvents } from '@lifi/widget';
import { useEffect, useState } from 'react';
import { GoldenRouteModal } from 'src/components/GoldenRouteModal/GoldenRouteModal';
import { useContributionStore } from 'src/stores/contribution/ContributionStore';
import { useRouteStore } from 'src/stores/route/RouteStore';
import { getRouteStatus } from 'src/utils/routes';
import {
  setupWidgetEvents,
  teardownWidgetEvents,
  WidgetEventsConfig,
} from './WidgetEventsManager';

export function WidgetEvents() {
  const { activeTab } = useActiveTabStore();
  const { setDestinationChainToken, setSourceChainToken } =
    useChainTokenSelectionStore();
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

      // Refresh portfolio value
      setForceRefresh(true);

      const routeStatus = getRouteStatus(route);

      const txStatus = routeStatus === 'DONE' ? 'COMPLETED' : 'FAILED';
      if (account?.address) {
        if (txStatus !== 'COMPLETED') {
          return;
        }

        const txHash = route.steps[0].execution?.process.find(
          (process) => !!process.txHash,
        )?.txHash;

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

    const contactSupport = (supportId: ContactSupport) => {
      setSupportModalState(true);
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

    const config: WidgetEventsConfig = {
      routeExecutionUpdated,
      routeExecutionCompleted,
      contactSupport,
      sourceChainTokenSelected,
      destinationChainTokenSelected,
      pageEntered,
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
    setSupportModalState,
    shouldOpenMultisigSignatureModal,
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
