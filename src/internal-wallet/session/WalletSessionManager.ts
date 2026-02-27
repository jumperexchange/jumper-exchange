/**
 * Wallet session manager for signing operations.
 *
 * Controls how long a decrypted wallet stays available for signing.
 * After session expiry or transaction limit, the user must re-authenticate.
 */
import { MAX_TX_PER_SESSION, SESSION_DURATION_MS } from '@/config/jumperWallet';

export interface WalletSession {
  /** Non-extractable CryptoKey for decrypting the mnemonic */
  decryptionKey: CryptoKey;
  /** Session start time */
  startedAt: number;
  /** Session expiry (absolute timestamp) */
  expiresAt: number;
  /** Number of transactions signed in this session */
  txCount: number;
  /** Maximum transactions before re-auth */
  maxTxPerSession: number;
}

export class WalletSessionManager {
  private session: WalletSession | null = null;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private onExpire?: () => void;

  constructor(onExpire?: () => void) {
    this.onExpire = onExpire;
  }

  /**
   * Create a new signing session.
   * Any existing session is destroyed first.
   */
  createSession(
    decryptionKey: CryptoKey,
    durationMs: number = SESSION_DURATION_MS,
    maxTx: number = MAX_TX_PER_SESSION,
  ): void {
    this.destroySession();

    const now = Date.now();
    this.session = {
      decryptionKey,
      startedAt: now,
      expiresAt: now + durationMs,
      txCount: 0,
      maxTxPerSession: maxTx,
    };

    this.timeoutId = setTimeout(() => {
      this.destroySession();
      this.onExpire?.();
    }, durationMs);
  }

  /**
   * Check if the session is still active.
   */
  isActive(): boolean {
    if (!this.session) {
      return false;
    }
    if (Date.now() > this.session.expiresAt) {
      this.destroySession();
      return false;
    }
    if (this.session.txCount >= this.session.maxTxPerSession) {
      this.destroySession();
      return false;
    }
    return true;
  }

  /**
   * Consume a transaction slot and return the decryption key.
   * Throws if no active session.
   */
  consumeForTransaction(): CryptoKey {
    if (!this.isActive()) {
      throw new Error('No active session. Re-authentication required.');
    }
    this.session!.txCount++;
    return this.session!.decryptionKey;
  }

  /**
   * Get remaining time in milliseconds.
   */
  getRemainingMs(): number {
    if (!this.session) {
      return 0;
    }
    return Math.max(0, this.session.expiresAt - Date.now());
  }

  /**
   * Destroy the current session, clearing all references.
   */
  destroySession(): void {
    this.session = null;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
