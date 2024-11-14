import { useLoyaltyPassStore } from '@/stores/loyaltyPass';
import type { PDA } from '@/types/loyaltyPass';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { SECONDS_IN_A_DAY } from 'src/const/time';

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
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
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
  const {
    address: storedAddress,
    points: storedPoints,
    level: storedTier,
    pdas: storedPdas,
    timestamp,
    setLoyaltyPassData,
    reset,
  } = useLoyaltyPassStore((state) => state);

  useEffect(() => {
    if (!walletAddress || !storedAddress) {
      return;
    }

    if (walletAddress === storedAddress) {
      return;
    }

    reset();
  }, [walletAddress, reset, storedAddress]);

  //we store the data during 24hours to avoid querying too much our partner API.
  const t = Date.now() / 1000;
  const storeNeedsRefresh = t > (timestamp ?? 0) + SECONDS_IN_A_DAY;

  const queryIsEnabled =
    !!walletAddress &&
    (storeNeedsRefresh ||
      walletAddress.toLowerCase() !== storedAddress?.toLowerCase());

  // query
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['loyalty-pass', walletAddress],
    queryFn: async ({ queryKey }) => {
      const walletAddress = queryKey[1];
      const data = await getLoyaltyPassDataQuery({ queryKey });

      if (data && walletAddress) {
        setLoyaltyPassData(
          walletAddress,
          data.points,
          data.level,
          data.pdas,
          t,
        );
      }

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

  const returnLocalData = walletAddress === storedAddress && !queryIsEnabled;

  const errorWhileFetchingData =
    !data || !walletAddress;

  if (returnLocalData) {
    return {
      isSuccess: true,
      isLoading: isLoading,
      points: storedPoints,
      level: storedTier,
      pdas: storedPdas,
    };
  } else if (errorWhileFetchingData) {
    return {
      isSuccess: false,
      isLoading: isLoading,
      points: undefined,
      level: undefined,
      pdas: [],
    };
  }

  return { ...data, isSuccess, isLoading };
};
