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

  const accountQueries = useMemo(() => {
    if (connectedAccounts.length !== queries.length) {
      return [];
    }
    return connectedAccounts.map((account, index) => ({
      account,
      address: account.address!,
      query: queries[index],
    }));
  }, [connectedAccounts, queries]);

  const queriesByAddress = useMemo(() => {
    return new Map(
      accountQueries.map(({ account, address, query }) => {
        let accountData: (ExtendedTokenAmountWithChain | CacheToken)[] =
          query?.isSuccess && query.data ? query.data : [];

        if (accountData.length === 0) {
          const cached = getFormattedCacheTokens([account]);
          accountData = cached.cache;
        }

        return [
          address,
          {
            refetch: () => query?.refetch(),
            isFetching: query?.isFetching ?? false,
            isSuccess: !query?.isFetching && (query?.isSuccess ?? false),
            data: accountData,
          },
        ];
      }),
    );
  }, [accountQueries, getFormattedCacheTokens]);

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

    accountQueries.forEach(({ address, query }) => {
      if (!query?.isSuccess || !address) {
        return;
      }

      const accountData = (query.data as ExtendedTokenAmount[]) ?? [];
      const accountTotalValue = sumBy(
        accountData,
        (token) => token.cumulatedTotalUSD ?? 0,
      );

      const { date: lastDate } = getLast(address);

      setCacheTokens(address, accountData);

      if (
        !lastDate ||
        differenceInHours(new Date(), new Date(lastDate)) >= 24
      ) {
        setLast(address, accountTotalValue, Date.now());
      }
    });
  }, [queriesJustCompleted, accountQueries, getLast, setLast, setCacheTokens]);

  useEffect(() => {
    if (forceRefresh.size === 0) {
      return;
    }

    accountQueries.forEach(({ address, query }) => {
      if (address && forceRefresh.has(address)) {
        query?.refetch();
        setForceRefresh(address, false);
      }
    });
  }, [forceRefresh, accountQueries, setForceRefresh]);

  useEffect(() => {
    if (hasTrackedSuccess.current || !queriesJustCompleted) {
      return;
    }

    hasTrackedSuccess.current = true;

    trackPortfolioBalanceLoadedEvent();
  }, [queriesJustCompleted, trackPortfolioBalanceLoadedEvent]);

  useEffect(() => {
    hasTrackedSuccess.current = false;
  }, [accountQueries]);

  useEffect(() => {
    const connectedAddresses = new Set(
      accountQueries.map(({ address }) => address).filter(Boolean),
    );

    const { cacheTokens } = usePortfolioStore.getState();
    const cachedAddresses = Array.from(cacheTokens.keys());

    cachedAddresses.forEach((address) => {
      if (!connectedAddresses.has(address)) {
        deleteCacheTokenAddress(address);
      }
    });
  }, [accountQueries, deleteCacheTokenAddress]);

  const refetch = () => queries.forEach((query) => query.refetch());

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
