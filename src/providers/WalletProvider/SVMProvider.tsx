'use client';

import { SolanaProvider } from '@solana/react-hooks';
import { useWallet } from '@solana/react-hooks';
import { useSolanaWalletStandard } from '@lifi/widget-provider-solana';
import {
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import type { SolanaClientConfig } from '@solana/client';
import envConfig from '@/config/env-config';
import { useHydrated } from '@/hooks/useHydrated';

const SOLANA_CHAIN_ID = '1151111081099710';

function getSolanaRpcUrl(): string | undefined {
  if (envConfig.NEXT_PUBLIC_SOLANA_RPC_URI) {
    return envConfig.NEXT_PUBLIC_SOLANA_RPC_URI;
  }
  try {
    const customRpcs = JSON.parse(envConfig.NEXT_PUBLIC_CUSTOM_RPCS || '{}');
    const solanaRpcs = customRpcs[SOLANA_CHAIN_ID];
    if (Array.isArray(solanaRpcs) && solanaRpcs.length > 0) {
      return solanaRpcs[0];
    }
  } catch {
    // ignore parse errors
  }
  return undefined;
}

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
  const prevStatusRef = useRef(wallet.status);

  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = wallet.status;

    if (wallet.status === 'connected' && connectorName) {
      connect(connectorName, { silent: true });
    } else if (wallet.status === 'disconnected' && prevStatus === 'connected') {
      disconnect();
    }
  }, [wallet.status, connectorName, connect, disconnect]);

  return children;
};

export const SVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const isHydrated = useHydrated();
  const solanaConfig = useMemo<SolanaClientConfig>(() => {
    const rpcUrl = getSolanaRpcUrl();
    return {
      cluster: 'mainnet',
      ...(rpcUrl && { endpoint: rpcUrl as `https://${string}` }),
    };
  }, []);

  if (!isHydrated) {
    return <>{children}</>;
  }

  return (
    <SolanaProvider
      config={solanaConfig}
      walletPersistence={{
        autoConnect: true,
        storageKey: 'jumper-solana',
      }}
    >
      <SolanaWalletSync>{children}</SolanaWalletSync>
    </SolanaProvider>
  );
};
