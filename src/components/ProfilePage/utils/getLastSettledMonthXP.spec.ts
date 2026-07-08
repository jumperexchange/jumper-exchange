import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PDA } from '@/types/loyaltyPass';
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
  beforeEach(() => {
    vi.useFakeTimers();
    // Mid-June: last month (May) settled at the start of June.
    vi.setSystemTime(new Date('2026-06-16T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sums last month's batch, settled early this month (UTC)", () => {
    const result = getLastSettledMonthXP([
      // May rewards, settled 2026-06-01 (UTC) -> counted as "last month".
      pda('2026-06-01T04:11:15.816Z', 10),
      pda('2026-06-01T04:11:15.816Z', 18),
      // April rewards, settled in May -> excluded.
      pda('2026-05-11T00:00:00.000Z', 25),
    ]);

    expect(result).toBe(28);
  });

  it('ignores ongoing rewards', () => {
    const result = getLastSettledMonthXP([
      pda('2026-06-16T02:03:44.337Z', 40, true),
      pda('2026-06-01T04:11:15.816Z', 10),
    ]);

    expect(result).toBe(10);
  });

  it('returns 0 when nothing settled this month (no activity last month)', () => {
    expect(getLastSettledMonthXP([])).toBe(0);
    // Only older settled batches -> no fall-back to an older month.
    expect(
      getLastSettledMonthXP([
        pda('2026-05-11T00:00:00.000Z', 25),
        pda('2026-04-01T02:31:45.306Z', 30),
      ]),
    ).toBe(0);
    expect(
      getLastSettledMonthXP([pda('2026-06-16T02:03:44.337Z', 40, true)]),
    ).toBe(0);
  });
});
