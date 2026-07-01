import { differenceInDays } from 'date-fns';
import type { DateRangeValue } from '@/components/composite/MultiLayer/MultiLayer.types';

export const datesBadge = (
  usedMin: Date,
  usedMax: Date,
  rangeMin: Date,
  rangeMax: Date,
  pendingValue: DateRangeValue,
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
