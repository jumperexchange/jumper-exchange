import MetaMaskStrategy from '../strategies/MetaMaskStrategy';

import type { WalletStrategy } from '../strategies/WalletStrategy';
import type { WalletCreationResult, WalletType } from '../types';

/**
 * Factory for creating different wallet page instances.
 */
export default class WalletFactory {
  private static readonly registry: Map<WalletType, WalletStrategy> = new Map(
    [new MetaMaskStrategy()].map((s) => [s.type, s] as const),
  );

  /**
   * Creates a wallet using the registered strategy.
   * @param walletType - Wallet type string.
   */
  static async createWallet(walletType: string): Promise<WalletCreationResult> {
    const key = walletType.toLowerCase() as WalletType;
    const strategy = this.registry.get(key);

    if (!strategy) {
      const supported = Array.from(this.registry.keys()).join(', ');
      throw new Error(
        `Unsupported wallet type: ${walletType}. Supported: ${supported}`,
      );
    }

    return strategy.createWallet();
  }

  /**
   * Register or override a wallet strategy at runtime.
   */
  static register(strategy: WalletStrategy): void {
    this.registry.set(strategy.type, strategy);
  }
}
