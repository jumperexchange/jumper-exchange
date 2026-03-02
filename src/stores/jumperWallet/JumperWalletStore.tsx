/**
 * Context-wrapped Zustand store for the Jumper Internal Wallet.
 * Follows the pattern from SettingsStore.tsx.
 */
'use client';

import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { shallow } from 'zustand/shallow';
import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import {
  createJumperWalletStore,
  type JumperWalletState,
} from './createJumperWalletStore';
import { setJumperWalletCallbacks } from '@/internal-wallet/connector/jumperWalletConnector';
import {
  AUTO_LOCK_TIMEOUT_MS,
  VISIBILITY_LOCK_DELAY_MS,
} from '@/config/jumperWallet';

type JumperWalletStore = UseBoundStoreWithEqualityFn<
  StoreApi<JumperWalletState>
>;

export const JumperWalletStoreContext = createContext<JumperWalletStore | null>(
  null,
);

/**
 * Auto-lock hook: locks the wallet after a period of inactivity or when
 * the browser tab is hidden for too long.
 */
function useAutoLock(store: JumperWalletStore) {
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibilityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lockWallet = useCallback(() => {
    store.getState().lock();
  }, [store]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    // Only start the timer when the wallet is unlocked
    if (store.getState().status === 'unlocked') {
      inactivityTimer.current = setTimeout(lockWallet, AUTO_LOCK_TIMEOUT_MS);
    }
  }, [store, lockWallet]);

  // Subscribe to store status changes to start/stop the inactivity timer
  useEffect(() => {
    const unsubscribe = store.subscribe((state, prevState) => {
      if (state.status === 'unlocked' && prevState.status !== 'unlocked') {
        // Wallet just became unlocked -- start the timer
        resetInactivityTimer();
      } else if (
        state.status !== 'unlocked' &&
        prevState.status === 'unlocked'
      ) {
        // Wallet is no longer unlocked -- clear the timer
        if (inactivityTimer.current) {
          clearTimeout(inactivityTimer.current);
          inactivityTimer.current = null;
        }
      }
    });

    // If the wallet is already unlocked on mount, start the timer
    if (store.getState().status === 'unlocked') {
      resetInactivityTimer();
    }

    return unsubscribe;
  }, [store, resetInactivityTimer]);

  // Reset the inactivity timer on user interaction events
  useEffect(() => {
    const events: Array<keyof WindowEventMap> = [
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
    ];

    const handler = () => {
      if (store.getState().status === 'unlocked') {
        resetInactivityTimer();
      }
    };

    for (const event of events) {
      window.addEventListener(event, handler, { passive: true });
    }

    return () => {
      for (const event of events) {
        window.removeEventListener(event, handler);
      }
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [store, resetInactivityTimer]);

  // Handle page visibility changes: lock after VISIBILITY_LOCK_DELAY_MS when hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab became hidden -- start visibility timer if wallet is unlocked
        if (store.getState().status === 'unlocked') {
          visibilityTimer.current = setTimeout(
            lockWallet,
            VISIBILITY_LOCK_DELAY_MS,
          );
        }
      } else {
        // Tab became visible again -- cancel the visibility lock timer
        if (visibilityTimer.current) {
          clearTimeout(visibilityTimer.current);
          visibilityTimer.current = null;
        }
        // Reset the inactivity timer since the user is back
        if (store.getState().status === 'unlocked') {
          resetInactivityTimer();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (visibilityTimer.current) {
        clearTimeout(visibilityTimer.current);
      }
    };
  }, [store, lockWallet, resetInactivityTimer]);
}

export const JumperWalletStoreProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const storeRef = useRef<JumperWalletStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createJumperWalletStore();
    // Register callbacks synchronously so they're available before any child
    // effects run. React runs effects children-before-parents, so a useEffect
    // here would fire AFTER WalletManagementProvider's effects, which can
    // trigger connect() before callbacks are set.
    setJumperWalletCallbacks({
      onConnectRequest: () =>
        storeRef.current!.getState().handleConnectRequest(),
      onUnlockRequest: () => storeRef.current!.getState().requestUnlock(),
    });
  }

  const store = storeRef.current;

  // Auto-lock wallet after inactivity or tab hidden
  useAutoLock(store);

  // Initialize: check IndexedDB for existing wallets
  useEffect(() => {
    store.getState().initialize();
  }, [store]);

  return (
    <JumperWalletStoreContext.Provider value={store}>
      {children}
    </JumperWalletStoreContext.Provider>
  );
};

/**
 * Hook to access the Jumper wallet store with a selector.
 *
 * @example
 * ```tsx
 * const address = useJumperWalletStore((s) => s.address);
 * const { login, lock } = useJumperWalletStore((s) => ({
 *   login: s.login,
 *   lock: s.lock,
 * }));
 * ```
 */
export function useJumperWalletStore<T>(
  selector: (store: JumperWalletState) => T,
  equalityFunction = shallow,
) {
  const useStore = useContext(JumperWalletStoreContext);

  if (!useStore) {
    throw new Error(
      'You forgot to wrap your component in <JumperWalletStoreProvider>.',
    );
  }

  return useStore(selector, equalityFunction);
}
