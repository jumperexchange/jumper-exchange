export const TOOLTIP_CONFIG = {
  MIN_WIDTH: 120,
  HEIGHT: 80,
  MARGIN: 15,
} as const;

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
