import type { PDA } from '@/types/loyaltyPass';

// XP earned in the previous calendar month. The monthly rewards batch is settled
// by a backend run early in the *following* month (e.g. May's rewards are
// timestamped 2026-06-01T04:11Z), so "last month" is the settled batch
// timestamped in the current calendar month. If nothing has settled this month
// (no activity last month), the result is 0 — we deliberately do NOT fall back
// to an older settled month. Months are compared in UTC to match the backend's
// UTC settlement timestamps (a local-time comparison would misbucket the
// early-UTC 1st-of-month timestamps for users west of UTC).
export const getLastSettledMonthXP = (pdas: PDA[]): number => {
  const now = new Date();
  const isCurrentUtcMonth = (date: Date) =>
    date.getUTCFullYear() === now.getUTCFullYear() &&
    date.getUTCMonth() === now.getUTCMonth();

  return pdas
    .filter((pda) => pda?.reward != null && !pda.ongoing)
    .filter((pda) => isCurrentUtcMonth(new Date(pda.timestamp)))
    .reduce((sum, pda) => sum + (pda.points ?? 0), 0);
};
