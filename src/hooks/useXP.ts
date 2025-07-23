import { useQuery } from '@tanstack/react-query';
import { getLoyaltyPassDataQuery, UseLoyaltyPassProps } from './useLoyaltyPass';

export const useXp = (walletAddress?: string): UseLoyaltyPassProps => {
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['loyalty-pass', walletAddress],
    queryFn: async ({ queryKey }) => {
      const walletAddress = queryKey[1];
      const data = await getLoyaltyPassDataQuery({ queryKey });

      return {
        address: walletAddress,
        points: data?.points,
      };
    },
    enabled: !!walletAddress,
    refetchInterval: 1000 * 60 * 60,
  });

  return { ...data, isSuccess, isLoading };
};
