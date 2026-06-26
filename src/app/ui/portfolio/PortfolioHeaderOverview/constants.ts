import type { BalanceHistoryPeriod } from '@/hooks/portfolio/usePortfolioBalanceHistory';

export const PERIOD_LABELS: Record<BalanceHistoryPeriod, string> = {
  day: '1D',
  week: '1W',
  month: '1M',
  '3months': '3M',
  year: '1Y',
  all: 'All',
};

export const PERIODS = Object.keys(PERIOD_LABELS) as BalanceHistoryPeriod[];
