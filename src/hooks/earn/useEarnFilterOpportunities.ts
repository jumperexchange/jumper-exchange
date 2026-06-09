import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import {
  type EarnOpportunityFilter,
  getOpportunitiesFiltered,
} from '@/app/lib/getOpportunitiesFiltered';
import { ONE_HOUR_MS } from '@/const/time';
import type { EarnOpportunities } from '@/types/jumper-backend';

export const earnFilterOpportunitiesQueryKey = (
  filter: EarnOpportunityFilter,
) => ['earn-filter-opportunities', filter] as const;

export const fetchEarnFilterOpportunities = (filter: EarnOpportunityFilter) =>
  getOpportunitiesFiltered(filter);

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
