import { compareDesc, isSameMonth } from 'date-fns';
import type { PDA } from 'src/types/loyaltyPass';

// XP from the most recent settlement batch. Settled wallet rewards are
// timestamped by the settlement run — last month's rewards land early this
// month — so "last month" is the newest calendar month containing settled
// rewards, not the previous calendar month.
export const getLastSettledMonthXP = (pdas: PDA[]): number => {
  const settled = pdas.filter((pda) => pda?.reward != null && !pda.ongoing);

  if (settled.length === 0) {
    return 0;
  }

  const [newest] = settled
    .map((pda) => new Date(pda.timestamp))
    .sort(compareDesc);

  return settled
    .filter((pda) => isSameMonth(new Date(pda.timestamp), newest))
    .reduce((sum, pda) => sum + (pda.points ?? 0), 0);
};
