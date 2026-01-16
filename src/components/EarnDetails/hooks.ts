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
    return (
      rawData?.points.map((point) => ({
        date: new Date(point.t).toISOString(),
        value: point.v,
      })) ?? []
    );
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
    return (
      rawData?.points.map((point) => ({
        date: new Date(point.t).toISOString(),
        base: point.base,
        reward: point.reward,
      })) ?? []
    );
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
  const { mode } = useColorScheme();
  const isLightTheme = mode === 'light';

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
  const { mode } = useColorScheme();
  const isLightTheme = mode === 'light';

  return {
    baseLineColor: (theme.vars || theme).palette.accent2.main,
    baseAreaTopColor: isLightTheme
      ? `#F2D9F6`
      : (theme.vars || theme).palette.accent2Alt,
    baseAreaBottomColor: isLightTheme
      ? (theme.vars || theme).palette.white.main
      : (theme.vars || theme).palette.bg.main,
    rewardLineColor: isLightTheme ? '#7B61FF' : '#9B8AFF',
    rewardAreaTopColor: isLightTheme ? '#E8E4FF' : '#3D3270',
    rewardAreaBottomColor: isLightTheme
      ? (theme.vars || theme).palette.white.main
      : (theme.vars || theme).palette.bg.main,
    pointColor: (theme.vars || theme).palette.accent1.main,
  };
};
