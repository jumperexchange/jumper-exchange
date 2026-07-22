'use client';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking';
import { useChains } from '@/hooks/useChains';
import { WalletManagementThemeProvider } from '@/providers/ThemeProvider/WalletManagementThemeProvider';
import type { WalletConnected } from '@jumperexchange/wallet-management';
import {
  useWalletManagementEvents,
  WalletManagementEvent,
  WalletManagementProviders,
} from '@jumperexchange/wallet-management';
import { setTag, setUser } from '@sentry/nextjs';
import { walletDigest } from '@/utils/walletDigest';
import type { ExtendedChain } from '@lifi/sdk';
import { type FC, type PropsWithChildren, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { EVMProvider } from './EVMProvider';
import { SuiProvider } from './SuiProvider';
import { SVMProvider } from './SVMProvider';
import { TronProvider } from './TronProvider';
import { UTXOProvider } from './UTXOProvider';
import { ClientOnly } from 'src/components/ClientOnly';
import { walletEcosystemsOrder } from './constants';
import { EthereumProvider as EthereumWidgetProvider } from '@jumperexchange/widget-provider-ethereum';
import { SolanaProvider as SolanaWidgetProvider } from '@jumperexchange/widget-provider-solana';
import { BitcoinProvider as BitcoinWidgetProvider } from '@jumperexchange/widget-provider-bitcoin';
import { SuiProvider as SuiWidgetProvider } from '@jumperexchange/widget-provider-sui';
import { TronProvider as TronWidgetProvider } from '@jumperexchange/widget-provider-tron';
import { defaultWalletConnectConfig } from '@/config/walletConnect';
import { defaultCoinbaseConfig } from '@/config/coinbase';
import { defaultMetaMaskConfig } from '@/config/metaMask';

export const widgetProviders = [
  EthereumWidgetProvider({
    walletConnect: defaultWalletConnectConfig,
    coinbase: defaultCoinbaseConfig,
    metaMask: defaultMetaMaskConfig,
    baseAccount: true,
  }),
  SolanaWidgetProvider(),
  BitcoinWidgetProvider(),
  SuiWidgetProvider(),
  TronWidgetProvider({
    walletConnect: true,
  }),
];

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { i18n } = useTranslation();
  const { chains } = useChains();

  return (
    <EVMProvider>
      <UTXOProvider>
        <SVMProvider>
          <SuiProvider>
            <TronProvider>
              <WalletManagementThemeProvider>
                <WalletManagementProviders
                  config={{
                    locale: i18n.resolvedLanguage as never,
                    walletEcosystemsOrder: walletEcosystemsOrder,
                  }}
                  providers={widgetProviders}
                  isExternalContext={true}
                  chains={(chains ?? []) as ExtendedChain[]}
                >
                  <WalletTrackingProvider>{children}</WalletTrackingProvider>
                </WalletManagementProviders>
              </WalletManagementThemeProvider>
            </TronProvider>
          </SuiProvider>
        </SVMProvider>
      </UTXOProvider>
    </EVMProvider>
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
      setUser({ id: walletDigest(data.address) });
      setTag('wallet.chainType', data.chainType);
      setTag('wallet.chainId', String(data.chainId));
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
    const handleWalletDisconnected = () => {
      setUser(null);
      setTag('wallet.chainType', undefined);
      setTag('wallet.chainId', undefined);
    };
    walletManagementEvents.on(
      WalletManagementEvent.WalletConnected,
      handleWalletConnected,
    );
    walletManagementEvents.on(
      WalletManagementEvent.WalletDisconnected,
      handleWalletDisconnected,
    );

    return () => {
      walletManagementEvents.off(
        WalletManagementEvent.WalletConnected,
        handleWalletConnected,
      );
      walletManagementEvents.off(
        WalletManagementEvent.WalletDisconnected,
        handleWalletDisconnected,
      );
    };
  }, [trackEvent, walletManagementEvents]);

  return null;
};
