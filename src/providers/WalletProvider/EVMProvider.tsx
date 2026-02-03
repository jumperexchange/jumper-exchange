'use client';
import { abstractWalletConnector } from '@abstract-foundation/agw-react/connectors';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';
import type { ExtendedChain } from '@lifi/sdk';
import {
  createDefaultWagmiConfig,
  useSyncWagmiConfig,
} from '@lifi/wallet-management';
import type { FC, PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';
import { baseAccount } from 'wagmi/connectors';
import { defaultCoinbaseConfig } from '@/config/coinbase';
import { defaultMetaMaskConfig } from '@/config/metaMask';
import { defaultWalletConnectConfig } from '@/config/walletConnect';
import { useChains } from '@/hooks/useChains';
import { miniAppName, splashImageUrl } from '@/utils/miniApp';

const PUBLIC_URL = process.env.NEXT_PUBLIC_SITE_URL as string;
const { config, connectors } = createDefaultWagmiConfig({
  connectors: [
    farcasterMiniApp(),
    baseAccount({
      appName: miniAppName,
      appLogoUrl: new URL(splashImageUrl, PUBLIC_URL).toString(),
    }),
    abstractWalletConnector(),
  ],
  coinbase: defaultCoinbaseConfig,
  metaMask: defaultMetaMaskConfig,
  walletConnect: defaultWalletConnectConfig,
  lazy: true, // Lazy loading of connectors, only loads when needed to avoid having an extra 2MB in the bundle size
  wagmiConfig: {
    ssr: true,
  },
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
