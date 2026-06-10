import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import {
  earnFilterOpportunitiesQueryKey,
  fetchEarnFilterOpportunities,
} from '@/app/lib/earn/earnQueries';
import type { EarnOpportunityFilter } from '@/app/lib/getOpportunitiesFiltered';
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
    queryKey: earnFilterOpportunitiesQueryKey(filter),
    queryFn: () => fetchEarnFilterOpportunities(filter),
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
    refetchOnMount: false,
    placeholderData: (previousData) =>
      !('enabled' in options) || options.enabled ? previousData : undefined,
    ...options,
  });
};
