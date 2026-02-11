import { APY_FORMAT_CONFIG } from '@/utils/numbers/apy';
import { useColorScheme, useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import type {
  ApyAnalyticsHistory,
  EarnOpportunityHistory,
} from 'src/types/jumper-backend';
import type { LineChartProps } from '../core/charts/LineChart/LineChart';
import type { StackedAreaChartProps } from '../core/charts/StackedAreaChart/StackedAreaChart';
import { AnalyticsRangeFieldEnum } from './types';

/**
 * Trims leading entries from an array where the predicate returns false.
 * Returns the array starting from the first element where hasValue returns true.
 */
function trimLeadingNulls<T>(data: T[], hasValue: (item: T) => boolean): T[] {
  const firstValidIndex = data.findIndex(hasValue);
  return firstValidIndex === -1 ? [] : data.slice(firstValidIndex);
}

const useDefaultDateFormat = (range: AnalyticsRangeFieldEnum) => {
  return range === AnalyticsRangeFieldEnum.WEEK ||
    range === AnalyticsRangeFieldEnum.MONTH
    ? 'dd MMM'
    : 'MMM yyyy';
};

export const useSimpleAnalyticsChartConfig = (
  rawData: EarnOpportunityHistory | undefined,
  range: AnalyticsRangeFieldEnum,
): LineChartProps => {
  const data = useMemo(() => {
    const mapped =
      rawData?.points.map((point) => ({
        date: new Date(point.t).toISOString(),
        // Normalize potential nulls to undefined to match chart value typings
        value: point.v ?? undefined,
      })) ?? [];
    return trimLeadingNulls(mapped, (item) => item.value != null);
  }, [rawData]);

  const dateFormat = useDefaultDateFormat(range);
  const theme = useBaseChartTheme();

  return useMemo(() => {
    return {
      data,
      dateFormat,
      theme,
    };
  }, [data, dateFormat, theme]);
};

export const useApyAnalyticsChartConfig = (
  rawData: ApyAnalyticsHistory | undefined,
  range: AnalyticsRangeFieldEnum,
): StackedAreaChartProps => {
  const data = useMemo(() => {
    const mapped =
      rawData?.points.map((point) => ({
        date: new Date(point.t).toISOString(),
        base: point.base,
        reward: point.reward,
        total:
          point.base != null && point.reward != null
            ? point.base + point.reward
            : null,
      })) ?? [];
    return trimLeadingNulls(mapped, (item) => item.total != null);
  }, [rawData]);

  const theme = useRewardChartTheme();
  const dateFormat = useDefaultDateFormat(range);

  return useMemo(
    () => ({
      data,
      theme,
      dateFormat,
      valueFormatConfig: APY_FORMAT_CONFIG,
    }),
    [data, theme, dateFormat],
  );
};

export const useBaseChartTheme = (): LineChartProps['theme'] => {
  const theme = useTheme();
  const isLightTheme = useIsLightTheme();

  return {
    areaTopColor: isLightTheme
      ? `#F2D9F6`
      : (theme.vars || theme).palette.accent2Alt,
    areaBottomColor: isLightTheme
      ? (theme.vars || theme).palette.white.main
      : (theme.vars || theme).palette.bg.main,
    pointColor: (theme.vars || theme).palette.accent1.main,
    lineColor: (theme.vars || theme).palette.accent2.main,
  };
};

export const useRewardChartTheme = (): StackedAreaChartProps['theme'] => {
  const theme = useTheme();
  const isLightTheme = useIsLightTheme();

  return {
    baseLineColor: (theme.vars || theme).palette.textAccent2,
    baseAreaTopColor: (theme.vars || theme).palette.surfaceAccent2Bg,
    baseAreaBottomColor: (theme.vars || theme).palette.surface1.main,
    rewardLineColor: (theme.vars || theme).palette.textAccent2,
    rewardAreaTopColor: (theme.vars || theme).palette.surfaceAccent1Bg,
    rewardAreaBottomColor: (theme.vars || theme).palette.surface1.main,
    pointColor: (theme.vars || theme).palette.accent1.main,
  };
};

/**
 * Resolve the color scheme the app should used, base on active theme, system mode, etc.
 * @returns 'light' | 'dark'
 */
const useResolvedColorScheme = (): 'light' | 'dark' => {
  const { mode, systemMode } = useColorScheme();

  if (mode === 'system') {
    return systemMode ?? 'light';
  }

  return mode ?? 'light';
};

const useIsLightTheme = (): boolean => {
  const resolvedColorScheme = useResolvedColorScheme();
  return resolvedColorScheme === 'light';
};
