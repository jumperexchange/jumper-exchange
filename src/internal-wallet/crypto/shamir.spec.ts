import { describe, expect, it } from 'vitest';
import {
  combineShares,
  DEFAULT_SHAMIR_CONFIG,
  splitEntropy,
  validateShamirConfig,
} from './shamir';

const TEST_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';

function randomEntropy(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32));
}

describe('shamir', () => {
  describe('validateShamirConfig', () => {
    it('accepts valid config (k=2, n=4)', () => {
      expect(() =>
        validateShamirConfig({ threshold: 2, totalShares: 4 }),
      ).not.toThrow();
    });

    it('rejects threshold < 2', () => {
      expect(() =>
        validateShamirConfig({ threshold: 1, totalShares: 4 }),
      ).toThrow('Threshold must be at least 2');
    });

    it('rejects threshold >= totalShares', () => {
      expect(() =>
        validateShamirConfig({ threshold: 4, totalShares: 4 }),
      ).toThrow('Threshold must be less than total shares');
    });

    it('rejects totalShares > 255', () => {
      expect(() =>
        validateShamirConfig({ threshold: 2, totalShares: 256 }),
      ).toThrow('Total shares cannot exceed 255');
    });
  });

  describe('splitEntropy', () => {
    it('produces the correct number of shares', async () => {
      const entropy = randomEntropy();
      const shares = await splitEntropy(entropy, TEST_ADDRESS);

      expect(shares).toHaveLength(DEFAULT_SHAMIR_CONFIG.totalShares);
    });

    it('each share has the correct metadata', async () => {
      const entropy = randomEntropy();
      const shares = await splitEntropy(entropy, TEST_ADDRESS);

      for (const share of shares) {
        expect(share.threshold).toBe(DEFAULT_SHAMIR_CONFIG.threshold);
        expect(share.totalShares).toBe(DEFAULT_SHAMIR_CONFIG.totalShares);
        expect(share.v).toBe(1);
        expect(share.addr).toBe(TEST_ADDRESS);
        expect(share.data).toBeTruthy();
      }
    });

    it('rejects non-32-byte entropy', async () => {
      const shortEntropy = new Uint8Array(16);
      await expect(splitEntropy(shortEntropy, TEST_ADDRESS)).rejects.toThrow(
        'Expected 256-bit (32-byte) entropy',
      );
    });

    it('supports custom k and n', async () => {
      const entropy = randomEntropy();
      const config = { threshold: 3, totalShares: 5 };
      const shares = await splitEntropy(entropy, TEST_ADDRESS, config);

      expect(shares).toHaveLength(5);
      expect(shares[0].threshold).toBe(3);
      expect(shares[0].totalShares).toBe(5);
    });
  });

  describe('combineShares', () => {
    it('reconstructs entropy from k shares (2 of 4)', async () => {
      const entropy = randomEntropy();
      const shares = await splitEntropy(entropy, TEST_ADDRESS);

      // Use only 2 shares (the threshold)
      const result = await combineShares([shares[0], shares[2]]);

      expect(result.entropy).toEqual(entropy);
    });

    it('reconstructs from any k combination', async () => {
      const entropy = randomEntropy();
      const shares = await splitEntropy(entropy, TEST_ADDRESS);

      // Try different 2-of-4 combinations
      const combinations = [
        [shares[0], shares[1]],
        [shares[0], shares[3]],
        [shares[1], shares[2]],
        [shares[2], shares[3]],
      ];

      for (const combo of combinations) {
        const result = await combineShares(combo);
        expect(result.entropy).toEqual(entropy);
      }
    });

    it('works with more than k shares', async () => {
      const entropy = randomEntropy();
      const shares = await splitEntropy(entropy, TEST_ADDRESS);

      // Use all 4 shares (more than k=2)
      const result = await combineShares(shares);
      expect(result.entropy).toEqual(entropy);
    });

    it('rejects fewer than 2 shares', async () => {
      const entropy = randomEntropy();
      const shares = await splitEntropy(entropy, TEST_ADDRESS);

      await expect(combineShares([shares[0]])).rejects.toThrow(
        'At least 2 shares are required',
      );
    });

    it('works with custom threshold (3 of 5)', async () => {
      const entropy = randomEntropy();
      const config = { threshold: 3, totalShares: 5 };
      const shares = await splitEntropy(entropy, TEST_ADDRESS, config);

      const result = await combineShares([shares[0], shares[2], shares[4]]);
      expect(result.entropy).toEqual(entropy);
    });
  });
});
