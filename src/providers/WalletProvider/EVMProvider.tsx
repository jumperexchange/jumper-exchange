'use client';
import { defaultCoinbaseConfig } from '@/config/coinbase';
import { defaultMetaMaskConfig } from '@/config/metaMask';
import { defaultWalletConnectConfig } from '@/config/walletConnect';
import { useChains } from '@/hooks/useChains';
import type { ExtendedChain } from '@lifi/sdk';
import {
  createDefaultWagmiConfig,
  useSyncWagmiConfig,
} from '@lifi/wallet-management';
import { type FC, type PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';
import { abstractWalletConnector } from '@abstract-foundation/agw-react/connectors';

const { config, connectors } = createDefaultWagmiConfig({
  connectors: [
    // abstractWalletConnector()
  ],
  coinbase: defaultCoinbaseConfig,
  metaMask: defaultMetaMaskConfig,
  walletConnect: defaultWalletConnectConfig,
  lazy: true,
});

export const EVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useChains();

  useSyncWagmiConfig(config, connectors, chains as ExtendedChain[]);

  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  );
};
