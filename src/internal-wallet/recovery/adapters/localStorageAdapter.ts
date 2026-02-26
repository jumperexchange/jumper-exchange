/**
 * Device Keychain Share Adapter
 *
 * Stores a Shamir recovery share on the local device.
 * Prefers the Credential Management API (PasswordCredential) for secure
 * browser-managed storage, falling back to localStorage when unavailable.
 */
import type {
  RetrieveShareParams,
  ShareMetadata,
  ShareStorageAdapter,
} from './ShareStorageAdapter.types';

const LS_SHARE_PREFIX = 'jumper-recovery-share-';

function localStorageKey(walletAddress: string): string {
  return `${LS_SHARE_PREFIX}${walletAddress}`;
}

/**
 * Scan localStorage for all stored recovery share keys and return the
 * wallet addresses they belong to. Useful during recovery when the
 * address is not known in advance (e.g. after a full data wipe).
 */
export function listStoredAddresses(): string[] {
  try {
    return Object.keys(localStorage)
      .filter((k) => k.startsWith(LS_SHARE_PREFIX))
      .map((k) => k.slice(LS_SHARE_PREFIX.length));
  } catch {
    return [];
  }
}

export class LocalStorageAdapter implements ShareStorageAdapter {
  static readonly retrieval = 'auto' as const;
  readonly retrieval = LocalStorageAdapter.retrieval;
  readonly type = 'localStorage' as const;
  readonly label = 'Local Storage';

  async store(share: string, metadata: ShareMetadata): Promise<boolean> {
    try {
      localStorage.setItem(localStorageKey(metadata.walletAddress), share);
      return true;
    } catch (e) {
      console.debug('Error storing share in localStorage:', e);
      return false;
    }
  }

  async retrieve(metadata: RetrieveShareParams): Promise<string | null> {
    try {
      return localStorage.getItem(localStorageKey(metadata.walletAddress));
    } catch {
      return null;
    }
  }

  async isAvailable(): Promise<boolean> {
    // localStorage is virtually always available, so this adapter is always usable
    return true;
  }
}
