import type { EarnOpportunityFilter } from '@/app/lib/getOpportunitiesFiltered';
import { getOpportunitiesFiltered } from '@/app/lib/getOpportunitiesFiltered';
import type { EarnOpportunities } from '@/types/jumper-backend';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { ONE_HOUR_MS } from 'src/const/time';

export interface Props {
  filter: EarnOpportunityFilter;
}

type MetadataWithUpdatedAt = Omit<EarnOpportunities['meta'], 'updatedAt'> & {
  updatedAt: Date;
};

export type Result = UseQueryResult<
  Omit<EarnOpportunities, 'meta'> & {
    meta: MetadataWithUpdatedAt;
  },
  unknown
>;

export const useEarnFilterOpportunities = ({ filter }: Props): Result => {
  return useQuery({
    queryKey: ['earn-filter-opportunities', filter],
    queryFn: async () => {
      const result = await getOpportunitiesFiltered(filter);
      return result.data;
    },
    select: (payload) => {
      return {
        ...payload,
        meta: {
          ...payload.meta,
          updatedAt: new Date(payload.meta.updatedAt),
        },
      };
    },
    refetchInterval: ONE_HOUR_MS,
    placeholderData: (previousData) => previousData,
  });
};
