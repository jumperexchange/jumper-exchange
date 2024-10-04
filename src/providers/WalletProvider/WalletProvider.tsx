'use client';
import { type FC, type PropsWithChildren, useEffect } from 'react';
import { EVMProvider } from './EVMProvider';
import { SolanaProvider } from './SolanaProvider';
import { createConfig, EVM, Solana } from '@lifi/sdk';
import { publicRPCList } from '@/const/rpcList';

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    createConfig({
      providers: [EVM(), Solana()],
      integrator: process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR,
      rpcUrls: {
        ...JSON.parse(process.env.NEXT_PUBLIC_CUSTOM_RPCS),
        ...publicRPCList,
      },
      preloadChains: true,
    });
  }, []);

  return (
    <SolanaProvider>
      <EVMProvider>{children}</EVMProvider>
    </SolanaProvider>
  );
};
