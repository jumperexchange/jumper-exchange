'use client';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking';
import { useChains } from '@/hooks/useChains';
import { WalletManagementThemeProvider } from '@/providers/ThemeProvider/WalletManagementThemeProvider';
import type { WalletConnected } from '@lifi/wallet-management';
import {
  useWalletManagementEvents,
  WalletManagementEvent,
  WalletManagementProviders,
} from '@lifi/wallet-management';
import type { ExtendedChain } from '@lifi/sdk';
import { type FC, type PropsWithChildren, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { EVMProvider } from './EVMProvider';
import { SuiProvider } from './SuiProvider';
import { SVMProvider } from './SVMProvider';
import { UTXOProvider } from './UTXOProvider';
import { ClientOnly } from 'src/components/ClientOnly';
import { walletEcosystemsOrder } from './constants';
import { EthereumProvider as EthereumWidgetProvider } from '@lifi/widget-provider-ethereum';
import { SolanaProvider as SolanaWidgetProvider } from '@lifi/widget-provider-solana';
import { BitcoinProvider as BitcoinWidgetProvider } from '@lifi/widget-provider-bitcoin';
import { SuiProvider as SuiWidgetProvider } from '@lifi/widget-provider-sui';
import { defaultWalletConnectConfig } from '@/config/walletConnect';
import { defaultCoinbaseConfig } from '@/config/coinbase';
import { defaultMetaMaskConfig } from '@/config/metaMask';

export const widgetProviders = [
  EthereumWidgetProvider({
    walletConnect: defaultWalletConnectConfig,
    coinbase: defaultCoinbaseConfig,
    metaMask: defaultMetaMaskConfig,
    porto: true,
    baseAccount: true,
  }),
  SolanaWidgetProvider(),
  BitcoinWidgetProvider(),
  SuiWidgetProvider(),
];

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { i18n } = useTranslation();
  const { chains } = useChains();

  return (
    <EVMProvider>
      <UTXOProvider>
        <SVMProvider>
          <SuiProvider>
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
