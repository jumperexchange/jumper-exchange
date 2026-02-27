/**
 * Hook for the wallet recovery flow.
 * Manages share collection, reconstruction, and re-encryption.
 */
'use client';

import { useCallback, useRef, useState } from 'react';
import { useJumperWalletStore } from '@/stores/jumperWallet/JumperWalletStore';
import { combineShares } from '@/internal-wallet/crypto/shamir';
import {
  entropyToMnemonicPhrase,
  walletFromMnemonic,
} from '@/internal-wallet/crypto/mnemonic';
import { encryptMnemonic } from '@/internal-wallet/crypto/encryption';
import { splitEntropy } from '@/internal-wallet/crypto/shamir';
import type {
  ShamirShare,
  ShareStorageType,
} from '@/internal-wallet/crypto/types';
import { createAdapter } from '@/internal-wallet/recovery/adapters/adapterFactory';
import { parseRawShare } from '@/components/JumperWallet/Recovery/RecoveryCollectionStep';
import { JUMPER_WALLET_ADDRESS_KEY } from '@/config/jumperWallet';

export type AdapterRetrievalStatus =
  | { state: 'idle' }
  | { state: 'retrieving' }
  | { state: 'success' }
  | { state: 'failed'; failureCount: number; error: string };

export interface RecoveryState {
  collectedShares: ShamirShare[];
  selectedSources: ShareStorageType[];
  manualShareInputs: Record<string, string>;
  newPassword: string;
  confirmNewPassword: string;
  recoveredAddress: `0x${string}` | null;
  isRecovering: boolean;
  error: string | null;
  step:
    | 'select-wallet'
    | 'select-sources'
    | 'collect-shares'
    | 'set-password'
    | 'complete';
  adapterRetrievalStatus: Record<string, AdapterRetrievalStatus>;
}

const initialState: RecoveryState = {
  collectedShares: [],
  selectedSources: [],
  manualShareInputs: {},
  newPassword: '',
  confirmNewPassword: '',
  recoveredAddress: null,
  isRecovering: false,
  error: null,
  step: 'select-sources',
  adapterRetrievalStatus: {},
};

export function useWalletRecovery() {
  const [state, setState] = useState<RecoveryState>(initialState);
  const { storeRecoveredWallet, resolveConnectRequest, setFlow, shamirConfig } =
    useJumperWalletStore((s) => ({
      storeRecoveredWallet: s.storeRecoveredWallet,
      resolveConnectRequest: s.resolveConnectRequest,
      setFlow: s.setFlow,
      shamirConfig: s.shamirConfig,
    }));

  // Ref to avoid stale closure issues in retrieveFromAdapter
  const collectedSharesRef = useRef(state.collectedShares);
  collectedSharesRef.current = state.collectedShares;

  const toggleSource = useCallback((source: ShareStorageType) => {
    setState((prev) => {
      const selected = prev.selectedSources.includes(source)
        ? prev.selectedSources.filter((s) => s !== source)
        : [...prev.selectedSources, source];
      return { ...prev, selectedSources: selected };
    });
  }, []);

  const setManualShare = useCallback((key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      manualShareInputs: { ...prev.manualShareInputs, [key]: value },
    }));
  }, []);

  const addCollectedShare = useCallback((share: ShamirShare) => {
    setState((prev) => ({
      ...prev,
      collectedShares: [...prev.collectedShares, share],
    }));
  }, []);

  const setNewPassword = useCallback((password: string) => {
    setState((prev) => ({ ...prev, newPassword: password, error: null }));
  }, []);

  const setConfirmNewPassword = useCallback((password: string) => {
    setState((prev) => ({
      ...prev,
      confirmNewPassword: password,
      error: null,
    }));
  }, []);

  const setStep = useCallback((step: RecoveryState['step']) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  /**
   * Retrieve a share from a storage adapter (e.g. Google Drive).
   * Tracks per-adapter failure count so the UI can switch to manual fallback.
   */
  const retrieveFromAdapter = useCallback(
    async (adapterType: ShareStorageType): Promise<boolean> => {
      const adapter = createAdapter(adapterType, {});
      if (adapter.retrieval !== 'auto') {
        setState((prev) => ({
          ...prev,
          adapterRetrievalStatus: {
            ...prev.adapterRetrievalStatus,
            [adapterType]: {
              state: 'failed' as const,
              failureCount: 1,
              error: `${adapterType} does not support auto-retrieval`,
            },
          },
        }));
        return false;
      }

      // Mark as retrieving
      setState((prev) => ({
        ...prev,
        adapterRetrievalStatus: {
          ...prev.adapterRetrievalStatus,
          [adapterType]: { state: 'retrieving' as const },
        },
        error: null,
      }));

      try {
        // Use stored address from localStorage if available (persists even
        // when IndexedDB is cleared). Pass empty string if unknown — the
        // adapter will skip the address check.
        const storedAddress =
          localStorage.getItem(JUMPER_WALLET_ADDRESS_KEY) ?? '';

        const rawData = await adapter.retrieve({
          walletAddress: storedAddress,
        });

        if (!rawData) {
          setState((prev) => {
            const prevStatus = prev.adapterRetrievalStatus[adapterType];
            const prevFailures =
              prevStatus?.state === 'failed' ? prevStatus.failureCount : 0;
            return {
              ...prev,
              adapterRetrievalStatus: {
                ...prev.adapterRetrievalStatus,
                [adapterType]: {
                  state: 'failed' as const,
                  failureCount: prevFailures + 1,
                  error: 'No share found or user cancelled',
                },
              },
            };
          });
          return false;
        }

        const share = parseRawShare(rawData, shamirConfig);

        // Check for duplicate shares
        const isDuplicate = collectedSharesRef.current.some(
          (s) => s.data === share.data,
        );
        if (isDuplicate) {
          setState((prev) => ({
            ...prev,
            adapterRetrievalStatus: {
              ...prev.adapterRetrievalStatus,
              [adapterType]: {
                state: 'failed' as const,
                failureCount: 1,
                error: 'This share has already been collected',
              },
            },
          }));
          return false;
        }

        setState((prev) => ({
          ...prev,
          collectedShares: [...prev.collectedShares, share],
          adapterRetrievalStatus: {
            ...prev.adapterRetrievalStatus,
            [adapterType]: { state: 'success' as const },
          },
        }));

        return true;
      } catch (err) {
        setState((prev) => {
          const prevStatus = prev.adapterRetrievalStatus[adapterType];
          const prevFailures =
            prevStatus?.state === 'failed' ? prevStatus.failureCount : 0;
          return {
            ...prev,
            adapterRetrievalStatus: {
              ...prev.adapterRetrievalStatus,
              [adapterType]: {
                state: 'failed' as const,
                failureCount: prevFailures + 1,
                error: err instanceof Error ? err.message : 'Retrieval failed',
              },
            },
          };
        });
        return false;
      }
    },
    [shamirConfig],
  );

  const getAdapterFailureCount = useCallback(
    (adapterType: ShareStorageType): number => {
      const status = state.adapterRetrievalStatus[adapterType];
      return status?.state === 'failed' ? status.failureCount : 0;
    },
    [state.adapterRetrievalStatus],
  );

  /**
   * Attempt to reconstruct the wallet from collected shares.
   * Validates the reconstruction and shows the recovered address.
   */
  /**
   * Attempt to reconstruct the wallet from collected shares.
   *
   * @param extraShares - Additional shares parsed from manual inputs. They are
   *   merged with `state.collectedShares` synchronously so that callers don't
   *   need to wait for a `setState` round-trip before calling this function.
   *   The merged array is written back to state so `completeRecovery` can read
   *   it from the same source of truth.
   */
  const reconstructWallet = useCallback(
    async (extraShares?: ShamirShare[]): Promise<boolean> => {
      const allShares = [...state.collectedShares, ...(extraShares ?? [])];

      if (allShares.length < 2) {
        setState((prev) => ({
          ...prev,
          error: 'Need at least 2 shares to reconstruct',
        }));
        return false;
      }

      setState((prev) => ({ ...prev, isRecovering: true, error: null }));

      try {
        const { entropy } = await combineShares(allShares);

        const mnemonic = entropyToMnemonicPhrase(entropy);
        const wallet = walletFromMnemonic(mnemonic);

        setState((prev) => ({
          ...prev,
          // Persist the merged set so completeRecovery can reconstruct entropy.
          collectedShares: allShares,
          recoveredAddress: wallet.address,
          isRecovering: false,
          step: 'set-password',
        }));

        return true;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isRecovering: false,
          error:
            err instanceof Error ? err.message : 'Failed to reconstruct wallet',
        }));
        return false;
      }
    },
    [state.collectedShares],
  );

  /**
   * Complete recovery: re-encrypt with new password, generate new shares, store.
   */
  const completeRecovery = useCallback(async (): Promise<boolean> => {
    if (state.newPassword !== state.confirmNewPassword) {
      setState((prev) => ({
        ...prev,
        error: 'Passwords do not match',
      }));
      return false;
    }

    setState((prev) => ({ ...prev, isRecovering: true, error: null }));

    try {
      // Reconstruct mnemonic from shares
      const { entropy } = await combineShares(state.collectedShares);
      const mnemonic = entropyToMnemonicPhrase(new Uint8Array(entropy));
      const wallet = walletFromMnemonic(mnemonic);

      // Re-encrypt with new password
      const encryptedBlob = await encryptMnemonic(
        mnemonic,
        state.newPassword,
        wallet.address,
      );

      // Generate new SSS shares (fresh polynomial)
      const newShares = await splitEntropy(
        wallet.entropy,
        wallet.address,
        shamirConfig,
      );

      // Store everything
      await storeRecoveredWallet(encryptedBlob, wallet.address, newShares);

      // Resolve the pending connect request
      resolveConnectRequest(wallet.address);

      setState((prev) => ({
        ...prev,
        isRecovering: false,
        step: 'complete',
      }));

      return true;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isRecovering: false,
        error: err instanceof Error ? err.message : 'Recovery failed',
      }));
      return false;
    }
  }, [
    state.newPassword,
    state.confirmNewPassword,
    state.collectedShares,
    shamirConfig,
    storeRecoveredWallet,
    resolveConnectRequest,
  ]);

  const cancelRecovery = useCallback(() => {
    resolveConnectRequest(null);
    setFlow('idle');
    setState(initialState);
  }, [resolveConnectRequest, setFlow]);

  return {
    ...state,
    shamirConfig,
    toggleSource,
    setManualShare,
    addCollectedShare,
    setNewPassword,
    setConfirmNewPassword,
    setStep,
    reconstructWallet,
    completeRecovery,
    cancelRecovery,
    retrieveFromAdapter,
    getAdapterFailureCount,
  };
}
