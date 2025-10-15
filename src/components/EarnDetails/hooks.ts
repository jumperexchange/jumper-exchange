import { useColorScheme, useTheme } from '@mui/material/styles';
import { useState, useCallback, useMemo } from 'react';
import { EarnOpportunityAnalyticsQuery } from 'src/app/lib/getOpportunityAnalytics';
import { useEarnAnalytics } from 'src/hooks/earn/useEarnAnalytics';
import { EarnOpportunityHistory } from 'src/types/jumper-backend';
import { AnalyticsRangeFieldEnum, AnalyticsValueFieldEnum } from './types';

export const useAnalyticsQuery = (slug: string) => {
  const [query, setQuery] = useState<EarnOpportunityAnalyticsQuery>({
    value: AnalyticsValueFieldEnum.APY,
    range: AnalyticsRangeFieldEnum.DAY,
  });

  const result = useEarnAnalytics({ slug, query });

  const setValue = useCallback(
    (value: AnalyticsValueFieldEnum) => {
      setQuery((query) => ({ ...query, value }));
    },
    [setQuery],
  );

  const setRange = useCallback(
    (range: AnalyticsRangeFieldEnum) => {
      setQuery((query) => ({ ...query, range }));
    },
    [setQuery],
  );

  return useMemo(
    () => ({
      ...result,
      value: query.value,
      range: query.range,
      setValue,
      setRange,
    }),
    [result, query, setValue, setRange],
  );
};

export const useAnalyticsChartData = (
  rawData: EarnOpportunityHistory | undefined,
  range: EarnOpportunityAnalyticsQuery['range'],
) => {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const isLightTheme = mode === 'light';
  const data = useMemo(() => {
    return (
      rawData?.points.map((point) => ({
        date: new Date(point.t).toISOString(),
        value: point.v,
      })) ?? []
    );
  }, [rawData]);

  return useMemo(() => {
    return {
      data,
      dateFormat:
        range === AnalyticsRangeFieldEnum.DAY
          ? 'PP p'
          : range === AnalyticsRangeFieldEnum.WEEK
            ? 'PP'
            : range === AnalyticsRangeFieldEnum.MONTH
              ? 'MMM yyyy'
              : 'yyyy',
      theme: {
        areaTopColor: isLightTheme
          ? `#F2D9F6`
          : (theme.vars || theme).palette.accent2Alt,
        areaBottomColor: isLightTheme
          ? (theme.vars || theme).palette.white.main
          : (theme.vars || theme).palette.bg.main,
        pointColor: (theme.vars || theme).palette.accent1.main,
        lineColor: (theme.vars || theme).palette.accent2.main,
      },
    };
  }, [data, theme, isLightTheme, range]);
};
