import { useLoyaltyPassStore } from '@/stores/loyaltyPass';
import type { PDA } from '@/types/loyaltyPass';
import { useQuery } from '@tanstack/react-query';
import { useAccounts } from './useAccounts';

export interface UseLoyaltyPassProps {
  isSuccess: boolean;
  isLoading: boolean;
  points?: number;
  tier?: string;
  pdas?: PDA[];
}

const SECONDS_IN_A_DAY = 86400;

export const useLoyaltyPass = (): UseLoyaltyPassProps => {
  const { account } = useAccounts();
  const {
    address: storedAddress,
    points: storedPoints,
    tier: storedTier,
    pdas: storedPdas,
    timestamp,
    setLoyaltyPassData,
  } = useLoyaltyPassStore((state) => state);

  //we store the data during 24hours to avoid querying too much our partner API.
  const t = Date.now() / 1000;
  const storeNeedsRefresh = t > (timestamp ?? 0) + SECONDS_IN_A_DAY;

  const queryIsEnabled =
    (!!account?.address &&
      account?.chainType === 'EVM' &&
      (storeNeedsRefresh ||
        account?.address?.toLowerCase() !== storedAddress?.toLowerCase())) ||
    (!!account?.address &&
      storedPdas &&
      storedPdas.length > 0 &&
      storedPdas[0] &&
      (storedPdas[0] as any)['ownerHash']);

  // query
  const apiBaseUrl = process.env.NEXT_PUBLIC_JUMPER_API;
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['loyalty-pass'],
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl}/users/${account?.address}`);

      if (!res.ok) {
        return undefined;
      }

      const data = await res.json();

      if (!data || !account?.address) {
        return undefined;
      }

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
