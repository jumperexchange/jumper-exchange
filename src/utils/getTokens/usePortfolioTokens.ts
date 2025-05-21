import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { usePortfolioStore } from '@/stores/portfolio';
import type { ExtendedTokenAmount } from '@/utils/getTokens';
import index from '@/utils/getTokens';
import { arraysEqual } from '@/utils/getTokens/utils';
import { useAccount } from '@lifi/wallet-management';
import { useQueries } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export function usePortfolioTokens() {
  const { trackEvent } = useUserTracking();
  const { accounts } = useAccount();
  const {
    getFormattedCacheTokens,
    setCacheTokens,
    lastAddresses,
    forceRefresh,
    setForceRefresh,
  } = usePortfolioStore((state) => state);
  const hasTrackedSuccess = useRef(false);

  const handleProgress = (
    account: string,
    round: number,
    totalPriceUSD: number,
    fetchedBalances: ExtendedTokenAmount[],
  ) => {
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

  // Useful to refresh after bridging something
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

  useEffect(() => {
    if (isSuccess && !hasTrackedSuccess.current) {
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
    }
  }, [isSuccess, trackEvent]);

  // Reset the tracking flag when accounts change
  useEffect(() => {
    hasTrackedSuccess.current = false;
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
