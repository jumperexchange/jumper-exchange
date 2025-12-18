import { useQuery } from '@tanstack/react-query';
import { type AbTestName } from 'src/const/abtests';
import { useAbTestsStore } from 'src/stores/abTests';
import { getPosthogFeatureFlag } from '@/app/lib/getPosthogFeatureFlag';
import { TEN_MINUTES_MS, THIRTY_MINUTES_MS } from '@/const/time';
import type { PosthogFeatureFlag } from '@/types/jumper-backend';

export interface UseABTestProps {
  isEnabled: boolean;
  isLoading: boolean;
  value?: PosthogFeatureFlag['data'];
}

export const useABTest = ({
  feature,
  address,
}: {
  feature: AbTestName;
  address: string;
}): UseABTestProps => {
  const { activeAbTests, setActiveAbTest } = useAbTestsStore();

  const { data, isLoading } = useQuery({
    queryKey: ['abtest', feature, address],
    queryFn: async () => {
      const result = await getPosthogFeatureFlag(feature, address);
      if (!result.ok) {
        throw result.error;
      }

      const resultData = result.data.data;

      if (resultData && feature) {
        setActiveAbTest(feature, !!resultData);
      }

      return resultData;
    },
    enabled: !!feature && !!address,
    staleTime: TEN_MINUTES_MS,
    gcTime: THIRTY_MINUTES_MS,
  });

  const isEnabled = feature in activeAbTests ? activeAbTests[feature] : !!data;

  return {
    isEnabled,
    isLoading,
    value: data,
  };
};
