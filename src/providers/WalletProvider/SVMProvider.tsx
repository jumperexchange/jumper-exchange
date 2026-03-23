'use client';

import { SolanaProvider } from '@solana/react-hooks';
import { useWallet } from '@solana/react-hooks';
import { useSolanaWalletStandard } from '@lifi/widget-provider-solana';
import { type FC, type PropsWithChildren, useEffect } from 'react';

/**
 * Syncs the Solana wallet connection state from @solana/react-hooks
 * into the widget's internal useSolanaWalletStandard store.
 * This ensures the widget's SolanaProviderValues sees the connected wallet.
 */
const SolanaWalletSync: FC<PropsWithChildren> = ({ children }) => {
  const wallet = useWallet();
  const { connect, disconnect } = useSolanaWalletStandard();
  const connectorName =
    wallet.status === 'connected' ? wallet.session.connector.name : undefined;

  useEffect(() => {
    if (wallet.status === 'connected' && connectorName) {
      connect(connectorName, { silent: true });
    } else if (wallet.status === 'disconnected') {
      disconnect();
    }

    return () => {
      if (wallet.status === 'connected') {
        disconnect();
      }
    };
  }, [wallet.status, connectorName, connect, disconnect]);

  return <>{children}</>;
};

export const SVMProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SolanaProvider
      config={{ cluster: 'mainnet' }}
      walletPersistence={{ autoConnect: true, storageKey: 'jumper-solana' }}
    >
      <SolanaWalletSync>{children}</SolanaWalletSync>
    </SolanaProvider>
  );
};
