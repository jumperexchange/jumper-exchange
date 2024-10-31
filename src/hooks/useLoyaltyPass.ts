import { useLoyaltyPassStore } from '@/stores/loyaltyPass';
import type { PDA } from '@/types/loyaltyPass';
import { useAccount } from '@lifi/wallet-management';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { SECONDS_IN_A_DAY } from 'src/const/time';
import { isEVMAddress } from '@/utils/isEVMAddress';

export interface UseLoyaltyPassProps {
  isSuccess: boolean;
  isLoading: boolean;
  points?: number;
  tier?: string;
  pdas?: PDA[];
}

export const useLoyaltyPass = (walletAddress?: string): UseLoyaltyPassProps => {
  const {
    address: storedAddress,
    points: storedPoints,
    tier: storedTier,
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
    isEVMAddress(walletAddress) &&
    (storeNeedsRefresh ||
      walletAddress.toLowerCase() !== storedAddress?.toLowerCase());

  // query
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['loyalty-pass', walletAddress],
    queryFn: async () => {
      const res = await fetch(
        `${apiBaseUrl}/wallets/${walletAddress}/rewards`,
      );

      if (!res.ok) {
        return undefined;
      }

      const jsonResponse = await res.json();

      if (!jsonResponse || !jsonResponse.data || !walletAddress) {
        return undefined;
      }

      const { data } = jsonResponse;

      setLoyaltyPassData(
        walletAddress,
        data.sum,
        data.currentLevel,
        data.walletRewards,
        t,
      );

      return {
        address: walletAddress,
        points: data.sum,
        tier: data.currentLevel,
        pdas: data.walletRewards,
      };
    },
    enabled: queryIsEnabled,
    refetchInterval: 1000 * 60 * 60,
  });

  const returnLocalData = walletAddress === storedAddress && !queryIsEnabled;

  const errorWhileFetchingData =
    !data || !walletAddress || !isEVMAddress(walletAddress);

  if (returnLocalData) {
    return {
      isSuccess: true,
      isLoading: isLoading,
      points: storedPoints,
      tier: storedTier,
      pdas: storedPdas,
    };
  } else if (errorWhileFetchingData) {
    return {
      isSuccess: false,
      isLoading: isLoading,
      points: undefined,
      tier: undefined,
      pdas: [],
    };
  }

  return { ...data, isSuccess, isLoading };
};
