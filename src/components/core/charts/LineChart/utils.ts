import { groupBy, uniq } from 'lodash';
import { TOOLTIP_CONFIG, Y_AXIS_CONFIG } from './constants';
import type { ChartDataPoint } from './LineChart';

/**
 * Calculates the optimal tooltip position to prevent it from going outside the container bounds
 */
export const calculateTooltipPosition = (
  pointX: number,
  pointY: number,
  containerWidth: number,
  containerHeight: number,
) => {
  const left = pointX;
  let transform = 'translateX(0)';
  if (left > containerWidth - TOOLTIP_CONFIG.MIN_WIDTH) {
    transform = 'translateX(-100%)';
  } else if (left > TOOLTIP_CONFIG.MIN_WIDTH) {
    transform = 'translateX(-50%)';
  }

  let top = pointY + TOOLTIP_CONFIG.MARGIN;
  if (top > containerHeight - TOOLTIP_CONFIG.HEIGHT) {
    top = pointY - TOOLTIP_CONFIG.HEIGHT - TOOLTIP_CONFIG.MARGIN;
  }

  return { x: left, y: top, transform };
};

/**
 * @deprecated
 * Calculates the visible y range for the chart with padding to prevent curve clipping
 * Uses range-based padding which is more mathematically sound than value-based padding:
 * - Scale-independent (works with any magnitude of values)
 * - Handles edge cases (values near zero, negative values)
 * - Proportional to data variation
 */
export const calculateVisibleYRangeOld = <
  V extends number | string,
  T extends ChartDataPoint<V>,
>(
  data: T[],
) => {
  const values = data.map((d) => Number(d.value)).filter((v) => !isNaN(v));
  const absValues = values.map((v) => Math.abs(v));
  let minValue = Math.min(...values);
  let maxValue = Math.max(...values);

  const absMaxValue = Math.max(...absValues);
  const isNegative = minValue < 0;
  const isSame = minValue === maxValue;
  let isSymmetricRange = false;

  if (isNegative) {
    if (isSame) {
      maxValue = 0;
      if (absMaxValue < 1) {
        minValue = -1;
      }
    } else {
      minValue = -absMaxValue;
      maxValue = absMaxValue;
      isSymmetricRange = true;
    }
  } else {
    if (isSame) {
      minValue = 0;
      if (absMaxValue < 1) {
        maxValue = 1;
      }
    }
  }

  // Calculate the range of the data
  const range = maxValue - minValue;

  // Add padding as a percentage of the range (not the values themselves)
  // This ensures consistent padding regardless of data scale
  const padding = range * Y_AXIS_CONFIG.START_VALUE_OFFSET;

  const minValueWithOffset = minValue - padding;
  const maxValueWithOffset = maxValue + padding;

  return {
    minValue,
    maxValue,
    minValueWithOffset,
    maxValueWithOffset,
    isSymmetricRange,
    isNegative,
  };
};

/**
 * Calculates the visible y-axis range for the chart.
 * - Min value: min(0, dataMinValue) - starts at 0 for positive data, or the negative minimum
 * - Max value: dataMaxValue * 1.2 when positive (20% headroom), or 0 when all values are negative
 * - When all values are identical, ensures a reasonable range (min -1 to 0 for negatives, 0 to 1 for small positives)
 */
export const calculateVisibleYRange = <
  V extends number | string,
  T extends ChartDataPoint<V>,
>(
  data: T[],
) => {
  const values = data.map((d) => Number(d.value)).filter((v) => !isNaN(v));

  if (values.length === 0) {
    return {
      minValue: 0,
      maxValue: 1,
      minValueWithOffset: 0,
      maxValueWithOffset: 1,
      isSymmetricRange: false,
      isNegative: false,
    };
  }

  const dataMinValue = Math.min(...values);
  const dataMaxValue = Math.max(...values);

  const isNegative = dataMinValue < 0;
  const isSame = dataMinValue === dataMaxValue;

  let minValue = Math.min(0, dataMinValue);
  let maxValue = dataMaxValue > 0 ? dataMaxValue * 1.2 : 0;

  if (isSame) {
    if (isNegative) {
      maxValue = 0;
      if (Math.abs(dataMinValue) < 1) {
        minValue = -1;
      }
    } else {
      minValue = 0;
      if (dataMaxValue < 1) {
        maxValue = 1;
      }
    }
  }

  return {
    minValue,
    maxValue,
    minValueWithOffset: minValue,
    maxValueWithOffset: maxValue,
    isSymmetricRange: false,
    isNegative,
  };
};

/**
 * Groups data by formatted date values and returns the first date from each group
 * This ensures one tick per unique formatted date (e.g., one per month if using 'MMM yyyy')
 */
export const calculateEvenXAxisTicks = <
  V extends number | string,
  T extends ChartDataPoint<V>,
>(
  data: T[],
  dateFormatter: (date: string) => string,
): T['date'][] => {
  if (!data || data.length === 0) {
    return [];
  }

  // Group data points by their formatted date
  const grouped = groupBy(data, (point) => dateFormatter(point.date));

  // Pick the first date from each group
  return Object.values(grouped).map((group) => group[0].date);
};

export const calculateEvenYAxisTicks = (minValue: number, maxValue: number) => {
  const range = maxValue - minValue;
  const step = range / 4; // for 5 ticks, there are 4 steps
  return Array.from({ length: 5 }, (_, i) => minValue + step * i);
};
