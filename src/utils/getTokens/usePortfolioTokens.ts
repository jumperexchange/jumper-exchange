import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { usePortfolioStore } from '@/stores/portfolio';
import type { ExtendedTokenAmount } from '@/utils/getTokens';
import index from '@/utils/getTokens';
import { useAccount } from '@lifi/wallet-management';
import { ChainId } from '@lifi/widget';
import { useQueries } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { useChains } from 'src/hooks/useChains';
import { parsePortfolioDataToTrackingData } from '../tracking/portfolio';
import { zeroAddress } from 'viem';
import { usePrevious } from 'src/hooks/usePrevious';
import { differenceInHours } from 'date-fns';

export function usePortfolioTokens() {
  const { trackEvent } = useUserTracking();
  const { accounts } = useAccount();
  const { getChainById } = useChains();
  const {
    getFormattedCacheTokens,
    setCacheTokens,
    forceRefresh,
    setForceRefresh,
    cacheTokens,
    setLast,
    getLast,
  } = usePortfolioStore((state) => state);
  const hasTrackedSuccess = useRef(false);
  const hasTrackedPortfolioOverview = useRef(false);

  const handleProgress = (
    account: string,
    round: number,
    totalPriceUSD: number,
    fetchedBalances: ExtendedTokenAmount[],
  ) => {
    setCacheTokens(account, fetchedBalances);
  };

  const connectedAccounts = useMemo(() => {
    return accounts.filter(
      (account) => account.isConnected && !!account?.address,
    );
  }, [accounts]);

  const queries = useQueries({
    queries: connectedAccounts.map((account) => ({
      queryKey: ['tokens', account.chainType, account.address],
      queryFn: () => index(account, { onProgress: handleProgress }),
    })),
  });

  const isSuccess = queries.every(
    (query) => !query.isFetching && query.isSuccess,
  );
  const isFetching = queries.some((query) => query.isFetching);
  const isPrevFetching = usePrevious(isFetching);
  const queriesJustCompleted = isPrevFetching && !isFetching && isSuccess;

  const data = useMemo(() => {
    const cached = getFormattedCacheTokens(accounts);

    if (cached.cache.length === 0) {
      return queries
        .filter((query) => query.isSuccess)
        .map((query) => query.data ?? [])
        .flat();
    }

    return cached.cache;
  }, [queries, accounts, getFormattedCacheTokens]);

  useEffect(() => {
    connectedAccounts.forEach((account, index) => {
      const query = queries[index];

      if (!query?.isSuccess || !account.address) {
        return;
      }

      // Only update cache if this address doesn't already have cached data
      if (!cacheTokens.has(account.address)) {
        setCacheTokens(
          account.address,
          (query.data as ExtendedTokenAmount[]) ?? [],
        );
      }

      const { totalValue } = getFormattedCacheTokens([account]);
      const { date: lastDate } = getLast(account.address);

      if (lastDate && differenceInHours(lastDate, new Date()) < 24) {
        return;
      }

      const now = Date.now();

      setLast(account.address, totalValue, now);
    });
  }, [
    queries,
    connectedAccounts,
    setCacheTokens,
    getFormattedCacheTokens,
    getLast,
    setLast,
    cacheTokens,
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

    trackEvent({
      category: TrackingCategory.Wallet,
      action: TrackingAction.PortfolioLoaded,
      label: 'portfolio_balance_loaded',
      data: {
        [TrackingEventParameter.Status]: 'success',
        [TrackingEventParameter.Timestamp]: new Date().toUTCString(),
      },
    });
  }, [queriesJustCompleted, trackEvent]);

  useEffect(() => {
    if (hasTrackedPortfolioOverview.current || !queriesJustCompleted) {
      return;
    }

    hasTrackedPortfolioOverview.current = true;

    const { totalValue: totalBalanceUSD } = getFormattedCacheTokens(accounts);

    const returnNativeTokenAddresses = (chainsIds: ChainId[]) =>
      chainsIds.map(
        (chainId) => getChainById(chainId)?.nativeToken?.address ?? zeroAddress,
      );

    const trackingData = parsePortfolioDataToTrackingData(
      totalBalanceUSD,
      data,
      returnNativeTokenAddresses,
    );

    trackEvent({
      category: TrackingCategory.WalletMenu,
      action: TrackingAction.PortfolioOverview,
      label: 'portfolio_balance_overview',
      enableAddressable: true,
      data: trackingData,
    });
  }, [
    queriesJustCompleted,
    accounts,
    data,
    getFormattedCacheTokens,
    getChainById,
    trackEvent,
  ]);

  useEffect(() => {
    hasTrackedSuccess.current = false;
    hasTrackedPortfolioOverview.current = false;
  }, [accounts]);

  const refetch = () => queries.map((query) => query.refetch());

  const queriesByAddress = useMemo(() => {
    return new Map(
      connectedAccounts.map((account, index) => {
        const accountAddress = account.address!;
        const cachedData = getFormattedCacheTokens([account]);

        return [
          accountAddress,
          {
            refetch: () => queries[index]?.refetch(),
            isFetching: queries[index]?.isFetching ?? false,
            isSuccess:
              !queries[index]?.isFetching &&
              (queries[index]?.isSuccess ?? false),
            data: cachedData.cache,
          },
        ];
      }),
    );
  }, [connectedAccounts, queries, getFormattedCacheTokens]);

  return {
    queries,
    queriesByAddress,
    isSuccess,
    isFetching,
    refetch,
    data,
  };
}
