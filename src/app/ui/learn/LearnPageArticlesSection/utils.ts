import { format } from 'date-fns';

export const countBadge = (count: number): string | undefined =>
  count > 0 ? count.toString() : undefined;

export const datesBadge = (
  usedMin: Date,
  usedMax: Date,
  rangeMin: Date,
  rangeMax: Date,
  pendingValue: (Date | null)[],
): string | undefined => {
  if (usedMin === rangeMin && usedMax === rangeMax) {
    return;
  }

  const [start, end] = pendingValue;

  if (!start && !end) {
    return;
  }
  if (start && !end) {
    return `From ${format(start, 'd MMM yy')}`;
  }
  if (!start && end) {
    return `Until ${format(end, 'd MMM yy')}`;
  }
  if (start && end) {
    return `${format(start, 'd MMM yy')}-${format(end, 'd MMM yy')}`;
  }

  return;
};
