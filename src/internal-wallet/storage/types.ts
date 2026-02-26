/**
 * Storage layer type definitions for the Jumper Internal Wallet.
 */
import type {
  EncryptedBlob,
  ShamirConfig,
  ShareStorageType,
  WebAuthnCredentialInfo,
} from '../crypto/types';
import type { AdapterFields } from '../recovery/adapters/ShareStorageAdapter.types';

/** Primary wallet record stored in IndexedDB */
export interface StoredWallet {
  /** Primary key: checksummed EVM address */
  address: string;
  /** Password-encrypted mnemonic */
  encryptedMnemonic: EncryptedBlob;
  /** SSS configuration used for this wallet */
  shamirConfig: ShamirConfig;
  /** WebAuthn credential info */
  webauthnCredential?: WebAuthnCredentialInfo;
  /** Mnemonic encrypted with PRF-derived key (for biometric login) */
  biometricEncryptedMnemonic?: { iv: string; ct: string };
  /** User-provided field values for adapters that require them (e.g. email address) */
  adapterFields?: Partial<AdapterFields>;
  /** Which remote share types have been stored */
  storedShareTypes: string[];
  /** When the wallet was created */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
}

/** Metadata about remotely-stored SSS shares */
export interface RemoteShareMetadata {
  /** Wallet address this share belongs to */
  address: string;
  /** Where the share is stored (unique per wallet) */
  location: ShareStorageType;
  /** When the share was stored */
  storedAt: string;
  /** Remote ID (e.g., Google Drive file ID) */
  remoteId?: string;
}
