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

  const refetch = useCallback(() => {
    pnlQuery.refetch();
    historyQuery.refetch();
  }, [pnlQuery.refetch, historyQuery.refetch]);

  return useMemo(
    () => ({
      period,
      setPeriod,
      pnlValue: pnlQuery.data?.pnl ?? null,
      pnlPercentage: pnlQuery.data?.pnlPercentage ?? null,
      pnlChart,
      pnlState: {
        isLoading: pnlQuery.isLoading,
        isFetching: pnlQuery.isFetching,
        isSuccess: pnlQuery.isSuccess,
        isPlaceholderData: pnlQuery.isPlaceholderData,
        updatedAt: pnlQuery.dataUpdatedAt || null,
        error: (pnlQuery.error ?? null) as Error | null,
      },
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
      pnlQuery.data,
      pnlQuery.isLoading,
      pnlQuery.isFetching,
      pnlQuery.isSuccess,
      pnlQuery.isPlaceholderData,
      pnlQuery.dataUpdatedAt,
      pnlQuery.error,
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
