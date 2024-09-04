import { useQueries } from '@tanstack/react-query';
import type { ExtendedTokenAmount } from '@/utils/getTokens';
import getTokens from '@/utils/getTokens';
import type { Account } from '@/hooks/useAccounts';
import { usePortfolioStore } from '@/stores/portfolio';

interface CombinedResult {
  isLoading: boolean;
  isRefetching: boolean;
  isError: boolean;
  data: ExtendedTokenAmount[];
  totalValue: number;
  refetch: () => void;
}

export const useTokenBalances = (accounts: Account[]) => {
  const { setLastTotalValue, setLastAddresses } = usePortfolioStore(
    (state) => state,
  );

  return useQueries({
    queries: accounts.map(({ address }) => ({
      queryKey: ['tokenBalances', address],
      queryFn: async () => {
        try {
          if (!address) {
            return;
          }

          return getTokens(address);
        } catch (err) {
          console.error(err);
        }
      },
      enabled: !!address,
      refetchInterval: 1000 * 60 * 60, // 1 hour
    })),
    combine: (results): CombinedResult => {
      const isLoading = results.some((result) => result.isLoading);
      const isRefetching = results.some((result) => result.isRefetching);
      const isError = results.some((result) => result.isError);
      const data = results
        .map((result) => result.data)
        .filter((result) => result !== undefined)
        .flat();
      const refetch = () => results.forEach((result) => result.refetch());
      const totalValue = data.reduce(
        (acc, token) => acc + (token?.totalPriceUSD || 0),
        0,
      );

      // setLastTotalValue(totalValue);
      // setLastAddresses(accounts.map(({ address }) => address!));

      return {
        isLoading,
        isRefetching,
        isError,
        data,
        totalValue,
        refetch,
      };
    },
  });
};
