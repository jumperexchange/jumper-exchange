'use client';
import { type FC, type PropsWithChildren } from 'react';
import { EVMProvider } from './EVMProvider';
import { SolanaProvider } from './SolanaProvider';
import { UTXOProvider } from './UTXOProvider';

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SolanaProvider>
      <EVMProvider>
        <UTXOProvider>{children}</UTXOProvider>
      </EVMProvider>
    </SolanaProvider>
  );
};
