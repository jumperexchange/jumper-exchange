import { APY_FORMAT_CONFIG } from '@/utils/numbers/apy';
import { dropWhile, negate } from 'lodash';
import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import type {
  ApyAnalyticsHistory,
  EarnOpportunityHistory,
} from 'src/types/jumper-backend';
import type {
  ChartDataPoint,
  LineChartProps,
} from '../core/charts/LineChart/LineChart';
import type { StackedAreaChartProps } from '../core/charts/StackedAreaChart/StackedAreaChart';
import { AnalyticsRangeFieldEnum } from './types';

const dropUntil = <T>(data: T[], predicate: (item: T) => boolean): T[] =>
  dropWhile(data, negate(predicate));

const hasDefinedValue = (
  item: ChartDataPoint<string | number | null>,
): boolean => item.value != null;

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
        value: point.v,
      })) ?? [];
    return dropUntil(mapped, hasDefinedValue);
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
        ...point,
        date: new Date(point.t).toISOString(),
      })) ?? [];
    return dropUntil(mapped, (item) => item.total != null);
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

  return {
    areaTopColor: (theme.vars || theme).palette.surfaceAccent2Bg,
    areaBottomColor: (theme.vars || theme).palette.surface1.main,
    pointColor: (theme.vars || theme).palette.accent1.main,
    lineColor: (theme.vars || theme).palette.textAccent2,
  };
};

export const useRewardChartTheme = (): StackedAreaChartProps['theme'] => {
  const theme = useTheme();

  const surface1 = (theme.vars || theme).palette.surface1.main;
  const accent2 = (theme.vars || theme).palette.accent2.main;

  return {
    baseLineColor: (theme.vars || theme).palette.textAccent2,
    baseAreaTopColor: (theme.vars || theme).palette.surfaceAccent2Bg,
    baseAreaBottomColor: surface1,
    rewardLineColor: (theme.vars || theme).palette.textAccent2,
    rewardAreaTopColor: (theme.vars || theme).palette.surfaceAccent1Bg,
    rewardAreaBottomColor: surface1,
    intrinsicLineColor: (theme.vars || theme).palette.textAccent2,
    intrinsicAreaTopColor: `color-mix(in srgb, ${accent2} 30%, ${surface1})`,
    intrinsicAreaBottomColor: surface1,
    pointColor: (theme.vars || theme).palette.accent1.main,
  };
};
