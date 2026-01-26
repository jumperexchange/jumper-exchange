import type { ApyAnalyticsHistory } from '@/types/jumper-backend';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ApyAnalyticsRangeField } from 'src/app/lib/getOpportunityApyAnalytics';
import { getOpportunityApyAnalytics } from 'src/app/lib/getOpportunityApyAnalytics';
import { FIVE_MINUTES_MS } from 'src/const/time';

export interface UseEarnApyAnalyticsProps {
  slug: string;
  range: ApyAnalyticsRangeField;
  instant?: boolean;
}

export type UseEarnApyAnalyticsResult = UseQueryResult<
  ApyAnalyticsHistory,
  unknown
>;

export const useEarnApyAnalytics = ({
  slug,
  range,
  instant,
}: UseEarnApyAnalyticsProps): UseEarnApyAnalyticsResult => {
  return useQuery({
    queryKey: ['earn-apy-analytics', slug, range, instant],
    queryFn: async () => {
      const result = await getOpportunityApyAnalytics(slug, { range, instant });
      if (!result.ok) {
        throw result.error;
      }
      // @ts-expect-error: see LF-15589 - we are transforming data in the backend
      return result.data.data;
    },
    refetchInterval: FIVE_MINUTES_MS,
  });
};
