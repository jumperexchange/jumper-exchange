'use client';

import { SolanaProvider } from '@solana/react-hooks';
import { useWallet } from '@solana/react-hooks';
import { useSolanaWalletStandard } from '@jumperexchange/widget-provider-solana';
import {
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import type { SolanaClient, SolanaClientConfig } from '@solana/client';
import envConfig from '@/config/env-config';
import { getCustomRPCs } from '@/const/rpcList';
import { useHydrated } from '@/hooks/useHydrated';
import { createSsrSolanaClient } from './ssrSolanaClient';

const SOLANA_CHAIN_ID = '1151111081099710';

function getSolanaRpcUrl(): string | undefined {
  if (envConfig.NEXT_PUBLIC_SOLANA_RPC_URI) {
    return envConfig.NEXT_PUBLIC_SOLANA_RPC_URI;
  }
  // getCustomRPCs() strips browser-only endpoints (e.g. Helius) on SSR so
  // we never warm up an authenticated, rate-limited RPC from the pod fleet.
  const solanaRpcs = getCustomRPCs()[SOLANA_CHAIN_ID];
  if (Array.isArray(solanaRpcs) && solanaRpcs.length > 0) {
    return solanaRpcs[0];
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

// Pre-hydration stub client built once per process. Satisfies the
// `<SolanaProvider client={...}>` contract without calling `createClient(...)`,
// which is what triggers the `getLatestBlockhash` cluster warmup against
// rate-limited / IP-restricted Solana RPCs from the pod fleet on every SSR
// render. See `./ssrSolanaClient.ts` for the rationale.
const ssrSolanaClient: SolanaClient = createSsrSolanaClient();

export const SVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const isHydrated = useHydrated();
  const solanaConfig = useMemo<SolanaClientConfig>(() => {
    const rpcUrl = getSolanaRpcUrl();
    return {
      cluster: 'mainnet',
      ...(rpcUrl && { endpoint: rpcUrl as `https://${string}` }),
    };
  }, []);

  // Provide a no-warmup stub on SSR + the first client render (so hydration
  // matches), then swap to a real config-driven client once hydrated. The
  // `<SolanaProvider>` wrapper is kept identical across both paths so children
  // do NOT unmount when the underlying client is replaced — only the
  // `SolanaClientContext` value changes, which is exactly what we want.
  //
  // `walletPersistence` is also gated on `isHydrated`. Pre-hydration we pass
  // `false`, which fully short-circuits `<SolanaProvider>`'s persistence path:
  // no `localStorage` read, no `<WalletPersistence>` child mounted, and no
  // `subscribeSolanaState(...)` against the stub client (which has no actions
  // wired up). Once hydrated we install the real persistence config, at which
  // point auto-connect runs against the real client.
  const providerProps = isHydrated
    ? {
        config: solanaConfig,
        walletPersistence: {
          autoConnect: true,
          storageKey: 'jumper-solana',
        },
      }
    : {
        client: ssrSolanaClient,
        walletPersistence: false as const,
      };

  return (
    <SolanaProvider {...providerProps}>
      <SolanaWalletSync>{children}</SolanaWalletSync>
    </SolanaProvider>
  );
};
