import { getOpportunityBySlug } from '@/app/lib/getOpportunityBySlug';
import { useQuery } from '@tanstack/react-query';

export const useEarnOpportunityBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['earn-opportunity-by-slug', slug],
    queryFn: async () => {
      const result = await getOpportunityBySlug(slug);
      return result.data;
    },
    // The page renders via SSR/ISR with `revalidate = 300`, which means a CDN
    // edge may serve a multi-day-old HTML snapshot with a stale `latest.date`
    // baked in (JUM-775). Refetch on mount so time-sensitive fields are always
    // pulled live regardless of the served HTML's age.
    enabled: Boolean(slug),
    refetchOnMount: 'always',
    staleTime: 0,
  });
};
