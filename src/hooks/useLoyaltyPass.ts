import { useLoyaltyPassStore } from '@/stores/loyaltyPass';
import type { PDA } from '@/types/loyaltyPass';
import { useAccount } from '@lifi/wallet-management';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export interface UseLoyaltyPassProps {
  isSuccess: boolean;
  isLoading: boolean;
  points?: number;
  tier?: string;
  pdas?: PDA[];
}

const SECONDS_IN_A_DAY = 86400;

export const useLoyaltyPass = (): UseLoyaltyPassProps => {
  const { account } = useAccount();
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
    if (!account || !storedAddress) {
      return;
    }

    if (account.address === storedAddress) {
      return;
    }

    reset();
  }, [account, reset, storedAddress]);

  //we store the data during 24hours to avoid querying too much our partner API.
  const t = Date.now() / 1000;
  const storeNeedsRefresh = t > (timestamp ?? 0) + SECONDS_IN_A_DAY;

  const queryIsEnabled =
    !!account?.address &&
    account?.chainType === 'EVM' &&
    (storeNeedsRefresh ||
      account?.address?.toLowerCase() !== storedAddress?.toLowerCase());

  // query
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['loyalty-pass', account?.address],
    queryFn: async () => {
      const res = await fetch(
        `${apiBaseUrl}/wallets/${account?.address}/rewards`,
      );

      if (!res.ok) {
        return undefined;
      }

      const jsonResponse = await res.json();

      if (!jsonResponse || !jsonResponse.data || !account?.address) {
        return undefined;
      }

      const { data } = jsonResponse;

      setLoyaltyPassData(
        account.address,
        data.sum,
        data.currentLevel,
        data.walletRewards,
        t,
      );

      return {
        address: account.address,
        points: data.sum,
        tier: data.currentLevel,
        pdas: data.walletRewards,
      };
    },
    enabled: queryIsEnabled,
    refetchInterval: 1000 * 60 * 60,
  });

  const returnLocalData = account?.address === storedAddress && !queryIsEnabled;

  const errorWhileFetchingData =
    !data || !account?.address || !(account.chainType === 'EVM');

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
