import config from '@/config/env-config';
import type { PDA } from '@/types/loyaltyPass';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export interface UseLoyaltyPassProps {
  isSuccess: boolean;
  isLoading: boolean;
  points?: number;
  level?: string;
  pdas?: PDA[];
  error: Error | null;
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
    level: data.currentLevel,
    pdas: data.walletRewards,
  };
}

// TODO: Make this component server friendly by removing the useEffect/state
// Will enable its usage into /app/api/profile/[walletAddress]/route.tsx
export const useLoyaltyPass = (walletAddress?: string): UseLoyaltyPassProps => {
  useEffect(() => {
    if (!walletAddress) {
      return;
    }
  }, [walletAddress]);

  //we store the data during 24hours to avoid querying too much our partner API.
  const t = Date.now() / 1000;

  const queryIsEnabled = !!walletAddress;
  // query
  const { data, isSuccess, isLoading, error } = useQuery({
    queryKey: ['loyalty-pass', walletAddress],
    queryFn: async ({ queryKey }) => {
      const data = await getLoyaltyPassDataQuery({ queryKey });

      return {
        address: walletAddress,
        points: data?.points,
        level: data?.level,
        pdas: data?.pdas,
      };
    },
    enabled: queryIsEnabled,
    refetchInterval: 1000 * 60 * 60,
  });

  return { ...data, isSuccess, isLoading, error };
};
