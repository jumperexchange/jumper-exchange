import {
  EarnOpportunityFilter,
  getOpportunitiesFiltered,
} from '@/app/lib/getOpportunitiesFiltered';
import { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ONE_HOUR_MS } from 'src/const/time';

export interface Props {
  filter: EarnOpportunityFilter;
}

export type Result = UseQueryResult<
  EarnOpportunityWithLatestAnalytics[],
  unknown
>;

export const useEarnFilterOpportunities = ({ filter }: Props): Result => {
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
    refetchInterval: ONE_HOUR_MS,
  });
};
