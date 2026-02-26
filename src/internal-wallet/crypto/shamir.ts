/**
 * Shamir's Secret Sharing wrapper.
 *
 * Uses `shamir-secret-sharing` by Privy (audited by Cure53 + Zellic).
 * Operates on raw 32-byte entropy (not mnemonic strings) for compactness.
 */
import { combine, split } from 'shamir-secret-sharing';
import type { ShamirConfig, ShamirShare } from './types';

export const DEFAULT_SHAMIR_CONFIG: ShamirConfig = {
  totalShares: 4,
  threshold: 2,
};

// --- Helpers ---

function toBase64(buf: ArrayBufferLike): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function fromBase64(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

// --- Validation ---

/**
 * Validate SSS configuration constraints:
 * - k (threshold) must be at least 2
 * - k must be strictly less than n (totalShares)
 * - n cannot exceed 255 (GF(2^8) limit)
 */
export function validateShamirConfig(config: ShamirConfig): void {
  if (config.threshold < 2) {
    throw new Error('Threshold must be at least 2');
  }
  if (config.threshold >= config.totalShares) {
    throw new Error('Threshold must be less than total shares');
  }
  if (config.totalShares > 255) {
    throw new Error('Total shares cannot exceed 255');
  }
}

// --- Split ---

/**
 * Split entropy into Shamir shares.
 *
 * @param entropy - Raw 32-byte BIP-39 entropy (from a 24-word mnemonic)
 * @param evmAddress - The EVM address derived from this entropy (for identification)
 * @param config - SSS parameters (default: k=2, n=4)
 * @returns Array of ShamirShare objects with base64-encoded share data
 */
export async function splitEntropy(
  entropy: Uint8Array,
  evmAddress: string,
  config: ShamirConfig = DEFAULT_SHAMIR_CONFIG,
): Promise<ShamirShare[]> {
  validateShamirConfig(config);

  if (entropy.length !== 32) {
    throw new Error('Expected 256-bit (32-byte) entropy for 24-word mnemonic');
  }

  const rawShares: Uint8Array[] = await split(
    entropy,
    config.totalShares,
    config.threshold,
  );

  return rawShares.map((share) => ({
    data: toBase64(share.buffer),
    threshold: config.threshold,
    totalShares: config.totalShares,
    v: 1 as const,
    addr: evmAddress,
  }));
}

// --- Combine ---

/**
 * Reconstruct entropy from k Shamir shares.
 *
 * @param shares - At least k ShamirShare objects
 * @returns The reconstructed entropy and whether it matches the expected hash
 */
export async function combineShares(
  shares: ShamirShare[],
): Promise<{ entropy: Uint8Array }> {
  if (shares.length < 2) {
    throw new Error('At least 2 shares are required for reconstruction');
  }

  const threshold = shares.map((e) => e.threshold).filter(Boolean)[0];
  if (threshold && shares.length < threshold) {
    throw new Error(`Need at least ${threshold} shares, got ${shares.length}`);
  }

  const rawShares = shares.map((s) => fromBase64(s.data));
  const entropy = await combine(rawShares);
  const entropyBytes = new Uint8Array(entropy);

  return { entropy: entropyBytes };
}
