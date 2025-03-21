import { useQuery } from '@tanstack/react-query';
import { type AbTestName } from 'src/const/abtests';
import { useAbTestsStore } from 'src/stores/abTests';

export interface UseABTestProps {
  isEnabled: boolean;
  isLoading: boolean;
}

export const useABTest = ({
  feature,
  address,
}: {
  feature: AbTestName;
  address: string;
}): UseABTestProps => {
  const { activeAbTests, setActiveAbTest } = useAbTestsStore();
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const { data, isLoading } = useQuery({
    queryKey: ['abtest', feature, address],
    queryFn: async () => {
      const response = await fetch(
        `${apiBaseUrl}/posthog/feature-flag?key=${feature}&distinctId=${address}`,
      );
      const resFormatted = await response.json();

      if (resFormatted && feature) {
        setActiveAbTest(feature, resFormatted.data);
      }

      return resFormatted;
    },
    enabled: !!feature && !!address,
  });

  const isEnabled =
    feature in activeAbTests
      ? activeAbTests[feature]
      : (data?.isEnabled ?? false);

  return {
    isEnabled,
    isLoading,
  };
};
