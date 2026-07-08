import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { EarnOpportunityAnalyticsQuery } from 'src/app/lib/getOpportunityAnalytics';
import { getOpportunityAnalytics } from 'src/app/lib/getOpportunityAnalytics';
import { FIVE_MINUTES_MS } from 'src/const/time';
import type { HistoryGraph } from '@/types/jumper-backend';

export interface Props {
  slug: string;
  query: EarnOpportunityAnalyticsQuery;
}

export type Result = UseQueryResult<HistoryGraph, unknown>;

export const useEarnAnalytics = ({ slug, query }: Props): Result => {
  return useQuery({
    queryKey: ['earn-analytics-opportunities', slug, query],
    queryFn: async () => {
      const result = await getOpportunityAnalytics(slug, query);
      if (!result.ok) {
        throw result.error;
      }
      return result.data.data;
    },
    refetchInterval: FIVE_MINUTES_MS,
  });
};
