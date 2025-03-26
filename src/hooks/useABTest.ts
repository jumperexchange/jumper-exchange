import { useQuery } from '@tanstack/react-query';
import { useABTestStore } from 'src/stores/abTests';

export interface UseABTestProps {
  isSuccess: boolean;
  isLoading: boolean;
  isEnabled: boolean;
}

export const useABTest = ({
  feature,
  user,
}: {
  feature: string;
  user: string;
}): UseABTestProps => {
  const { abtests, setAbtest } = useABTestStore();
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['ab_test', feature, user],
    enabled: !!feature && !!user,
    queryFn: async () => {
      if (!feature || !user) {
        return { isEnabled: false, isSuccess: true, isLoading: false };
      }

      const res = await fetch(
        `${apiBaseUrl}/posthog/feature-flag?key=${feature}&distinctId=${user}`,
      );

      if (!res.ok) {
        return undefined;
      }

      const resFormatted = await res.json();

      if (!resFormatted || !('data' in resFormatted)) {
        return { isEnabled: false };
      }

      if (resFormatted && feature) {
        setAbtest(feature, resFormatted.data);
      }

      return {
        isEnabled: Boolean(resFormatted.data),
      };
    },
  });

  const isEnabled =
    feature in abtests ? abtests[feature] : (data?.isEnabled ?? false);

  return {
    isEnabled,
    isSuccess,
    isLoading,
  };
};
