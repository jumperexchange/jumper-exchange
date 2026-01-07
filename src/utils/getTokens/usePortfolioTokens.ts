import { usePortfolioStore } from '@/stores/portfolio';
import type {
  ExtendedTokenAmount,
  ExtendedTokenAmountWithChain,
} from '@/utils/getTokens';
import getTokens from '@/utils/getTokens';
import { useAccount } from '@lifi/wallet-management';
import { useQueries } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { usePrevious } from 'src/hooks/usePrevious';
import { differenceInHours } from 'date-fns';
import { flatMap, sumBy } from 'lodash';
import type { CacheToken } from '@/types/portfolio';
import { usePortfolioTracking } from '@/hooks/userTracking/usePortfolioTracking';

export function usePortfolioTokens() {
  const { accounts } = useAccount();
  const {
    getFormattedCacheTokens,
    setCacheTokens,
    forceRefresh,
    setForceRefresh,
    setLast,
    getLast,
    deleteCacheTokenAddress,
  } = usePortfolioStore((state) => state);

  const { trackPortfolioBalanceLoadedEvent } = usePortfolioTracking();

  const hasTrackedSuccess = useRef(false);

  const connectedAccounts = useMemo(() => {
    return accounts.filter(
      (account) => account.isConnected && !!account?.address,
    );
  }, [accounts]);

  const queries = useQueries({
    queries: connectedAccounts.map((account) => ({
      queryKey: ['tokens', account.chainType, account.address],
      queryFn: () =>
        getTokens(account, {
          onProgress: (acc, round, totalPriceUSD, fetchedBalances) => {
            console.log(
              'usePortfolioTokens - fetchedBalances',
              fetchedBalances,
            );
            setCacheTokens(acc, fetchedBalances);
          },
        }),
    })),
  });

  const isSuccess = queries.every(
    (query) => !query.isFetching && query.isSuccess,
  );
  const isFetching = queries.some((query) => query.isFetching);
  const isPrevFetching = usePrevious(isFetching);
  const queriesJustCompleted = isPrevFetching && !isFetching && isSuccess;

  const queriesByAddress = useMemo(() => {
    return new Map(
      connectedAccounts.map((account, index) => {
        const accountAddress = account.address!;
        const query = queries[index];

        let accountData: (ExtendedTokenAmountWithChain | CacheToken)[] =
          query?.isSuccess && query.data ? query.data : [];

        if (accountData.length === 0) {
          const cached = getFormattedCacheTokens([account]);
          accountData = cached.cache;
        }

        return [
          accountAddress,
          {
            refetch: () => query?.refetch(),
            isFetching: query?.isFetching ?? false,
            isSuccess: !query?.isFetching && (query?.isSuccess ?? false),
            data: accountData,
          },
        ];
      }),
    );
  }, [connectedAccounts, queries, getFormattedCacheTokens]);

  const data = useMemo(() => {
    return flatMap(
      Array.from(queriesByAddress.values()),
      (query) => query.data,
    );
  }, [queriesByAddress]);

  const totalValue = useMemo(() => {
    return sumBy(data, (token) => token.cumulatedTotalUSD ?? 0);
  }, [data]);

  useEffect(() => {
    if (!queriesJustCompleted) {
      return;
    }

    connectedAccounts.forEach((account, index) => {
      const query = queries[index];

      if (!query?.isSuccess || !account.address) {
        return;
      }

      const accountData = (query.data as ExtendedTokenAmount[]) ?? [];
      const accountTotalValue = sumBy(
        accountData,
        (token) => token.cumulatedTotalUSD ?? 0,
      );

      const { date: lastDate } = getLast(account.address);

      setCacheTokens(account.address, accountData);

      if (
        !lastDate ||
        differenceInHours(new Date(), new Date(lastDate)) >= 24
      ) {
        setLast(account.address, accountTotalValue, Date.now());
      }
    });
  }, [
    queriesJustCompleted,
    connectedAccounts,
    queries,
    getLast,
    setLast,
    setCacheTokens,
  ]);

  useEffect(() => {
    if (forceRefresh.size === 0) {
      return;
    }

    connectedAccounts.forEach((account, index) => {
      if (account.address && forceRefresh.has(account.address)) {
        queries[index]?.refetch();
        setForceRefresh(account.address, false);
      }
    });
  }, [forceRefresh, connectedAccounts, queries, setForceRefresh]);

  useEffect(() => {
    if (hasTrackedSuccess.current || !queriesJustCompleted) {
      return;
    }

    hasTrackedSuccess.current = true;

    trackPortfolioBalanceLoadedEvent();
  }, [queriesJustCompleted, trackPortfolioBalanceLoadedEvent]);

  useEffect(() => {
    hasTrackedSuccess.current = false;
  }, [connectedAccounts]);

  useEffect(() => {
    const connectedAddresses = new Set(
      connectedAccounts.map((account) => account.address).filter(Boolean),
    );

    const { cacheTokens } = usePortfolioStore.getState();
    const cachedAddresses = Array.from(cacheTokens.keys());

    cachedAddresses.forEach((address) => {
      if (!connectedAddresses.has(address)) {
        deleteCacheTokenAddress(address);
      }
    });
  }, [connectedAccounts, deleteCacheTokenAddress]);

  const refetch = () => queries.forEach((query) => query.refetch());

  console.log('usePortfolioTokens - data', data);
  console.log('usePortfolioTokens - totalValue', totalValue);
  console.log('usePortfolioTokens - queriesByAddress', queriesByAddress);

  return {
    queries,
    queriesByAddress,
    queriesJustCompleted,
    isSuccess,
    isFetching,
    refetch,
    data,
    totalValue,
    accounts: connectedAccounts,
  };
}
