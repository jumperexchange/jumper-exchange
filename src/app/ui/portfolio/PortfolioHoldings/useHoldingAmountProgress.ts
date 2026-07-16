import { useMemo } from 'react';
import { sumBy } from 'lodash';
import { calcPercentage } from '@/providers/PortfolioProvider/utils';

export function useHoldingAmountProgress<T>(
  groups: [string, T[]][],
  getValue: (item: T) => number,
  totalPortfolioUsd: number,
) {
  return useMemo(() => {
    const amount = sumBy(groups, ([, items]) => sumBy(items, getValue));
    return { amount, progress: calcPercentage(amount, totalPortfolioUsd) };
  }, [groups, getValue, totalPortfolioUsd]);
}
