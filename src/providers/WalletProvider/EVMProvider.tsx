'use client';
import { abstractWalletConnector } from '@abstract-foundation/agw-react/connectors';
import { sdk } from '@farcaster/miniapp-sdk';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';
import type { ExtendedChain } from '@lifi/sdk';
import {
  useSyncWagmiConfig,
  createDefaultWagmiConfig,
} from '@jumperexchange/widget-provider-ethereum';
import {
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { WagmiProvider } from 'wagmi';
import { baseAccount } from 'wagmi/connectors';
import { baseMiniApp } from '@/app/lib/metadata';
import { defaultCoinbaseConfig } from '@/config/coinbase';
import envConfig from '@/config/env-config';
import { defaultMetaMaskConfig } from '@/config/metaMask';
import { defaultWalletConnectConfig } from '@/config/walletConnect';
import { useChains } from '@/hooks/useChains';

const PUBLIC_URL = envConfig.NEXT_PUBLIC_SITE_URL as string;
const { config, connectors: initialConnectors } = createDefaultWagmiConfig({
  connectors: [abstractWalletConnector()],
  coinbase: defaultCoinbaseConfig,
  metaMask: defaultMetaMaskConfig,
  walletConnect: defaultWalletConnectConfig,
  lazy: true, // Lazy loading of connectors, only loads when needed to avoid having an extra 2MB in the bundle size
  wagmiConfig: {
    ssr: true,
  },
});

export const EVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const [useBaseMiniApp, setUseBaseMiniApp] = useState(false);

  useEffect(() => {
    sdk.context.then((context) => {
      if (context) {
        setUseBaseMiniApp(true);
      }
    });
  }, []);

  const { chains } = useChains();

  const finalConnectors = useMemo(() => {
    const allConnectors = [...initialConnectors];
    if (useBaseMiniApp) {
      allConnectors.unshift(farcasterMiniApp());
      allConnectors.unshift(
        baseAccount({
          appName: baseMiniApp.miniAppName,
          appLogoUrl: baseMiniApp.splashImageUrl,
        }),
      );
    }
    return allConnectors;
  }, [useBaseMiniApp]);

  useSyncWagmiConfig(config, finalConnectors, chains as ExtendedChain[]);
  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  );
};
