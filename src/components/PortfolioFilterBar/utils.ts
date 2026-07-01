import { formatSliderValue } from '@/components/core/form/Select/utils';
import { toFixedFractionDigits } from '@/utils/formatNumbers';
import { differenceInDays } from 'date-fns';

export const countBadge = (count: number): string | undefined =>
  count > 0 ? count.toString() : undefined;

export const datesBadge = (
  usedMin: Date,
  usedMax: Date,
  rangeMin: Date,
  rangeMax: Date,
  pendingValue: (Date | null)[],
  rangeLabel: string,
): string | undefined => {
  if (
    differenceInDays(usedMin, rangeMin) === 0 &&
    differenceInDays(usedMax, rangeMax) === 0
  ) {
    return;
  }

  const [start, end] = pendingValue;

  if (!start && !end) {
    return;
  }

  return rangeLabel;
};

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
