import {
  LineData,
  Time,
  createChart,
  AreaSeries,
  LineType,
  ColorType,
} from 'lightweight-charts';
import {
  TOOLTIP_CONFIG,
  CHART_CONFIG,
  CHART_LAYOUT_CONFIG,
  CROSSHAIR_CONFIG,
  GRID_CONFIG,
  PRICE_SCALE_CONFIG,
  TIME_SCALE_CONFIG,
  CHART_BEHAVIOR_CONFIG,
  SERIES_CONFIG,
} from './constants';
import { format } from 'date-fns';
import type { Theme } from '@mui/material/styles';

/**
 * Resolves a css color variable to a string given light weight charts does not support css variables
 * @param token - The css variable to resolve
 * @returns
 */
export const resolveCssColorVariable = (token: string): string => {
  // If the token is not a css variable, return it
  if (!token.startsWith('var(')) {
    return token.trim();
  }

  // Remove the var() wrapper
  const varName = token.slice(4, -1).trim();
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return value;
};

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
  if (left > containerWidth - TOOLTIP_CONFIG.WIDTH) {
    left = pointX - TOOLTIP_CONFIG.MARGIN - TOOLTIP_CONFIG.WIDTH;
  }

  let top = pointY + TOOLTIP_CONFIG.MARGIN;
  if (top > containerHeight - TOOLTIP_CONFIG.HEIGHT) {
    top = pointY - TOOLTIP_CONFIG.HEIGHT - TOOLTIP_CONFIG.MARGIN;
  }

  return { x: left, y: top };
};

/**
 * Calculates the price scale range with padding for better visualization
 */
export const calculatePriceScaleRange = <T extends LineData<Time>>(
  data: T[],
) => {
  const values = data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const range = maxValue - minValue;
  const step = range / CHART_CONFIG.RANGE_STEP_DIVISOR;

  return {
    from: minValue - step * CHART_CONFIG.RANGE_PADDING_FACTOR,
    to: maxValue + step * CHART_CONFIG.RANGE_PADDING_FACTOR,
  };
};

/**
 * Calculates the time scale range with offset for better visualization
 */
export const calculateTimeScaleRange = (
  visibleRange: { from: number; to: number } | null,
) => {
  if (!visibleRange) return null;

  return {
    from: visibleRange.from + CHART_CONFIG.VISIBLE_RANGE_OFFSET,
    to: visibleRange.to - CHART_CONFIG.VISIBLE_RANGE_OFFSET,
  };
};

/**
 * Gets typography configuration from theme
 */
export const getThemeTypography = (theme: Theme) => ({
  fontSize: 10, // theme.typography.bodyXXSmall.fontSize,
  fontFamily: theme.typography.bodyXXSmall.fontFamily,
  fontWeight: theme.typography.bodyXXSmall.fontWeight,
  textColor: resolveCssColorVariable(
    (theme.vars || theme).palette.text.secondary,
  ),
});

/**
 * Creates chart configuration object
 */
export const createChartConfig = <T extends LineData<Time>>(
  theme: Theme,
  enableGridY: boolean,
  enableXAxis: boolean,
  enableYAxis: boolean,
  dateFormat?: string,
) => {
  const typography = getThemeTypography(theme);

  console.log('textcolor', typography.textColor);

  return {
    layout: {
      background: { type: ColorType.Solid, color: 'transparent' },
      textColor: typography.textColor,
      fontSize: typography.fontSize,
      fontFamily: typography.fontFamily,
      ...CHART_LAYOUT_CONFIG,
    },
    crosshair: CROSSHAIR_CONFIG,
    grid: {
      ...GRID_CONFIG,
      horzLines: {
        ...GRID_CONFIG.horzLines,
        visible: enableGridY,
        color: `color-mix(in srgb, ${resolveCssColorVariable(
          (theme.vars || theme).palette.alpha900.main,
        )} 10%, transparent)`,
      },
    },
    leftPriceScale: {
      ...PRICE_SCALE_CONFIG.left,
      visible: enableYAxis,
      scaleMargins: {
        top: CHART_CONFIG.PRICE_SCALE_MARGIN_TOP,
      },
    },
    rightPriceScale: PRICE_SCALE_CONFIG.right,
    timeScale: {
      ...TIME_SCALE_CONFIG,
      visible: enableXAxis,
      tickMarkFormatter: (time: T['time']) => {
        return format(time.toString(), dateFormat ?? 'MMM yyyy');
      },
    },
    ...CHART_BEHAVIOR_CONFIG,
    height: CHART_CONFIG.HEIGHT,
  };
};

/**
 * Creates series configuration object
 */
export const createSeriesConfig = (
  lineColor: string,
  areaTopColor: string,
  areaBottomColor: string,
  pointColor: string,
  enableCrosshair: boolean,
) => ({
  lineWidth: CHART_CONFIG.LINE_WIDTH,
  lineType: LineType.Curved,
  lineColor: resolveCssColorVariable(lineColor),
  topColor: resolveCssColorVariable(areaTopColor),
  bottomColor: resolveCssColorVariable(areaBottomColor),
  lastValueVisible: SERIES_CONFIG.lastValueVisible,
  priceLineVisible: SERIES_CONFIG.priceLineVisible,
  crosshairMarkerVisible: enableCrosshair,
  crosshairMarkerBackgroundColor: resolveCssColorVariable(
    pointColor || lineColor,
  ),
});
