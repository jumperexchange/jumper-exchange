import { useQuery } from '@tanstack/react-query';

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
  if (!feature || !user) {
    return { isEnabled: false, isSuccess: true, isLoading: false };
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['ab_test', feature, user],
    queryFn: async () => {
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

      return {
        isEnabled: Boolean(resFormatted.data),
      };
    },
  });

  return {
    isEnabled: data?.isEnabled ?? false,
    isSuccess,
    isLoading,
  };
};
