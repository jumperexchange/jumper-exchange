'use client';

import { useEffect, useState } from 'react';
import {
  useBitcoinContext,
  useSolanaContext,
  useSuiContext,
  useTronContext,
  type Account,
} from '@jumperexchange/widget-provider';
import { useConnection } from 'wagmi';
import { useChains } from '@/hooks/useChains';
import { useHydrated } from '@/hooks/useHydrated';

/** Matches wagmi's default storage prefix + recentConnectorId item key. */
export const WAGMI_RECENT_CONNECTOR_STORAGE_KEY = 'wagmi.recentConnectorId';

export const hasRecentWagmiConnector = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return Boolean(
      window.localStorage.getItem(WAGMI_RECENT_CONNECTOR_STORAGE_KEY),
    );
  } catch {
    return false;
  }
};

const isAccountConnecting = (account?: Account): boolean =>
  !!account &&
  (account.status === 'connecting' ||
    account.status === 'reconnecting' ||
    account.isConnecting ||
    account.isReconnecting);

/**
 * True while any wallet may still be restoring after a hard load.
 *
 * EVM reconnect is deferred until chains sync (`syncWagmiConfig` → `reconnect`),
 * so a missing address must not be treated as a settled disconnect yet.
 * Non-EVM ecosystems restore via their own providers after hydrate.
 */
export const useIsWalletResolving = (): boolean => {
  const hydrated = useHydrated();
  const { isSuccess: chainsReady } = useChains();
  const { address, status } = useConnection();
  const { account: solanaAccount } = useSolanaContext();
  const { account: bitcoinAccount } = useBitcoinContext();
  const { account: suiAccount } = useSuiContext();
  const { account: tronAccount } = useTronContext();
  const [reconnectGraceElapsed, setReconnectGraceElapsed] = useState(false);

  const isConnecting = status === 'connecting' || status === 'reconnecting';

  const nonEvmAccounts = [
    solanaAccount,
    bitcoinAccount,
    suiAccount,
    tronAccount,
  ];
  const hasNonEvmAddress = nonEvmAccounts.some((account) => !!account?.address);
  const isNonEvmConnecting = nonEvmAccounts.some(isAccountConnecting);

  // Chains just became ready: parent `useSyncWagmiConfig` will call reconnect()
  // in an effect. Stay resolving for one macrotask so that gap is not treated
  // as a settled disconnect when a recent connector is present.
  const awaitingReconnectStart =
    hydrated &&
    chainsReady &&
    !address &&
    !isConnecting &&
    hasRecentWagmiConnector();

  useEffect(() => {
    if (!awaitingReconnectStart) {
      setReconnectGraceElapsed(false);
      return;
    }

    setReconnectGraceElapsed(false);
    const timeoutId = window.setTimeout(() => {
      setReconnectGraceElapsed(true);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [awaitingReconnectStart]);

  if (!hydrated) {
    return true;
  }

  // Non-EVM wallets settle independently of the EVM chain-sync/reconnect path.
  if (hasNonEvmAddress) {
    return false;
  }

  if (isNonEvmConnecting) {
    return true;
  }

  if (!chainsReady) {
    return true;
  }

  if (isConnecting) {
    return true;
  }

  if (awaitingReconnectStart && !reconnectGraceElapsed) {
    return true;
  }

  return false;
};
