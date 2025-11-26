import { getOpportunityBySlug } from '@/app/lib/getOpportunityBySlug';
import { useQuery } from '@tanstack/react-query';

export const useEarnOpportunityBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['earn-opportunity-by-slug', slug],
    queryFn: async () => {
      const result = await getOpportunityBySlug(slug);
      return result.data;
    },
    enabled: false,
  });
};
