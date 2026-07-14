import { useAccount } from '@jumperexchange/wallet-management';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { BalanceHistoryQuery } from '@/app/lib/getPortfolioBalanceHistory';
import { getPortfolioBalanceHistory } from '@/app/lib/getPortfolioBalanceHistory';
import { FIVE_MINUTES_MS } from '@/const/time';
import type { HistoryGraph } from '@/types/jumper-backend';
import { useAccountGroupsByChainType } from '../accounts/useAccountGroupsByChainType';

export type BalanceHistoryPeriod = BalanceHistoryQuery['chartPeriod'];

export const usePortfolioBalanceHistoryQuery = (
  period: BalanceHistoryPeriod,
  enabled: boolean = true,
): UseQueryResult<HistoryGraph, unknown> => {
  const { accounts } = useAccount();
  const accountGroups = useAccountGroupsByChainType(accounts);

  const queryParams = useMemo(
    () =>
      accountGroups.reduce<Omit<BalanceHistoryQuery, 'chartPeriod'>>(
        (acc, { addressParam, addresses }) => ({
          ...acc,
          [addressParam]: addresses,
        }),
        {},
      ),
    [accountGroups],
  );

  const hasAddresses = accountGroups.length > 0;

  return useQuery({
    queryKey: ['portfolio-balance-history', queryParams, period],
    queryFn: async () => {
      const result = await getPortfolioBalanceHistory({
        ...queryParams,
        chartPeriod: period,
      });
      return result.data.data;
    },
    enabled: enabled && hasAddresses,
    refetchInterval: FIVE_MINUTES_MS,
  });
};
