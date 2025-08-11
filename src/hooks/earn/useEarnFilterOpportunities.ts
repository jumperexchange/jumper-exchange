import {
  EarnOpportunityFilter,
  getOpportunitiesFiltered,
} from '@/app/lib/getOpportunitiesFiltered';
import { EarnOpportunity } from '@/types/jumper-backend';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export interface Props {
  filter: EarnOpportunityFilter;
}

export type Result = UseQueryResult<EarnOpportunity[], unknown>;

const FIVE_MINUTES_IN_MS = 1000 * 60 * 5;

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
      return result.data;
    },
    refetchInterval: FIVE_MINUTES_IN_MS,
  });
};
