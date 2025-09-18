import {
  EarnOpportunityFilter,
  getOpportunitiesFiltered,
} from '@/app/lib/getOpportunitiesFiltered';
import { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { FIVE_MINUTES_MS } from 'src/const/time';

export interface Props {
  filter: EarnOpportunityFilter;
}

export type Result = UseQueryResult<
  EarnOpportunityWithLatestAnalytics[],
  unknown
>;

export const useEarnFilterOpportunities = ({ filter }: Props): Result => {
  // TODO: LF-14980: Deal with favorites & refetching
  // TODO: LF-14854: Filtering
  return useQuery({
    queryKey: ['earn-filter-opportunities', filter],
    queryFn: async () => {
      const result = await getOpportunitiesFiltered(filter);
      if (!result.ok) {
        throw result.error;
      }
      // @ts-expect-error: see LF-15589 - we are transforming data in the backend
      return result.data.data;
    },
    refetchInterval: FIVE_MINUTES_MS,
  });
};
