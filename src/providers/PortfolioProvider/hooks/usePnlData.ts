'use client';

import { useState, useMemo, useCallback } from 'react';
import { dropWhile } from 'lodash';
import type { BalanceHistoryPeriod } from '@/hooks/portfolio/usePortfolioBalanceHistory';
import { usePortfolioBalanceHistoryQuery } from '@/hooks/portfolio/usePortfolioBalanceHistory';
import { usePortfolioPnlQuery } from '@/hooks/portfolio/usePortfolioPnl';

export const usePnlData = () => {
  const [period, setPeriod] = useState<BalanceHistoryPeriod>('month');

  const pnlQuery = usePortfolioPnlQuery(period);
  const historyQuery = usePortfolioBalanceHistoryQuery(period);

  const chartData = useMemo(
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

  const refetch = useCallback(() => {
    pnlQuery.refetch();
    historyQuery.refetch();
  }, [pnlQuery.refetch, historyQuery.refetch]);

  const updatedAt = useMemo(() => {
    const timestamps = [
      pnlQuery.dataUpdatedAt || null,
      historyQuery.dataUpdatedAt || null,
    ].filter((t): t is number => t !== null);
    return timestamps.length > 0 ? Math.min(...timestamps) : null;
  }, [pnlQuery.dataUpdatedAt, historyQuery.dataUpdatedAt]);

  const error = (pnlQuery.error ?? historyQuery.error ?? null) as Error | null;

  return useMemo(
    () => ({
      period,
      setPeriod,
      pnlValue: pnlQuery.data?.pnl ?? null,
      pnlPercentage: pnlQuery.data?.pnlPercentage ?? null,
      chartData,
      isPnlLoading: pnlQuery.isLoading,
      isChartLoading: historyQuery.isLoading,
      isFetching: pnlQuery.isFetching || historyQuery.isFetching,
      isSuccess: pnlQuery.isSuccess || historyQuery.isSuccess,
      isPlaceholderData:
        pnlQuery.isPlaceholderData || historyQuery.isPlaceholderData,
      updatedAt,
      error,
      refetch,
    }),
    [
      period,
      pnlQuery.data,
      pnlQuery.isLoading,
      pnlQuery.isFetching,
      pnlQuery.isSuccess,
      pnlQuery.isPlaceholderData,
      historyQuery.isLoading,
      historyQuery.isFetching,
      historyQuery.isSuccess,
      historyQuery.isPlaceholderData,
      chartData,
      updatedAt,
      error,
      refetch,
    ],
  );
};
