import { useQuery } from '@tanstack/react-query';
import type { FeatureBadgeData } from '@/types/strapi';
import { FeatureBadgeStrapiApi } from '@/utils/strapi/StrapiApi';

interface UseFeatureBadgeProps {
  data: FeatureBadgeData | null;
  isLoading: boolean;
  isSuccess: boolean;
}

export const useFeatureBadge = (featureKey: string): UseFeatureBadgeProps => {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['feature-badge', featureKey],
    queryFn: async () => {
      const api = new FeatureBadgeStrapiApi().filterByKey(featureKey);
      const response = await fetch(api.getApiUrl());
      if (!response.ok) {
        throw new Error(`Failed to fetch feature badge: ${response.status}`);
      }
      const json = await response.json();
      return (json.data?.[0] as FeatureBadgeData) ?? null;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!featureKey,
  });

  return {
    data: data ?? null,
    isLoading,
    isSuccess,
  };
};
