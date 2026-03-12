import { formatSliderValue } from '@/components/core/form/Select/utils';
import { toFixedFractionDigits } from '@/utils/formatNumbers';
import type { CategoryConfig } from '@/components/composite/MultiLayer/MultiLayer.types';

export const countBadge = (count: number): string | undefined =>
  count > 0 ? count.toString() : undefined;

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
