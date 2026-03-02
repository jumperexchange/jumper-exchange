/**
 * Zustand store factory for the Jumper Internal Wallet.
 *
 * Manages wallet lifecycle state and bridges between the wagmi connector
 * and UI components. Follows the pattern from createSettingsStore.tsx.
 *
 * Persistent state is stored in IndexedDB (via the storage/db.ts layer),
 * NOT through Zustand's persist middleware (which uses localStorage).
 * The store only keeps transient UI state in memory.
 */
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import type {
  EncryptedBlob,
  JumperWalletFlow,
  JumperWalletStatus,
  ShamirConfig,
  ShamirShare,
  WebAuthnCredentialInfo,
} from '@/internal-wallet/crypto/types';
import {
  registerWebAuthnCredential,
  authenticateWithPRF,
  encryptWithPRFKey,
  decryptWithPRFKey,
  computePRFSalt,
} from '@/internal-wallet/crypto/webauthn';
import { generateWallet } from '@/internal-wallet/crypto/mnemonic';
import {
  encryptMnemonic,
  decryptMnemonic,
} from '@/internal-wallet/crypto/encryption';
import { splitEntropy } from '@/internal-wallet/crypto/shamir';
import {
  saveWallet,
  getWallet,
  deleteWallet,
} from '@/internal-wallet/storage/db';
import type { StoredWallet } from '@/internal-wallet/storage/types';
import { LocalStorageAdapter } from '@/internal-wallet/recovery/adapters/localStorageAdapter';
import type { AdapterFields } from '@/internal-wallet/recovery/adapters/ShareStorageAdapter.types';
import { getJumperWalletProvider } from '@/internal-wallet/connector/jumperWalletConnector';
import {
  JUMPER_WALLET_ADDRESS_KEY,
  DEFAULT_SHAMIR_CONFIG,
} from '@/config/jumperWallet';
import { mnemonicToAccount } from 'viem/accounts';
import type { LocalAccount } from 'viem/accounts';

export interface JumperWalletState {
  // --- Transient State (in-memory only) ---
  status: JumperWalletStatus;
  flow: JumperWalletFlow;
  signupStep: number;
  recoveryStep: number;

  // --- Cached from IndexedDB ---
  address: `0x${string}` | null;
  shamirConfig: ShamirConfig;
  hasStoredWallet: boolean;
  webauthnCredential: WebAuthnCredentialInfo | null;
  /**
   * True only when both the PRF credential was registered AND the biometric-encrypted
   * mnemonic blob was stored. This is the single gate for showing the biometric login button.
   */
  canLoginWithBiometric: boolean;

  // --- Password bridge for signing ---
  pendingPasswordResolve: ((password: string | null) => void) | null;
  pendingConnectResolve: ((address: `0x${string}` | null) => void) | null;

  // --- Actions ---
  setFlow: (flow: JumperWalletFlow) => void;
  setSignupStep: (step: number) => void;
  setRecoveryStep: (step: number) => void;
  setShamirConfig: (config: ShamirConfig) => void;

  /**
   * Create a new wallet: generate mnemonic, encrypt, store, split for recovery.
   * Returns the mnemonic and shares for the UI to distribute.
   */
  createWallet: (password: string) => Promise<{
    address: `0x${string}`;
    mnemonic: string;
    shares: ShamirShare[];
  }>;

  /**
   * Login with password. Decrypts mnemonic to verify, then locks again.
   * Returns true on success, false on wrong password.
   */
  login: (password: string) => Promise<boolean>;

  /** Lock the wallet (clear signing state) */
  lock: () => void;

  /** Destroy the wallet entirely (delete from IndexedDB + localStorage) */
  destroy: () => Promise<void>;

  /** Initialize the store by checking IndexedDB for existing wallets */
  initialize: () => Promise<void>;

  /**
   * Request a password from the user (for signing operations).
   * Sets flow to 'password-prompt' and returns a Promise that resolves
   * when the user enters their password (or null if cancelled).
   */
  requestPassword: () => Promise<string | null>;

  /** Resolve a pending password request (called by the UI) */
  resolvePasswordRequest: (password: string | null) => void;

  /**
   * Prompt the user for their password, decrypt the mnemonic, set the account
   * on the provider, and return the LocalAccount — or null if cancelled/wrong password.
   * Used by the provider to unblock a signing request on-the-fly.
   */
  requestUnlock: () => Promise<LocalAccount | null>;

  /**
   * Called when the wagmi connector wants to connect.
   * Returns a Promise that resolves with the address after sign-up/login.
   */
  handleConnectRequest: () => Promise<`0x${string}` | null>;

  /** Resolve a pending connect request (called by the UI after sign-up/login) */
  resolveConnectRequest: (address: `0x${string}` | null) => void;

  /**
   * Store the encrypted blob and shares after recovery.
   */
  /**
   * Store the encrypted blob and shares after recovery.
   */
  storeRecoveredWallet: (
    encryptedBlob: EncryptedBlob,
    address: `0x${string}`,
    shares: ShamirShare[],
  ) => Promise<void>;

  /**
   * Persist which share storage types were successfully distributed
   * and optionally the adapter field values, to the IndexedDB wallet record.
   */
  updateStoredShareTypes: (
    types: string[],
    adapterFields?: Partial<AdapterFields>,
  ) => Promise<void>;

  /**
   * Register a WebAuthn (biometric) credential for the current wallet.
   * If the authenticator supports PRF, also stores a biometric-encrypted
   * copy of the mnemonic so subsequent logins need no password.
   * @param password - Current wallet password (needed to decrypt the mnemonic for PRF encryption)
   */
  registerBiometric: (password: string) => Promise<boolean>;

  /**
   * Unlock the wallet using the registered biometric credential (PRF path).
   * Returns true on success, false if no credential, PRF unavailable, or auth failed.
   */
  loginWithBiometric: () => Promise<boolean>;
}

export const createJumperWalletStore = () =>
  createWithEqualityFn<JumperWalletState>(
    (set, get) => ({
      // Initial state
      status: 'none',
      flow: 'idle',
      signupStep: 0,
      recoveryStep: 0,
      address: null,
      shamirConfig: DEFAULT_SHAMIR_CONFIG,
      hasStoredWallet: false,
      webauthnCredential: null,
      canLoginWithBiometric: false,
      pendingPasswordResolve: null,
      pendingConnectResolve: null,

      setFlow: (flow) => set({ flow }),
      setSignupStep: (step) => set({ signupStep: step }),
      setRecoveryStep: (step) => set({ recoveryStep: step }),
      setShamirConfig: (config) => set({ shamirConfig: config }),

      initialize: async () => {
        const storedAddress = localStorage.getItem(JUMPER_WALLET_ADDRESS_KEY);
        if (storedAddress) {
          const wallet = await getWallet(storedAddress);
          if (wallet) {
            set({
              address: storedAddress as `0x${string}`,
              shamirConfig: wallet.shamirConfig,
              hasStoredWallet: true,
              status: 'locked',
              webauthnCredential: wallet.webauthnCredential ?? null,
              canLoginWithBiometric: !!(
                wallet.webauthnCredential?.prfSupported &&
                wallet.biometricEncryptedMnemonic
              ),
            });
          } else {
            // Address in localStorage but not in IndexedDB — clean up
            localStorage.removeItem(JUMPER_WALLET_ADDRESS_KEY);
          }
        }
      },

      createWallet: async (password) => {
        const wallet = generateWallet();

        // Encrypt mnemonic
        const encryptedBlob = await encryptMnemonic(
          wallet.mnemonic,
          password,
          wallet.address,
        );

        // Split entropy into shares
        const { shamirConfig } = get();
        const shares = await splitEntropy(
          wallet.entropy,
          wallet.address,
          shamirConfig,
        );

        // Store in IndexedDB
        const storedWallet: StoredWallet = {
          address: wallet.address,
          encryptedMnemonic: encryptedBlob,
          shamirConfig,
          storedShareTypes: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await saveWallet(storedWallet);

        // Update localStorage for quick reconnect
        localStorage.setItem(JUMPER_WALLET_ADDRESS_KEY, wallet.address);

        set({
          address: wallet.address,
          status: 'unlocked',
          hasStoredWallet: true,
          // Don't set flow to 'idle' here — the signup wizard still
          // needs to show mnemonic backup + recovery steps.
          // flow goes to 'idle' when completeSetup() is called.
        });

        return {
          address: wallet.address,
          mnemonic: wallet.mnemonic,
          shares,
        };
      },

      login: async (password) => {
        const { address } = get();
        if (!address) {
          return false;
        }

        const storedWallet = await getWallet(address);
        if (!storedWallet) {
          return false;
        }

        try {
          // Attempt decryption to verify password
          await decryptMnemonic(storedWallet.encryptedMnemonic, password);
          set({ status: 'unlocked', flow: 'idle' });
          return true;
        } catch {
          return false; // Wrong password
        }
      },

      lock: () => {
        getJumperWalletProvider()?.setAccount(null);
        set({ status: 'locked' });
      },

      destroy: async () => {
        const { address } = get();
        if (address) {
          await deleteWallet(address);
        }
        localStorage.removeItem(JUMPER_WALLET_ADDRESS_KEY);
        set({
          status: 'none',
          flow: 'idle',
          address: null,
          hasStoredWallet: false,
          signupStep: 0,
          recoveryStep: 0,
        });
      },

      requestPassword: () => {
        return new Promise<string | null>((resolve) => {
          set({ flow: 'password-prompt', pendingPasswordResolve: resolve });
        });
      },

      resolvePasswordRequest: (password) => {
        const { pendingPasswordResolve } = get();
        if (pendingPasswordResolve) {
          pendingPasswordResolve(password);
          set({ flow: 'idle', pendingPasswordResolve: null });
        }
      },

      requestUnlock: async () => {
        const { address, requestPassword } = get();
        if (!address) {
          return null;
        }

        const password = await requestPassword();

        // Biometric path: account already set on provider by loginWithBiometric()
        if (password === '__biometric__') {
          const acct = getJumperWalletProvider()?.getAccount() ?? null;
          if (acct) {
            set({ status: 'unlocked' });
          }
          return acct;
        }

        if (!password) {
          return null;
        }

        const storedWallet = await getWallet(address);
        if (!storedWallet) {
          return null;
        }

        try {
          const mnemonic = await decryptMnemonic(
            storedWallet.encryptedMnemonic,
            password,
          );
          const localAccount = mnemonicToAccount(mnemonic);
          getJumperWalletProvider()?.setAccount(localAccount);
          set({ status: 'unlocked' });
          return localAccount;
        } catch {
          return null;
        }
      },

      handleConnectRequest: () => {
        const { hasStoredWallet } = get();
        return new Promise<`0x${string}` | null>((resolve) => {
          set({
            flow: hasStoredWallet ? 'login' : 'signup',
            pendingConnectResolve: resolve,
          });
        });
      },

      resolveConnectRequest: (address) => {
        const { pendingConnectResolve } = get();
        if (pendingConnectResolve) {
          pendingConnectResolve(address);
          set({ pendingConnectResolve: null });
        }
      },

      updateStoredShareTypes: async (types, adapterFields) => {
        const { address } = get();
        if (!address) {
          return;
        }
        const wallet = await getWallet(address);
        if (!wallet) {
          return;
        }
        wallet.storedShareTypes = types;
        if (adapterFields) {
          wallet.adapterFields = adapterFields;
        }
        wallet.updatedAt = new Date().toISOString();
        await saveWallet(wallet);
      },

      storeRecoveredWallet: async (encryptedBlob, address, shares) => {
        const { shamirConfig } = get();

        const storedWallet: StoredWallet = {
          address,
          encryptedMnemonic: encryptedBlob,
          shamirConfig,
          storedShareTypes: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await saveWallet(storedWallet);

        localStorage.setItem(JUMPER_WALLET_ADDRESS_KEY, address);

        set({
          address,
          status: 'unlocked',
          hasStoredWallet: true,
          flow: 'idle',
          recoveryStep: 0,
        });
      },

      registerBiometric: async (password) => {
        const { address } = get();
        if (!address) {
          return false;
        }

        const storedWallet = await getWallet(address);
        if (!storedWallet) {
          return false;
        }

        try {
          // Verify password is correct and obtain mnemonic for PRF encryption
          const mnemonic = await decryptMnemonic(
            storedWallet.encryptedMnemonic,
            password,
          );

          // Trigger biometric registration (opens browser UI)
          const { credential, prfKey } = await registerWebAuthnCredential(
            address,
            'Jumper Account',
          );

          const updatedWallet: StoredWallet = {
            ...storedWallet,
            webauthnCredential: credential,
            updatedAt: new Date().toISOString(),
          };

          console.log('bio, prfKey', prfKey);

          if (prfKey) {
            // PRF-capable authenticator: store mnemonic encrypted with hardware-derived key
            updatedWallet.biometricEncryptedMnemonic = await encryptWithPRFKey(
              mnemonic,
              prfKey,
            );
          }

          await saveWallet(updatedWallet);
          set({
            webauthnCredential: credential,
            canLoginWithBiometric: !!(
              credential.prfSupported &&
              updatedWallet.biometricEncryptedMnemonic
            ),
          });
          return true;
        } catch (e) {
          console.error('Error registering biometric credential:', e);
          return false;
        }
      },

      loginWithBiometric: async () => {
        const { address } = get();
        if (!address) {
          return false;
        }

        const storedWallet = await getWallet(address);
        if (!storedWallet?.webauthnCredential) {
          return false;
        }

        const { credentialId, prfSupported } = storedWallet.webauthnCredential;

        // Only the PRF path can derive the decryption key from biometrics alone
        if (!prfSupported || !storedWallet.biometricEncryptedMnemonic) {
          return false;
        }

        try {
          const prfSalt = await computePRFSalt(address);
          const prfKey = await authenticateWithPRF(credentialId, prfSalt);

          // Decrypt the biometric blob and set the account on the provider
          const mnemonic = await decryptWithPRFKey(
            storedWallet.biometricEncryptedMnemonic,
            prfKey,
          );
          const localAccount = mnemonicToAccount(mnemonic);
          getJumperWalletProvider()?.setAccount(localAccount);

          set({ status: 'unlocked', flow: 'idle' });
          return true;
        } catch {
          return false;
        }
      },
    }),
    shallow,
  );
