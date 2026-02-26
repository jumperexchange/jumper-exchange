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
import { WalletManagementThemeProvider } from '@/providers/ThemeProvider/WalletManagementThemeProvider';
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
import {
  JumperWalletStoreProvider,
  useJumperWalletStore,
} from '@/stores/jumperWallet/JumperWalletStore';
import { JumperWalletModal } from '@/components/JumperWallet/JumperWalletModal';
import { ClientOnly } from 'src/components/ClientOnly';
import { walletEcosystemsOrder } from './constants';

export const JumperWalletModalWrapper: FC = () => (
  <ClientOnly>
    <JumperWalletModal />
    {process.env.NODE_ENV === 'development' && <JumperWalletDevReset />}
  </ClientOnly>
);

const JumperWalletDevReset: FC = () => {
  const hasStoredWallet = useJumperWalletStore((s) => s.hasStoredWallet);
  const destroy = useJumperWalletStore((s) => s.destroy);

  if (!hasStoredWallet) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => {
        destroy();
        window.location.reload();
      }}
      style={{
        position: 'fixed',
        bottom: 8,
        left: 8,
        zIndex: 9999,
        padding: '4px 8px',
        fontSize: 11,
        background: '#ef4444',
        color: '#fff',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
        opacity: 0.7,
      }}
    >
      DEV: Reset Jumper Wallet
    </button>
  );
};

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <EVMProvider>
      <UTXOProvider>
        <SVMProvider>
          <SuiProvider>
            <JumperWalletStoreProvider>
              <WalletManagementThemeProvider>
                <WalletMenuProvider>
                  <WalletTrackingProvider>{children}</WalletTrackingProvider>
                </WalletMenuProvider>
              </WalletManagementThemeProvider>
            </JumperWalletStoreProvider>
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
      walletEcosystemsOrder: walletEcosystemsOrder,
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
