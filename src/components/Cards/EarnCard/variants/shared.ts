import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';

export const APY_LABEL = 'APY';
export const APY_TOOLTIP = 'The APY is the annualized return you will receive';

export const LOCKUP_PERIOD_LABEL = 'Lockup Period';
export const LOCKUP_PERIOD_TOOLTIP =
  'The lockup period is the time you need to lock your assets for';

export const TVL_LABEL = 'TVL';
export const TVL_TOOLTIP = 'The TVL is the total value locked in the pool';

export const ASSETS_LABEL = 'Assets';
export const ASSETS_TOOLTIP = 'The assets you will earn from';

/**
 * Returns the data with at least minN elements and at most maxN elements, fill with null when loading.
 */
export const AtLeastNWhenLoading = <T>(
  data: T[] | undefined | null,
  isLoading: boolean,
  minN: number,
  maxN?: number,
): (T | null)[] => {
  maxN = maxN ?? minN;
  const d: T[] = data ?? [];
  const missingN = minN - d.length;
  const filler: null[] = isLoading ? Array(missingN).fill(null) : [];
  const result = [...d, ...filler].slice(0, maxN);
  return result;
};
