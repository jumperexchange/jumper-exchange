import { describe, expect, it } from 'vitest';
import type { PDA } from 'src/types/loyaltyPass';
import { getLastSettledMonthXP } from './getLastSettledMonthXP';

const pda = (timestamp: string, points: number, ongoing = false): PDA =>
  ({
    id: `${timestamp}-${points}`,
    points,
    timestamp: new Date(timestamp),
    ongoing,
    reward: { id: 1, name: 'r', description: '', image: '', type: 'swap_oor' },
  }) as PDA;

describe('getLastSettledMonthXP', () => {
  it('sums the newest settlement batch only', () => {
    const result = getLastSettledMonthXP([
      // Newest batch (May rewards, settled early June).
      pda('2026-06-02', 10),
      pda('2026-06-02', 18),
      // Older batch.
      pda('2026-05-01', 25),
    ]);

    expect(result).toBe(28);
  });

  it('ignores ongoing rewards', () => {
    const result = getLastSettledMonthXP([
      pda('2026-06-11', 40, true),
      pda('2026-06-02', 10),
    ]);

    expect(result).toBe(10);
  });

  it('returns 0 without settled rewards', () => {
    expect(getLastSettledMonthXP([])).toBe(0);
    expect(getLastSettledMonthXP([pda('2026-06-11', 40, true)])).toBe(0);
  });
});
