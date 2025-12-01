import type {
  EarnOpportunityHistory,
  HttpResponse,
} from '@/types/jumper-backend';
import type { UseQueryResult } from '@tanstack/react-query';
import type { EarnOpportunityAnalyticsQuery } from '@/app/lib/getOpportunityAnalytics';
import { getOpportunityAnalytics } from '@/app/lib/getOpportunityAnalytics';
import { FIVE_MINUTES_MS } from '@/const/time';
import { useEarnQuery } from './useEarnQuery';

export interface UseEarnAnalyticsProps {
  slug: string;
  query: EarnOpportunityAnalyticsQuery;
}

export type UseEarnAnalyticsResult = UseQueryResult<
  EarnOpportunityHistory,
  unknown
>;

export const useEarnAnalytics = ({
  slug,
  query,
}: UseEarnAnalyticsProps): UseEarnAnalyticsResult => {
  return useEarnQuery<
    EarnOpportunityHistory,
    { slug: string; query: EarnOpportunityAnalyticsQuery }
  >({
    queryKey: ['earn-analytics-opportunities', { slug, query }],
    fetcher: ({ slug, query }) => getOpportunityAnalytics(slug, query),
    // @ts-expect-error: see LF-15589 - we are transforming data in the backend
    select: (payload) => payload.data,
    filter: { slug, query },
    refetchInterval: FIVE_MINUTES_MS,
  });
};
