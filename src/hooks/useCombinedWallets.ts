import type { Wallet } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { isWalletInstalled } from '@lifi/wallet-management';
import {
  type Connector,
  useConnect,
  useAccount as useWagmiAccount,
} from 'wagmi';
import { useEffect, useState } from 'react';

export interface CombinedWallet {
  evm?: Connector;
  svm?: Wallet;
}

const combineWalletLists = (
  evmConnectorList: Connector[],
  svmWalletList: Wallet[],
): CombinedWallet[] => {
  const combined: CombinedWallet[] = evmConnectorList.map((evm) => {
    const matchedSvm = svmWalletList?.find(
      (svm) => svm.adapter.name === evm.name,
    );
    return {
      evm,
      svm: matchedSvm,
    };
  });

  // Add SVM wallets that didn't find a match in EVM wallets
  svmWalletList?.forEach((svm) => {
    if (!combined.some((c) => c.svm?.adapter.name === svm.adapter.name)) {
      combined.push({ svm });
    }
  });

  return combined;
};

export const useCombinedWallets = () => {
  const { connectors } = useConnect();
  const account = useWagmiAccount();
  const { wallets: solanaWallets } = useWallet();

  const [combinedInstalledWallets, setCombinedInstalledWallets] = useState<
    CombinedWallet[]
  >([]);

  const [combinedNotDetectedWallets, setCombinedNotDetectedWallets] = useState<
    CombinedWallet[]
  >([]);

  // combine installed wallets
  useEffect(() => {
    const evmInstalled = connectors.filter(
      (connector) =>
        isWalletInstalled(connector.id) &&
        // We should not show already connected connectors
        account.connector?.id !== connector.id,
    );
    const svmInstalled = solanaWallets?.filter(
      (connector) =>
        connector.adapter.readyState === WalletReadyState.Installed &&
        // We should not show already connected connectors
        !connector.adapter.connected,
    );
    const combined = combineWalletLists(evmInstalled, svmInstalled);

    setCombinedInstalledWallets(combined);
  }, [connectors, account.connector, solanaWallets]);

  // combine undetected wallets
  useEffect(() => {
    const evmNotDetected = connectors.filter(
      (connector) => !isWalletInstalled(connector.id),
    );

    const svmNotDetected = solanaWallets?.filter(
      (connector) =>
        connector.adapter.readyState !== WalletReadyState.Installed,
    );
    const combined = combineWalletLists(evmNotDetected, svmNotDetected);
    setCombinedNotDetectedWallets(combined);
  }, [connectors, account.connector, solanaWallets]);

  return { combinedInstalledWallets, combinedNotDetectedWallets };
};
