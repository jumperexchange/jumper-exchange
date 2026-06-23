import { useAccount } from '@lifi/wallet-management';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { PnlQuery } from '@/app/lib/getPortfolioPnl';
import { getPortfolioPnl } from '@/app/lib/getPortfolioPnl';
import { FIVE_MINUTES_MS } from '@/const/time';
import type { PnlResponseDto } from '@/types/jumper-backend';
import { useAccountGroupsByChainType } from '../accounts/useAccountGroupsByChainType';
import type { BalanceHistoryPeriod } from './usePortfolioBalanceHistory';

export const usePortfolioPnlQuery = (
  period: BalanceHistoryPeriod,
): UseQueryResult<PnlResponseDto, unknown> => {
  const { accounts } = useAccount();
  const accountGroups = useAccountGroupsByChainType(accounts);

  const queryParams = useMemo(
    () =>
      accountGroups.reduce<Omit<PnlQuery, 'chartPeriod'>>(
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
    queryKey: ['portfolio-pnl', queryParams, period],
    queryFn: async () => {
      const result = await getPortfolioPnl({
        ...queryParams,
        chartPeriod: period,
      });

      return result.data.data;
    },
    enabled: hasAddresses,
    refetchInterval: FIVE_MINUTES_MS,
  });
};
