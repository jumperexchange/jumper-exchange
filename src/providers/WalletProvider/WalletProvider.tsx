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
  WalletManagementEvent,
  WalletManagementProvider,
  useWalletManagementEvents,
} from '@lifi/wallet-management';
import { useEffect, useMemo, type FC, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { EVMProvider } from './EVMProvider';
import { SVMProvider } from './SVMProvider';
import { UTXOProvider } from './UTXOProvider';

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <EVMProvider>
      <SVMProvider>
        <UTXOProvider>
          <WalletMenuProvider>
            <WalletTrackingProvider>{children}</WalletTrackingProvider>
          </WalletMenuProvider>
        </UTXOProvider>
      </SVMProvider>
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
