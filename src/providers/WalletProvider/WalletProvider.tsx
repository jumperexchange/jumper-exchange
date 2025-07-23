'use client';
import { defaultCoinbaseConfig } from '@/config/coinbase';
import config from '@/config/env-config';
import { defaultMetaMaskConfig } from '@/config/metaMask';
import { defaultWalletConnectConfig } from '@/config/walletConnect';
import { publicRPCList } from '@/const/rpcList';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking';
import { WalletManagementThemeProvider } from '@/providers/ThemeProvider/WalletManagementThemeProvider';
import getApiUrl from '@/utils/getApiUrl';
import { createConfig, EVM, Solana, Sui, UTXO } from '@lifi/sdk';
import type {
  WalletConnected,
  WalletManagementConfig,
} from '@lifi/wallet-management';
import {
  useWalletManagementEvents,
  WalletManagementEvent,
  WalletManagementProvider,
} from '@lifi/wallet-management';
import { type FC, type PropsWithChildren, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EVMProvider } from './EVMProvider';
import { SuiProvider } from './SuiProvider';
import { SVMProvider } from './SVMProvider';
import { UTXOProvider } from './UTXOProvider';
import { ClientOnly } from 'src/components/ClientOnly';

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  createConfig({
    apiKey: config.NEXT_PUBLIC_LIFI_API_KEY,
    apiUrl: getApiUrl(),
    providers: [EVM(), Solana(), UTXO(), Sui()],
    integrator: config.NEXT_PUBLIC_WIDGET_INTEGRATOR,
    rpcUrls: {
      ...JSON.parse(config.NEXT_PUBLIC_CUSTOM_RPCS ?? {}),
      ...publicRPCList,
    },
    preloadChains: true,
  });

  return (
    <EVMProvider>
      <UTXOProvider>
        <SVMProvider>
          <SuiProvider>
            <WalletManagementThemeProvider>
              <WalletMenuProvider>
                <WalletTrackingProvider>{children}</WalletTrackingProvider>
              </WalletMenuProvider>
            </WalletManagementThemeProvider>
          </SuiProvider>
        </SVMProvider>
      </UTXOProvider>
    </EVMProvider>
  );
};

const WalletMenuProvider: FC<PropsWithChildren> = ({ children }) => {
  const { i18n } = useTranslation();
  const config: WalletManagementConfig = useMemo(() => {
    return {
      locale: i18n.resolvedLanguage as never,
      metaMask: defaultMetaMaskConfig,
      coinbase: defaultCoinbaseConfig,
      walletConnect: defaultWalletConnectConfig,
    };
  }, [i18n.resolvedLanguage]);
  return (
    <WalletManagementProvider config={config}>
      {children}
    </WalletManagementProvider>
  );
};

const WalletTrackingProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      {children}
      <ClientOnly>
        <WalletTrackingClient />
      </ClientOnly>
    </>
  );
};

const WalletTrackingClient = () => {
  const walletManagementEvents = useWalletManagementEvents();
  const { trackEvent } = useUserTracking();

  useEffect(() => {
    const handleWalletConnected = async (data: WalletConnected) => {
      trackEvent({
        category: TrackingCategory.Connect,
        action: TrackingAction.ConnectWallet,
        label: 'connect-wallet',
        data: {
          [TrackingEventParameter.Wallet]: data.connectorName,
          [TrackingEventParameter.Ecosystem]: data.chainType,
          [TrackingEventParameter.ChainId]: data.chainId,
          [TrackingEventParameter.WalletAddress]: data.address,
        },
      });
    };
    walletManagementEvents.on(
      WalletManagementEvent.WalletConnected,
      handleWalletConnected,
    );

    return () =>
      walletManagementEvents.off(
        WalletManagementEvent.WalletConnected,
        handleWalletConnected,
      );
  }, [trackEvent, walletManagementEvents]);

  return null;
};
