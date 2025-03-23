import { type Process, type Route } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import type { Connector } from 'wagmi';
import SafeAppsSDK from '@safe-global/safe-apps-sdk';
import { useEffect, useState } from 'react';
import { isIframeEnvironment } from 'src/utils/iframe';

const getIsSafeConnector = async (connector?: Connector): Promise<boolean> => {
  let isSafeConnector = connector?.id === 'safe';
  if (isSafeConnector) {
    return isSafeConnector;
  }
  const isWalletConnect = connector?.id === 'walletConnect';
  if (!isWalletConnect) {
    return false;
  }
  const provider = (await connector?.getProvider()) as any;
  isSafeConnector = provider?.signer?.session?.peer?.metadata?.name
    ?.toLowerCase?.()
    ?.includes?.('safe');
  return isSafeConnector;
};

export const useMultisig = () => {
  const { account } = useAccount();
  const [isSafeConnector, setIsSafeConnector] = useState(false);

  const checkMultisigEnvironment = async () => {
    if (!isIframeEnvironment()) {
      return false;
    }

    const sdk = new SafeAppsSDK();
    const accountInfo = await Promise.race([
      sdk.safe.getInfo(),
      new Promise<undefined>((resolve) => setTimeout(resolve, 200)),
    ]);

    return !!accountInfo?.safeAddress;
  };

  const shouldOpenMultisigSignatureModal = (route: Route) => {
    const isRouteDone = route.steps.every(
      (step) => (step as any).execution?.status === 'DONE',
    );

    const isRouteFailed = route.steps.some(
      (step) => (step as any).execution?.status === 'FAILED',
    );

    const multisigRouteStarted = route.steps.some((step) =>
      (step as any).execution?.process.find(
        (process: Process) =>
          !!process.multisigTxHash && process.status === 'ACTION_REQUIRED',
      ),
    );

    return !isRouteDone && !isRouteFailed && multisigRouteStarted;
  };

  useEffect(() => {
    (async () => {
      const isSafeConnector = await getIsSafeConnector(
        account.connector as Connector,
      );
      if (isSafeConnector) {
        setIsSafeConnector(isSafeConnector);
      }
    })();
  }, [account.connector]);

  return {
    isMultisigSigner: isSafeConnector,
    checkMultisigEnvironment,
    shouldOpenMultisigSignatureModal,
  };
};
