import { getFeaturesAccessControl } from '@/app/lib/getFeaturesAccessControl';
import { FIVE_MINUTES_MS, THIRTY_MINUTES_MS } from '@/const/time';
import type { FeaturesAccessControlFeature } from '@/types/featuresAccessControl';
import { FeaturesAccessControlGranularity } from '@/types/featuresAccessControl';
import { useQuery } from '@tanstack/react-query';

export type DisabledEarnUIFeatures = Record<
  FeaturesAccessControlFeature,
  {
    isGlobal: boolean;
    disabledEarnOpportunities: string[];
  }
>;

export const useDisabledEarnUIFeatures = () => {
  return useQuery({
    queryKey: ['disabled-earn-features'],
    queryFn: () => getFeaturesAccessControl(),
    select: (data) => {
      return data.data.reduce((acc, item) => {
        acc[item.Feature] = {
          isGlobal:
            item.Granularity === FeaturesAccessControlGranularity.Global,
          disabledEarnOpportunities: item.disabledEarnOpportunities.map(
            (opportunity) => opportunity.Slug,
          ),
        };
        return acc;
      }, {} as DisabledEarnUIFeatures);
    },
    staleTime: FIVE_MINUTES_MS,
    gcTime: THIRTY_MINUTES_MS,
  });
};

export const useIsEarnUIFeatureDisabled = (
  feature: FeaturesAccessControlFeature,
  slug: string,
) => {
  const { data: disabledEarnFeatures, isLoading } = useDisabledEarnUIFeatures();
  return {
    isLoading,
    isDisabled:
      !!disabledEarnFeatures?.[feature]?.isGlobal ||
      !!disabledEarnFeatures?.[feature]?.disabledEarnOpportunities.includes(
        slug,
      ),
  };
};
