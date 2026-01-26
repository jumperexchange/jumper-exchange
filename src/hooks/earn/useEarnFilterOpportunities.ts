import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import {
  type EarnOpportunityFilter,
  getOpportunitiesFiltered,
} from '@/app/lib/getOpportunitiesFiltered';
import { ONE_HOUR_MS } from '@/const/time';
import type { EarnOpportunities } from '@/types/jumper-backend';

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

export const useEarnFilterOpportunities = (
  { filter }: Props,
  options: Omit<
    UseQueryOptions<EarnOpportunities>,
    'queryKey' | 'queryFn' | 'select' | 'placeholderData'
  > = { enabled: true },
): Result => {
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
    placeholderData: (previousData) =>
      !('enabled' in options) || options.enabled ? previousData : undefined,
    ...options,
  });
};
