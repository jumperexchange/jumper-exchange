import { differenceInDays, format } from 'date-fns';

export const countBadge = (count: number): string | undefined =>
  count > 0 ? count.toString() : undefined;

export const readingDurationBadge = (
  value: number[],
  rangeMin: number,
  rangeMax: number,
): string | undefined => {
  if (value[0] === rangeMin && value[1] === rangeMax) {
    return undefined;
  }
  return `${value[0]} - ${value[1]} mins`;
};

export const datesBadge = (
  usedMin: Date,
  usedMax: Date,
  rangeMin: Date,
  rangeMax: Date,
  pendingValue: (Date | null)[],
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

  return `1 range`;
};
