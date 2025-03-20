import { useQuery } from '@tanstack/react-query';
import { type AbTestName } from 'src/const/abtests';
import { useAbTestsStore } from 'src/stores/abTests';

export interface UseABTestProps {
  isEnabled: boolean;
  isLoading: boolean;
}

export const useABTest = ({
  feature,
  user,
}: {
  feature: AbTestName;
  user: string;
}): UseABTestProps => {
  const { activeTests, setActiveTest } = useAbTestsStore();
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const { data, isLoading } = useQuery({
    queryKey: ['abtest', feature, user],
    queryFn: async () => {
      const response = await fetch(
        `${apiBaseUrl}/abtest?feature=${feature}&user=${user}`,
      );
      const resFormatted = await response.json();

      if (resFormatted && feature) {
        setActiveTest(feature, resFormatted.data);
      }

      return resFormatted;
    },
    enabled: !!feature && !!user,
  });

  const isEnabled =
    feature in activeTests ? activeTests[feature] : (data?.isEnabled ?? false);

  return {
    isEnabled,
    isLoading,
  };
};
