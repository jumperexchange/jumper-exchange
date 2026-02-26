/**
 * Configuration constants for the Jumper Internal Wallet.
 */
import type { ShamirConfig } from '@/internal-wallet/crypto/types';

/** wagmi connector ID */
export const JUMPER_WALLET_CONNECTOR_ID = 'jumperWallet';

/** Display name in wallet menu */
export const JUMPER_WALLET_CONNECTOR_NAME = 'Jumper Account';

/** localStorage key for quick address lookup (wagmi reconnect) */
export const JUMPER_WALLET_ADDRESS_KEY = 'jumper-wallet-address';

/** Default SSS configuration */
export const DEFAULT_SHAMIR_CONFIG: ShamirConfig = {
  totalShares: 4,
  threshold: 2,
};

/** Signing session duration in milliseconds (5 minutes) */
export const SESSION_DURATION_MS = 5 * 60 * 1000;

/** Maximum transactions per signing session */
export const MAX_TX_PER_SESSION = 1;

/** Minimum password length */
export const MIN_PASSWORD_LENGTH = 12;

/** Minimum password score (0-4 scale, 3 = "safely unguessable") */
export const MIN_PASSWORD_SCORE = 3;

/** HD derivation path for EVM */
export const EVM_HD_PATH = "m/44'/60'/0'/0/0" as const;

/** Auto-lock timeout in milliseconds (15 minutes of inactivity) */
export const AUTO_LOCK_TIMEOUT_MS = 15 * 60 * 1000;

/** Visibility change lock: lock immediately when tab becomes hidden for this long (2 minutes) */
export const VISIBILITY_LOCK_DELAY_MS = 2 * 60 * 1000;
