import { useAccount } from '@lifi/wallet-management';
import { usePortfolioStore } from '@/stores/portfolio';
import { useQueries } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { ExtendedTokenAmount } from '@/utils/getTokens';
import index from '@/utils/getTokens';
import { arraysEqual } from '@/utils/getTokens/utils';

export function usePortfolioTokens() {
  const { accounts } = useAccount();
  const {
    getFormattedCacheTokens,
    setCacheTokens,
    lastAddresses,
    forceRefresh,
    setForceRefresh,
  } = usePortfolioStore((state) => state);

  const handleProgress = (
    account: string,
    round: number,
    totalPriceUSD: number,
    fetchedBalances: ExtendedTokenAmount[],
  ) => {
    console.debug(`\n** Round ${round} Account: ${account} **`);
    console.debug(`Cumulative Price USD: $${totalPriceUSD.toFixed(2)}`);
    console.debug(`Fetched Balances this Round:`, fetchedBalances);

    setCacheTokens(account, fetchedBalances);
  };

  const queries = useQueries({
    queries: accounts
      .filter((account) => account.isConnected && !!account?.address)
      .map((account) => ({
        queryKey: ['tokens', account.chainType, account.address],
        queryFn: () => index(account, { onProgress: handleProgress }),
        // refetchInterval: 100000 * 60 * 60,
      })),
  });

  const isSuccess = queries.every(
    (query) => !query.isFetching && query.isSuccess,
  );
  const isFetching = queries.every((query) => query.isFetching);
  const refetch = () => queries.map((query) => query.refetch());

  // Usefull to refresh after bridging something
  useEffect(() => {
    if (!forceRefresh) {
      return;
    }

    refetch();
    setForceRefresh(false);
  }, [forceRefresh]);

  useEffect(() => {
    if (!accounts) {
      return;
    }

    if (
      arraysEqual(
        accounts
          .filter((account) => account.isConnected && account?.address)
          .map((account) => account.address!),
        lastAddresses ?? [],
      )
    ) {
      return;
    }

    refetch();
  }, [accounts]);

  return {
    queries,
    isSuccess,
    isFetching,
    refetch,
    data:
      getFormattedCacheTokens(accounts).cache.length === 0
        ? queries.map((query) => query.data ?? []).flat()
        : getFormattedCacheTokens(accounts).cache,
  };
}
