import { getOpportunityBySlug } from '@/app/lib/getOpportunityBySlug';
import { useQuery } from '@tanstack/react-query';

export const earnOpportunityBySlugQueryKey = (slug: string) =>
  ['earn-opportunity-by-slug', slug] as const;

export const useEarnOpportunityBySlug = (slug: string) => {
  return useQuery({
    queryKey: earnOpportunityBySlugQueryKey(slug),
    queryFn: async () => {
      const result = await getOpportunityBySlug(slug);
      return result.data;
    },
    enabled: false,
  });
};
