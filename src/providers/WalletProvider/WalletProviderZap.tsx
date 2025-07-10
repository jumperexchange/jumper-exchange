'use client';
import { publicRPCList } from '@/const/rpcList';
import { createConfig, EVM, Solana, UTXO } from '@lifi/sdk';
import { type FC, type PropsWithChildren, useEffect } from 'react';
import { EVMProvider } from './EVMProvider';
import { SuiProvider } from './SuiProvider';
import { SVMProvider } from './SVMProvider';
import { UTXOProvider } from './UTXOProvider';
import config from '@/config/env-config';

export const WalletProviderZap: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    createConfig({
      apiKey: config.NEXT_PUBLIC_LIFI_API_KEY,
      apiUrl: config.NEXT_PUBLIC_LIFI_API_URL,
      providers: [EVM(), Solana(), UTXO()],
      integrator: config.NEXT_PUBLIC_WIDGET_INTEGRATOR,
      rpcUrls: {
        ...JSON.parse(config.NEXT_PUBLIC_CUSTOM_RPCS),
        ...publicRPCList,
      },
      preloadChains: true,
    });
  }, []);

  return (
    <EVMProvider>
      <UTXOProvider>
        <SVMProvider>
          <SuiProvider>{children}</SuiProvider>
        </SVMProvider>
      </UTXOProvider>
    </EVMProvider>
  );
};
