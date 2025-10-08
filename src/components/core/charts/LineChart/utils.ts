import { TOOLTIP_CONFIG, Y_AXIS_CONFIG } from './constants';

/**
 * Calculates the optimal tooltip position to prevent it from going outside the container bounds
 */
export const calculateTooltipPosition = (
  pointX: number,
  pointY: number,
  containerWidth: number,
  containerHeight: number,
) => {
  let left = pointX + TOOLTIP_CONFIG.MARGIN;
  if (left > containerWidth - TOOLTIP_CONFIG.MIN_WIDTH) {
    left = pointX - TOOLTIP_CONFIG.MARGIN - TOOLTIP_CONFIG.MIN_WIDTH;
  }

  let top = pointY + TOOLTIP_CONFIG.MARGIN;
  if (top > containerHeight - TOOLTIP_CONFIG.HEIGHT) {
    top = pointY - TOOLTIP_CONFIG.HEIGHT - TOOLTIP_CONFIG.MARGIN;
  }

  return { x: left, y: top };
};

/**
 * Calculates the visible y range for the chart
 */
export const calculateVisibleYRange = (data: any[]) => {
  const values = data.map((d) => Number(d.value)).filter((v) => !isNaN(v));
  const minValue = Math.min(...values);
  // Offset the min value by 10% to avoid the area being cut off due to curve rendering
  const minValueWithOffset =
    minValue - minValue * Y_AXIS_CONFIG.START_VALUE_OFFSET;
  const maxValue = Math.max(...values);
  return { minValue: minValueWithOffset, maxValue };
};
