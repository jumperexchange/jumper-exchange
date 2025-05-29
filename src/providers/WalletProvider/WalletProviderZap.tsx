'use client';
import { type FC, type PropsWithChildren, useEffect } from 'react';
import { EVMProvider } from './EVMProvider';
import { SVMProvider } from './SVMProvider';
import { UTXOProvider } from './UTXOProvider';
import { createConfig, EVM, Solana, UTXO, Sui } from '@lifi/sdk';
import { publicRPCList } from '@/const/rpcList';
import { SuiProvider } from './SuiProvider';

export const WalletProviderZap: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
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
