/**
 * Primary hook for interacting with the Jumper Internal Wallet.
 * Provides wallet state, actions, and signing capabilities.
 */
'use client';

import { useCallback } from 'react';
import { useJumperWalletStore } from '@/stores/jumperWallet/JumperWalletStore';
import { getJumperWalletProvider } from '@/internal-wallet/connector/jumperWalletConnector';
import { decryptMnemonic } from '@/internal-wallet/crypto/encryption';
import { getWallet } from '@/internal-wallet/storage/db';
import { mnemonicToAccount } from 'viem/accounts';

export function useJumperWallet() {
  const status = useJumperWalletStore((s) => s.status);
  const flow = useJumperWalletStore((s) => s.flow);
  const address = useJumperWalletStore((s) => s.address);
  const hasStoredWallet = useJumperWalletStore((s) => s.hasStoredWallet);
  const webauthnCredential = useJumperWalletStore((s) => s.webauthnCredential);
  const canLoginWithBiometric = useJumperWalletStore(
    (s) => s.canLoginWithBiometric,
  );
  const login = useJumperWalletStore((s) => s.login);
  const loginWithBiometric = useJumperWalletStore((s) => s.loginWithBiometric);
  const registerBiometric = useJumperWalletStore((s) => s.registerBiometric);
  const lock = useJumperWalletStore((s) => s.lock);
  const destroy = useJumperWalletStore((s) => s.destroy);
  const setFlow = useJumperWalletStore((s) => s.setFlow);
  const resolvePasswordRequest = useJumperWalletStore(
    (s) => s.resolvePasswordRequest,
  );
  const resolveConnectRequest = useJumperWalletStore(
    (s) => s.resolveConnectRequest,
  );

  /**
   * Unlock the wallet for signing by providing the password.
   * Sets the account on the EIP-1193 provider so transactions can be signed.
   */
  const unlock = useCallback(
    async (password: string): Promise<boolean> => {
      if (!address) {
        return false;
      }

      const storedWallet = await getWallet(address);
      if (!storedWallet) {
        return false;
      }

      try {
        const mnemonic = await decryptMnemonic(
          storedWallet.encryptedMnemonic,
          password,
        );
        const account = mnemonicToAccount(mnemonic);
        const provider = getJumperWalletProvider();
        if (provider) {
          provider.setAccount(account);
        }

        return true;
      } catch {
        return false;
      }
    },
    [address],
  );

  return {
    // State
    status,
    flow,
    address,
    hasStoredWallet,
    isConnected: status === 'unlocked' || status === 'signing',
    isLocked: status === 'locked',
    webauthnCredential,
    // True only when PRF credential + biometric-encrypted mnemonic are both present
    hasBiometric: canLoginWithBiometric,

    // Actions
    login,
    loginWithBiometric,
    registerBiometric,
    lock,
    destroy,
    setFlow,
    unlock,
    resolvePasswordRequest,
    resolveConnectRequest,
  };
}
