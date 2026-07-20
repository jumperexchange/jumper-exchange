'use client';

import { useEffect, useState } from 'react';
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

/**
 * True while the EVM wallet may still be restoring after a hard load.
 *
 * Reconnect is deferred until chains sync (`syncWagmiConfig` → `reconnect`),
 * so a missing address must not be treated as a settled disconnect yet.
 */
export const useIsWalletResolving = (): boolean => {
  const hydrated = useHydrated();
  const { isSuccess: chainsReady } = useChains();
  const { address, status } = useConnection();
  const [reconnectGraceElapsed, setReconnectGraceElapsed] = useState(false);

  const isConnecting = status === 'connecting' || status === 'reconnecting';

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

  if (!hydrated || !chainsReady) {
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
