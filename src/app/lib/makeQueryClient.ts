import { QueryClient, type DefaultOptions } from '@tanstack/react-query';

import { FIVE_MINUTES_MS } from '@/const/time';

/**
 * Shared React Query defaults for both the browser provider and SSR prefetch clients.
 *
 * refetchOnMount is false so HydrationBoundary data is not immediately overwritten
 * on the client (the main cause of stale SSR data flashing back after load).
 * Use refetchOnWindowFocus, refetchInterval, or explicit invalidation to refresh.
 */
export const queryClientDefaultOptions: DefaultOptions = {
  queries: {
    enabled: true,
    staleTime: FIVE_MINUTES_MS,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: false,
    retryOnMount: true,
  },
};

export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: queryClientDefaultOptions,
  });
