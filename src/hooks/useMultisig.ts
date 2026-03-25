import { type ExecutionAction, type Route } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import type { WalletConnector } from '@lifi/widget-provider';
import SafeAppsSDK from '@safe-global/safe-apps-sdk';
import { useEffect, useState } from 'react';

import { isIframeEnvironment } from '@/utils/iframe';
import { getRouteStatus } from '@/utils/routes';

const getIsSafeConnector = (connector?: WalletConnector): boolean => {
  if (connector?.id === 'safe') {
    return true;
  }
  // Check connector name as a fallback for Safe wallets connected via
  // WalletConnect — the old approach used getProvider() to inspect
  // WalletConnect peer metadata, but WalletConnector is now a plain
  // metadata object without provider access.
  if (connector?.name?.toLowerCase?.().includes?.('safe')) {
    return true;
  }
  return false;
};

export const useMultisig = () => {
  const { account } = useAccount();
  // Wallet is connected via Safe connector or WalletConnect to a Safe wallet
  const [isSafeConnector, setIsSafeConnector] = useState(false);
  // We are inside a Safe iFrame
  const [isSafeIFrame, setIsSafeIFrame] = useState(false);

  useEffect(() => {
    const checkMultisigEnvironment = async () => {
      setIsSafeConnector(getIsSafeConnector(account.connector));

      // Check if running inside Safe iframe environment
      if (!isIframeEnvironment()) {
        setIsSafeIFrame(false);
        return;
      }

      const sdk = new SafeAppsSDK();
      const accountInfo = await Promise.race([
        sdk.safe.getInfo(),
        new Promise<undefined>((resolve) => setTimeout(resolve, 200)),
      ]);

      setIsSafeIFrame(!!accountInfo?.safeAddress);
    };
    checkMultisigEnvironment();
  }, [account]);

  const shouldOpenMultisigSignatureModal = (route: Route) => {
    const routeStatus = getRouteStatus(route);
    const isRouteDone = routeStatus === 'DONE';
    const isRouteFailed = routeStatus === 'FAILED';

    const multisigRouteStarted = route.steps.some((step) =>
      (step as any).execution?.actions.find(
        (action: ExecutionAction) =>
          !!(action as any).multisigTxHash &&
          action.status === 'ACTION_REQUIRED',
      ),
    );

    return !isRouteDone && !isRouteFailed && multisigRouteStarted;
  };

  useEffect(() => {
    const isSafe = getIsSafeConnector(account.connector);
    if (isSafe) {
      setIsSafeConnector(true);
    }
  }, [account.connector]);

  return {
    isSafeConnector,
    isSafeIFrame,
    isSafe: isSafeConnector || isSafeIFrame,
    shouldOpenMultisigSignatureModal,
  };
};
