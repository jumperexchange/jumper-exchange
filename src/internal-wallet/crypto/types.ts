/**
 * Core type definitions for the Jumper Internal Wallet crypto layer.
 */

/** Versioned encrypted blob stored in IndexedDB */
export interface EncryptedBlob {
  /** Schema version for future migration */
  v: 1;
  /** Algorithm identifier */
  alg: 'PBKDF2-SHA256-AES256GCM';
  /** PBKDF2 iteration count */
  iter: number;
  /** 16-byte salt, base64-encoded */
  salt: string;
  /** 12-byte IV/nonce, base64-encoded */
  iv: string;
  /** Ciphertext + GCM auth tag, base64-encoded */
  ct: string;
  /** EVM address derived from this mnemonic (non-secret metadata) */
  addr: string;
}

/** A single Shamir share with metadata */
export interface ShamirShare {
  /** Base64-encoded share data */
  data: string;
  /** Minimum shares needed to reconstruct (k) */
  threshold: number;
  /** Total number of shares generated (n) */
  totalShares: number;
  /** Schema version */
  v: 1;
  /** EVM address for identification */
  addr: string;
}

/** SSS configuration */
export interface ShamirConfig {
  /** Total shares to generate (n) */
  totalShares: number;
  /** Minimum shares needed to reconstruct (k) */
  threshold: number;
}

/** Result of wallet generation */
export interface GeneratedWallet {
  /** 24-word BIP-39 mnemonic phrase */
  mnemonic: string;
  /** Raw 32-byte entropy */
  entropy: Uint8Array;
  /** Checksummed EVM address */
  address: `0x${string}`;
  /** Compressed public key hex */
  publicKey: `0x${string}`;
}

/** Result of SSS reconstruction */
export interface ReconstructionResult {
  /** Reconstructed 32-byte entropy */
  entropy: Uint8Array;
  /** Whether the entropy hash matches the expected hash */
  isValid: boolean;
  /** Reconstructed mnemonic phrase (only if valid) */
  mnemonic?: string;
  /** Derived EVM address (only if valid) */
  address?: `0x${string}`;
}

/** WebAuthn credential stored alongside the wallet */
export interface WebAuthnCredentialInfo {
  /** Base64url credential ID */
  credentialId: string;
  /** Whether the PRF extension is supported */
  prfSupported: boolean;
  /** When the credential was registered */
  createdAt: string;
}

/** Wallet status in the state machine */
export type JumperWalletStatus = 'none' | 'locked' | 'unlocked' | 'signing';

/** Current UI flow */
export type JumperWalletFlow =
  | 'idle'
  | 'signup'
  | 'login'
  | 'recovery'
  | 'password-prompt';

/** Share storage target identifier */
export type ShareStorageType =
  | 'localStorage'
  | 'email'
  | 'googleDrive'
  | 'recoveryCode';

/** Share storage target identifier */
export type ShareStorageProvider = 'browser' | 'email' | 'google' | 'manual';

export type ShareRetrievalType = 'auto' | 'manual';
