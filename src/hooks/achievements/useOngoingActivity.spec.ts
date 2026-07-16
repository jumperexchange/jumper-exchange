import { describe, expect, it } from 'vitest';
import { deriveOngoingActivity, sumEarnedXP } from './useOngoingActivity';

describe('deriveOngoingActivity', () => {
  it('always yields all four categories in display order', () => {
    const result = deriveOngoingActivity([]);

    expect(result.map((activity) => activity.type)).toEqual([
      'swap_oor',
      'earn_oor',
      'bridge_oor',
      'chain_oor',
    ]);
  });

  it('derives next-tier progress within a tier', () => {
    // 539 USD swapped: tier 100-999 (10 XP), next tier at 1000 (18 XP).
    const [swap] = deriveOngoingActivity([
      {
        type: 'swap_oor',
        currentValue: 539,
        min: 100,
        max: 999,
        currentRangeXP: 10,
        nextRangeXP: 18,
      },
    ]);

    expect(swap.availableXP).toBe(10);
    expect(swap.amountToNextTier).toBe(461);
    expect(swap.nextTierXP).toBe(18);
    expect(swap.isOutstanding).toBe(false);
    expect(swap.isTopTier).toBe(false);
    expect(swap.progress).toBeCloseTo(439 / 900);
  });

  it('treats values below the first tier as outstanding', () => {
    // 0 chains: the backend falls back to the first tier's ranges.
    const [, , , chain] = deriveOngoingActivity([
      {
        type: 'chain_oor',
        currentValue: 0,
        min: 1,
        max: 1,
        currentRangeXP: 5,
        nextRangeXP: 10,
      },
    ]);

    expect(chain.isOutstanding).toBe(true);
    expect(chain.progress).toBe(0);
    expect(chain.amountToNextTier).toBe(1);
    // Reaching the first tier earns its XP, not the following tier's.
    expect(chain.nextTierXP).toBe(5);
    expect(chain.availableXP).toBe(5);
  });

  it('marks zero-XP tiers as outstanding (earn tier 0)', () => {
    const [, earn] = deriveOngoingActivity([
      {
        type: 'earn_oor',
        currentValue: 50,
        min: 0,
        max: 99,
        currentRangeXP: 0,
        nextRangeXP: 5,
      },
    ]);

    expect(earn.isOutstanding).toBe(true);
    expect(earn.amountToNextTier).toBe(50);
    expect(earn.nextTierXP).toBe(5);
    expect(earn.availableXP).toBe(5);
  });

  it('caps the top tier at full progress', () => {
    const [swap] = deriveOngoingActivity([
      {
        type: 'swap_oor',
        currentValue: 600000,
        min: 500000,
        max: 999999,
        currentRangeXP: 50,
        nextRangeXP: 0,
      },
    ]);

    expect(swap.isTopTier).toBe(true);
    expect(swap.progress).toBe(1);
    expect(swap.availableXP).toBe(50);
  });

  it('sums only secured tier XP as earned', () => {
    const activities = deriveOngoingActivity([
      // In tier: 10 XP secured.
      {
        type: 'swap_oor',
        currentValue: 539,
        min: 100,
        max: 999,
        currentRangeXP: 10,
        nextRangeXP: 18,
      },
      // Below the first tier: the 5 XP is the backend fallback, not earned.
      {
        type: 'chain_oor',
        currentValue: 0,
        min: 1,
        max: 1,
        currentRangeXP: 5,
        nextRangeXP: 10,
      },
    ]);

    expect(sumEarnedXP(activities)).toBe(10);
  });

  it('pads missing categories with their zero state', () => {
    const [swap, earn, bridge, chain] = deriveOngoingActivity([]);

    expect(swap.amountToNextTier).toBe(100);
    expect(swap.availableXP).toBe(10);
    expect(earn.amountToNextTier).toBe(100);
    expect(earn.availableXP).toBe(5);
    expect(bridge.amountToNextTier).toBe(100);
    expect(chain.amountToNextTier).toBe(1);
    expect([swap, earn, bridge, chain].every((a) => a.isOutstanding)).toBe(
      true,
    );
  });
});
