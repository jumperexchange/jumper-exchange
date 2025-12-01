import type { EarnOpportunityFilter } from '@/app/lib/getOpportunitiesFiltered';
import { getOpportunitiesFiltered } from '@/app/lib/getOpportunitiesFiltered';
import type {
  EarnOpportunities,
  EarnOpportunityWithLatestAnalytics,
} from '@/types/jumper-backend';
import type { UseQueryResult } from '@tanstack/react-query';
import { ONE_HOUR_MS } from '@/const/time';
import { useEarnQuery } from './useEarnQuery';

export interface UseEarnFilterOpportunitiesProps {
  filter: EarnOpportunityFilter;
  initialData?: EarnOpportunities;
}

type MetadataWithUpdatedAt = Omit<EarnOpportunities['meta'], 'updatedAt'> & {
  updatedAt: Date;
};

type EarnOpportunitiesWithDateMeta = Omit<EarnOpportunities, 'meta'> & {
  meta: MetadataWithUpdatedAt;
};

export type UseEarnFilterOpportunitiesResult = UseQueryResult<
  EarnOpportunitiesWithDateMeta,
  unknown
>;

export const useEarnFilterOpportunities = ({
  filter,
  initialData,
}: UseEarnFilterOpportunitiesProps): UseEarnFilterOpportunitiesResult => {
  return useEarnQuery<
    EarnOpportunities,
    EarnOpportunityFilter,
    EarnOpportunitiesWithDateMeta
  >({
    queryKey: ['earn-filter-opportunities', filter],
    fetcher: getOpportunitiesFiltered,
    filter: filter,
    placeholderData: filter?.address ? undefined : initialData,
    refetchInterval: ONE_HOUR_MS,
    select: (payload) => {
      return {
        ...payload,
        meta: {
          ...payload.meta,
          updatedAt: new Date(payload.meta.updatedAt),
        },
      };
    },
  });
};
