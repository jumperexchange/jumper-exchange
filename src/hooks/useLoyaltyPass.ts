import config from '@/config/env-config';
import type { PDA } from '@/types/loyaltyPass';
import { useQuery } from '@tanstack/react-query';
import { ONE_DAY_MS } from 'src/const/time';

export interface UseLoyaltyPassProps {
  isSuccess: boolean;
  isLoading: boolean;
  points?: number;
  level?: string;
  pdas?: PDA[];
}

export async function getLoyaltyPassDataQuery({
  queryKey,
}: {
  queryKey: (string | undefined)[];
}) {
  const apiBaseUrl = config.NEXT_PUBLIC_BACKEND_URL;
  const walletAddress = queryKey[1];
  const res = await fetch(`${apiBaseUrl}/wallets/${walletAddress}/rewards`);

  if (!res.ok) {
    return undefined;
  }

  const jsonResponse = await res.json();

  if (!jsonResponse || !jsonResponse.data || !walletAddress) {
    return undefined;
  }

  const { data } = jsonResponse;
  return {
    address: walletAddress,
    points: data.sum,
    level: data.level,
    pdas: data.walletRewards,
  };
}

// TODO: Make this component server friendly by removing the useEffect/state
// Will enable its usage into /app/api/profile/[walletAddress]/route.tsx
export const useLoyaltyPass = (walletAddress?: string): UseLoyaltyPassProps => {
  // query
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['loyalty-pass', walletAddress],
    queryFn: async ({ queryKey }) => {
      const walletAddress = queryKey[1];
      const data = await getLoyaltyPassDataQuery({ queryKey });

      return {
        address: walletAddress,
        points: data?.points,
        level: data?.level,
        pdas: data?.pdas,
      };
    },
    enabled: !!walletAddress,
    refetchInterval: ONE_DAY_MS,
  });

  return { ...data, isSuccess, isLoading };
};
