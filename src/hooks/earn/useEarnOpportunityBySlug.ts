import { useQuery } from '@tanstack/react-query';

import {
  earnOpportunityBySlugQueryKey,
  fetchEarnOpportunityBySlug,
} from '@/app/lib/earn/earnQueries';
import { FIVE_MINUTES_MS } from '@/const/time';

export const useEarnOpportunityBySlug = (slug: string) => {
  return useQuery({
    queryKey: earnOpportunityBySlugQueryKey(slug),
    queryFn: () => fetchEarnOpportunityBySlug(slug),
    staleTime: FIVE_MINUTES_MS,
    refetchOnMount: false,
  });
};
