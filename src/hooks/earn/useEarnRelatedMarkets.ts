import { getOpportunityRelatedMarket } from '@/app/lib/getOpportunityRelatedMarket';
import { useQuery } from '@tanstack/react-query';
import { FIVE_MINUTES_MS } from '@/const/time';

export const earnRelatedMarketsQueryKey = (slug: string) =>
  ['earn-related-markets', slug] as const;

export const useEarnRelatedMarkets = (slug: string) => {
  return useQuery({
    queryKey: earnRelatedMarketsQueryKey(slug),
    queryFn: () => getOpportunityRelatedMarket(slug),
    staleTime: FIVE_MINUTES_MS,
  });
};
