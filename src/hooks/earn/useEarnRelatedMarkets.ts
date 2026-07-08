import { useQuery } from '@tanstack/react-query';

import {
  earnRelatedMarketsQueryKey,
  fetchEarnRelatedMarkets,
} from '@/app/lib/earn/earnQueries';
import { FIVE_MINUTES_MS } from '@/const/time';

export const useEarnRelatedMarkets = (slug: string) => {
  return useQuery({
    queryKey: earnRelatedMarketsQueryKey(slug),
    queryFn: () => fetchEarnRelatedMarkets(slug),
    staleTime: FIVE_MINUTES_MS,
    refetchOnMount: false,
  });
};
