'use client';
import { defaultCoinbaseConfig } from '@/config/coinbase';
import { defaultMetaMaskConfig } from '@/config/metaMask';
import { defaultWalletConnectConfig } from '@/config/walletConnect';
import type { CreateConnectorFnExtended } from '@lifi/wallet-management';
import {
  createCoinbaseConnector,
  createMetaMaskConnector,
  createWalletConnectConnector,
  isWalletInstalled,
  isWalletInstalledAsync,
} from '@lifi/wallet-management';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import type { Wallet } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import {
  useConnect,
  useAccount as useWagmiAccount,
  type Connector,
} from 'wagmi';

export interface CombinedWallet {
  evm?: CreateConnectorFnExtended | Connector;
  svm?: Wallet;
}

const combineWalletLists = (
  evmConnectorList: (CreateConnectorFnExtended | Connector)[],
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
    const evmConnectors: (CreateConnectorFnExtended | Connector)[] =
      Array.from(connectors);
    if (
      !connectors.some((connector) =>
        connector.id.toLowerCase().includes('walletconnect'),
      )
    ) {
      evmConnectors.unshift(
        createWalletConnectConnector(defaultWalletConnectConfig),
      );
    }
    if (
      !connectors.some((connector) =>
        connector.id.toLowerCase().includes('coinbase'),
      ) &&
      !isWalletInstalled('coinbase')
    ) {
      evmConnectors.unshift(createCoinbaseConnector(defaultCoinbaseConfig));
    }
    if (
      !connectors.some((connector) =>
        connector.id.toLowerCase().includes('metamask'),
      ) &&
      !isWalletInstalled('metaMask')
    ) {
      evmConnectors.unshift(createMetaMaskConnector(defaultMetaMaskConfig));
    }
    const evmInstalled = evmConnectors.filter(
      (connector) =>
        isWalletInstalled(connector.id) &&
        // We should not show already connected connectors
        account.connector?.id !== connector.id &&
        connector.id !== 'safe',
    );
    const svmInstalled = solanaWallets?.filter(
      (connector) =>
        connector.adapter.readyState === WalletReadyState.Installed &&
        // We should not show already connected connectors
        !connector.adapter.connected,
    );
    const installedWallets = combineWalletLists(evmInstalled, svmInstalled);

    const evmNotDetected = evmConnectors.filter(
      (connector) => !isWalletInstalled(connector.id),
    );

    const svmNotDetected = solanaWallets?.filter(
      (connector) =>
        connector.adapter.readyState !== WalletReadyState.Installed,
    );
    const notDetectedWallets = combineWalletLists(
      evmNotDetected,
      svmNotDetected,
    );

    setCombinedInstalledWallets(installedWallets);
    setCombinedNotDetectedWallets(notDetectedWallets);
  }, [connectors, account.connector, solanaWallets]);

  // check for multisig wallets
  useEffect(() => {
    const multiSigInstalled = async () => {
      const safeWallet = connectors.find(
        (connector) => connector.name === 'Safe',
      );
      if (await isWalletInstalledAsync(safeWallet?.id || '')) {
        setCombinedInstalledWallets((oldCombined) => {
          if (!oldCombined.find((oldC) => oldC.evm?.id === safeWallet?.id)) {
            return [...oldCombined, { evm: safeWallet }];
          } else {
            return oldCombined;
          }
        });
      }
    };
    multiSigInstalled();
  }, [connectors]);

  return { combinedInstalledWallets, combinedNotDetectedWallets };
};
