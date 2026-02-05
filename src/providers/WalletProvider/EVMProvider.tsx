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
import { baseMiniApp } from '@/app/lib/metadata';
import { defaultCoinbaseConfig } from '@/config/coinbase';
import envConfig from '@/config/env-config';
import { defaultMetaMaskConfig } from '@/config/metaMask';
import { defaultWalletConnectConfig } from '@/config/walletConnect';
import { useChains } from '@/hooks/useChains';

const PUBLIC_URL = envConfig.NEXT_PUBLIC_SITE_URL as string;
const { config, connectors } = createDefaultWagmiConfig({
  connectors: [
    farcasterMiniApp(),
    baseAccount({
      appName: baseMiniApp.miniAppName,
      appLogoUrl: new URL(baseMiniApp.splashImageUrl, PUBLIC_URL).toString(),
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
