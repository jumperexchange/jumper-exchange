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
import { sepolia, arbitrum } from 'viem/chains';

const { config, connectors } = createDefaultWagmiConfig({
  coinbase: defaultCoinbaseConfig,
  metaMask: defaultMetaMaskConfig,
  walletConnect: defaultWalletConnectConfig,
  lazy: true,
});

export const EVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useChains();

  // TODO: To be removed
  // eslint-disable-next-line no-console
  console.log([
    ...(chains as ExtendedChain[]),
    sepolia,
    arbitrum,
  ])
  useSyncWagmiConfig(config, connectors, [
    ...(chains as ExtendedChain[]),
    sepolia,
    arbitrum,
  ]);

  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  );
};
