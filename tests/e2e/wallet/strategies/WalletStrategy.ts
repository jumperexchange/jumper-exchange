import type { WalletCreationResult, WalletType } from '../types';

/**
 * Strategy interface for creating wallet instances.
 */
export interface WalletStrategy {
  /**
   * Creates a wallet instance and returns its context.
   */
  createWallet(): Promise<WalletCreationResult>;

  /**
   * Wallet type identifier used by the factory.
   */
  readonly type: WalletType;
}
