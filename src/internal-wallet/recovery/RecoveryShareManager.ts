/**
 * RecoveryShareManager
 *
 * Orchestrates the distribution and collection of Shamir's Secret Sharing
 * shares across multiple storage backends. Each share is sent to a different
 * adapter so that no single storage location holds enough shares to
 * reconstruct the wallet.
 */
import type { ShamirShare, ShareStorageType } from '../crypto/types';
import type {
  ShareMetadata,
  ShareStorageAdapter,
} from './adapters/ShareStorageAdapter.types';

export interface ShareDistributionResult {
  type: string;
  success: boolean;
  error?: string;
}

export class RecoveryShareManager {
  constructor(private adapters: ShareStorageAdapter[]) {}

  /**
   * Distribute shares to their respective storage adapters in parallel.
   *
   * The i-th share is sent to the i-th adapter. If there are more shares
   * than adapters (or vice-versa), the extra items are ignored.
   *
   * @param shares  - Array of ShamirShare objects produced by `splitEntropy`
   * @param walletAddress - The EVM address of the wallet being backed up
   * @returns One result per adapter, indicating success or failure
   */
  async distributeShares(
    shares: ShamirShare[],
    walletAddress: string,
  ): Promise<ShareDistributionResult[]> {
    const count = Math.min(shares.length, this.adapters.length);
    const now = Date.now();

    const tasks = Array.from({ length: count }, (_, i) => {
      const adapter = this.adapters[i];
      const share = shares[i];
      const metadata: ShareMetadata = {
        walletAddress,
        createdAt: now,
      };

      return adapter
        .store(share.data, metadata)
        .then(
          (success): ShareDistributionResult => ({
            type: adapter.type,
            success,
            ...(!success ? { error: 'Adapter returned false' } : {}),
          }),
        )
        .catch(
          (error: unknown): ShareDistributionResult => ({
            type: adapter.type,
            success: false,
            error:
              error instanceof Error ? error.message : 'Unknown store error',
          }),
        );
    });

    return Promise.all(tasks);
  }

  /**
   * Collect shares from a set of adapters in parallel.
   *
   * Only successfully retrieved (non-null) shares are included in the result.
   * The caller can use the returned array together with `combineShares` once
   * enough shares have been gathered.
   *
   * @param adapters - Adapters to attempt retrieval from
   * @param walletAddress - The EVM address of the wallet being recovered
   * @returns Array of retrieved shares with their adapter type
   */
  async collectShares(
    adapters: ShareStorageAdapter[],
    walletAddress: string,
  ): Promise<{ share: string; type: string }[]> {
    const tasks = adapters.map(async (adapter) => {
      try {
        const isReady = await adapter.isAvailable();
        if (!isReady) {
          return null;
        }

        const metadata = {
          walletAddress,
        };

        const share = await adapter.retrieve(metadata);
        if (share) {
          return { share, type: adapter.type };
        }
        return null;
      } catch (error) {
        console.error(
          `[RecoveryShareManager] Failed to collect share from ${adapter.type}:`,
          error,
        );
        return null;
      }
    });

    const results = await Promise.all(tasks);
    return results.filter(
      (r): r is { share: string; type: ShareStorageType } => r !== null,
    );
  }
}
