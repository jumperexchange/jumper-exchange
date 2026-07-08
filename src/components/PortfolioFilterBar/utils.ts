import { formatSliderValue } from '@/components/core/form/Select/utils';
import { toFixedFractionDigits } from '@/utils/formatNumbers';

export { datesBadge } from '@/utils/filters/datesBadge';

export const countBadge = (count: number): string | undefined =>
  count > 0 ? count.toString() : undefined;

// The transactions API accepts chain filters XOR asset filters. Selecting in
// one category replaces the other's pending selection; clearing back to empty
// leaves the sibling untouched.
export const selectExclusiveFilter = (
  selected: string[],
  sibling: string[],
): { selected: string[]; sibling: string[] } => ({
  selected,
  sibling: selected.length ? [] : sibling,
});

export const mergeChainTokenSelection = (
  assets: string[],
  chainPrefix: string,
  newChainAssets: string[],
): string[] => [
  ...assets.filter((a) => !a.startsWith(chainPrefix)),
  ...newChainAssets,
];

export const valueBadge = (
  usedMin: number,
  usedMax: number,
  rangeMin: number,
  rangeMax: number,
  pendingValue: number[],
): string | undefined => {
  if (
    isNaN(usedMin) ||
    isNaN(usedMax) ||
    (usedMin === rangeMin && usedMax === rangeMax)
  ) {
    return undefined;
  }
  return formatSliderValue(
    pendingValue.map((v) => toFixedFractionDigits(v, 0, 2)),
  );
};
