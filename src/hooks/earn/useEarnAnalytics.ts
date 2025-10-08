import {
  EarnOpportunityFilter,
  getOpportunitiesFiltered,
} from '@/app/lib/getOpportunitiesFiltered';
import {
  EarnOpportunityHistory,
  EarnOpportunityWithLatestAnalytics,
} from '@/types/jumper-backend';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  EarnOpportunityAnalyticsQuery,
  getOpportunityAnalytics,
} from 'src/app/lib/getOpportunityAnalytics';
import { FIVE_MINUTES_MS } from 'src/const/time';

export interface Props {
  slug: string;
  query: EarnOpportunityAnalyticsQuery;
}

export type Result = UseQueryResult<EarnOpportunityHistory, unknown>;

export const useEarnAnalytics = ({ slug, query }: Props): Result => {
  return useQuery({
    queryKey: ['earn-analytics-opportunities', slug, query],
    queryFn: async () => {
      const result = await getOpportunityAnalytics(slug, query);
      if (!result.ok) {
        throw result.error;
      }
      // @ts-expect-error: see LF-15589 - we are transforming data in the backend
      return result.data.data;
    },
    refetchInterval: FIVE_MINUTES_MS,
  });
};
