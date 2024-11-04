'use client';
import { defaultCoinbaseConfig } from '@/config/coinbase';
import { defaultMetaMaskConfig } from '@/config/metaMask';
import { defaultWalletConnectConfig } from '@/config/walletConnect';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking';
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
import { SVMProvider } from './SVMProvider';
import { UTXOProvider } from './UTXOProvider';
import { createConfig, EVM, Solana, UTXO } from '@lifi/sdk';
import { publicRPCList } from '@/const/rpcList';

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  createConfig({
    apiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY,
    apiUrl: process.env.NEXT_PUBLIC_LIFI_API_URL,
    providers: [EVM(), Solana(), UTXO()],
    integrator: process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR,
    rpcUrls: {
      ...JSON.parse(process.env.NEXT_PUBLIC_CUSTOM_RPCS),
      ...publicRPCList,
    },
    preloadChains: true,
  });

  return (
    <EVMProvider>
      <UTXOProvider>
        <SVMProvider>
          <WalletMenuProvider>
            <WalletTrackingProvider>{children}</WalletTrackingProvider>
          </WalletMenuProvider>
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

  return children;
};
