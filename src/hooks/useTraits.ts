import type { Trait } from '@/types/loyaltyPass';
import { useAccount } from '@lifi/wallet-management';
import { useQuery } from '@tanstack/react-query';

export interface UseTraitsPassProps {
  isSuccess: boolean;
  isLoading: boolean;
  // traits?: Trait[];
  traits?: string[];
}

export const useTraits = (): UseTraitsPassProps => {
  const { account } = useAccount();

  // query
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['traits', account?.address],
    queryFn: async () => {
      const res = await fetch(
        `${apiBaseUrl}/wallets/${account?.address}/traits`,
      );

      if (!res.ok) {
        return undefined;
      }

      const jsonResponse = await res.json();

      if (!jsonResponse || !jsonResponse.data || !account?.address) {
        return undefined;
      }

      const { data } = jsonResponse;

      const traitsArr = data?.map((e: Trait) => e.trait?.name);

      return {
        traits: traitsArr,
      };
    },
    enabled: !!account?.address,
    refetchInterval: 1000 * 60 * 60,
  });

  return { ...data, isSuccess, isLoading };
};
