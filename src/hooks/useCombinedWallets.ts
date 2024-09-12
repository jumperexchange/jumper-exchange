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
  useConfig as useBigmiConfig,
} from '@lifi/wallet-management';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import type { Wallet } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, type Connector } from 'wagmi';

export interface CombinedWallet {
  evm?: CreateConnectorFnExtended | Connector;
  svm?: Wallet;
  utxo?: CreateConnectorFnExtended | Connector;
}

const combineWalletLists = (
  evmConnectorList: (CreateConnectorFnExtended | Connector)[],
  utxoConnectorList: (CreateConnectorFnExtended | Connector)[],
  svmWalletList: Wallet[],
): CombinedWallet[] => {
  const combined: CombinedWallet[] = evmConnectorList.map((evm) => {
    const matchedSvm = svmWalletList?.find(
      (svm) => svm.adapter.name === evm.name,
    );
    const matchedUtxo = utxoConnectorList?.find(
      (utxo) => utxo.name === evm.name,
    );
    return {
      evm,
      svm: matchedSvm,
      utxo: matchedUtxo,
    };
  });

  // Add SVM wallets that didn't find a match in EVM wallets
  svmWalletList?.forEach((svm) => {
    if (!combined.some((c) => c.svm?.adapter.name === svm.adapter.name)) {
      combined.push({ svm });
    }
  });

  // Add UTXO wallets that didn't find a match in EVM wallets
  utxoConnectorList?.forEach((utxo) => {
    if (!combined.some((c) => c.utxo?.name === utxo.name)) {
      combined.push({ utxo });
    }
  });

  return combined;
};

export const useCombinedWallets = () => {
  const bigmiConfig = useBigmiConfig();
  const wagmiAccount = useAccount();
  const bigmiAccount = useAccount({ config: bigmiConfig });
  const { connectors: wagmiConnectors } = useConnect();
  const { connectors: bigmiConnectors } = useConnect({ config: bigmiConfig });
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
      Array.from(wagmiConnectors);
    if (
      !wagmiConnectors.some((connector) =>
        connector.id.toLowerCase().includes('walletconnect'),
      )
    ) {
      evmConnectors.unshift(
        createWalletConnectConnector(defaultWalletConnectConfig),
      );
    }
    if (
      !wagmiConnectors.some((connector) =>
        connector.id.toLowerCase().includes('coinbase'),
      ) &&
      !isWalletInstalled('coinbase')
    ) {
      evmConnectors.unshift(createCoinbaseConnector(defaultCoinbaseConfig));
    }
    if (
      !wagmiConnectors.some((connector) =>
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
        wagmiAccount.connector?.id !== connector.id &&
        connector.id !== 'safe',
    );
    const utxoInstalled = bigmiConnectors.filter(
      (connector) =>
        isWalletInstalled(connector.id) &&
        // We should not show already connected connectors
        bigmiAccount.connector?.id !== connector.id,
    );
    const svmInstalled = solanaWallets?.filter(
      (connector) =>
        connector.adapter.readyState === WalletReadyState.Installed &&
        // We should not show already connected connectors
        !connector.adapter.connected,
    );
    const installedWallets = combineWalletLists(
      evmInstalled,
      utxoInstalled,
      svmInstalled,
    );

    const evmNotDetected = evmConnectors.filter(
      (connector) => !isWalletInstalled(connector.id),
    );

    const svmNotDetected = solanaWallets?.filter(
      (connector) =>
        connector.adapter.readyState !== WalletReadyState.Installed,
    );

    const utxoNotDetected = bigmiConnectors.filter(
      (connector) => !isWalletInstalled(connector.id!),
    );

    const notDetectedWallets = combineWalletLists(
      evmNotDetected,
      utxoNotDetected,
      svmNotDetected,
    );

    setCombinedInstalledWallets(installedWallets);
    setCombinedNotDetectedWallets(notDetectedWallets);
  }, [
    bigmiAccount.connector?.id,
    bigmiConnectors,
    solanaWallets,
    wagmiAccount.connector?.id,
    wagmiConnectors,
  ]);

  // check for multisig wallets
  useEffect(() => {
    const multiSigInstalled = async () => {
      const safeWallet = wagmiConnectors.find(
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
  }, [wagmiConnectors]);

  return { combinedInstalledWallets, combinedNotDetectedWallets };
};
