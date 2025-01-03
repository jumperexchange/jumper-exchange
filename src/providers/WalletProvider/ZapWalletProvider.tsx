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

export const WalletProviderZap: FC<PropsWithChildren> = ({ children }) => {
  createConfig({
    apiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY,
    apiUrl: process.env.NEXT_PUBLIC_ZAP_API_URL,
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
        <SVMProvider>{children}</SVMProvider>
      </UTXOProvider>
    </EVMProvider>
  );
};
