'use client';

import type { BalanceHistoryPeriod } from '@/hooks/portfolio/usePortfolioBalanceHistory';
import { usePortfolioBalanceHistoryQuery } from '@/hooks/portfolio/usePortfolioBalanceHistory';
import { usePathnameWithoutLocale } from '@/hooks/routing/usePathnameWithoutLocale';
import { dropWhile } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { isCurrentPageUsingPositionData } from '../utils';

export const usePnlData = () => {
  const [period, setPeriod] = useState<BalanceHistoryPeriod>('month');
  const pathname = usePathnameWithoutLocale();
  const isEnabled = isCurrentPageUsingPositionData(pathname);

  const historyQuery = usePortfolioBalanceHistoryQuery(period, isEnabled);

  const pnlChart = useMemo(
    () =>
      dropWhile(
        historyQuery.data?.points.map((point) => ({
          date: new Date(point.t).toISOString(),
          value: point.v,
        })) ?? [],
        (item) => item.value == null,
      ),
    [historyQuery.data],
  );

  const { pnlValue, pnlPercentage } = useMemo(() => {
    const numericPoints = pnlChart
      .map((p) => ({
        date: p.date,
        value:
          typeof p.value === 'number'
            ? p.value
            : typeof p.value === 'string'
              ? Number(p.value)
              : null,
      }))
      .filter(
        (p): p is { date: string; value: number } =>
          p.value !== null && Number.isFinite(p.value),
      );

    if (numericPoints.length < 2) {
      return { pnlValue: null, pnlPercentage: null };
    }
    const first = numericPoints[0].value;
    const last = numericPoints[numericPoints.length - 1].value;
    return {
      pnlValue: last - first,
      pnlPercentage: first === 0 ? null : ((last - first) / first) * 100,
    };
  }, [pnlChart]);

  const refetch = useCallback(() => {
    historyQuery.refetch();
  }, [historyQuery.refetch]);

  return useMemo(
    () => ({
      period,
      setPeriod,
      pnlValue,
      pnlPercentage,
      pnlChart,
      pnlChartState: {
        isLoading: historyQuery.isLoading,
        isFetching: historyQuery.isFetching,
        isSuccess: historyQuery.isSuccess,
        isPlaceholderData: historyQuery.isPlaceholderData,
        updatedAt: historyQuery.dataUpdatedAt || null,
        error: (historyQuery.error ?? null) as Error | null,
      },
      refetch,
    }),
    [
      period,
      pnlValue,
      pnlPercentage,
      historyQuery.isLoading,
      historyQuery.isFetching,
      historyQuery.isSuccess,
      historyQuery.isPlaceholderData,
      historyQuery.dataUpdatedAt,
      historyQuery.error,
      pnlChart,
      refetch,
    ],
  );
};
