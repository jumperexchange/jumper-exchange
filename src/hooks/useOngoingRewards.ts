import { useLoyaltyPassStore } from '@/stores/loyaltyPass';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { SECONDS_IN_A_DAY } from 'src/const/time';
import { useAccounts } from './useAccounts';

export interface UseOngoingRewardsType {
  isSuccess: boolean;
  isLoading: boolean;
  data: OngoingRewardsItem[];
}

export interface OngoingRewardsItemStats {
  points: number;
  max: number;
  min: number;
}
export interface OngoingRewardsItem extends OngoingRewardsItemStats {
  description: string | null;
  displayName: string;
  level?: number;
  id: number;
  image: string;
  name: string;
  nextLevel: number;
  type: string;
}

export const useOngoingRewards = (): UseOngoingRewardsType => {
  const { account } = useAccounts();
  const {
    address: storedAddress,
    timestamp,
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
    // account?.chainType === 'EVM' &&
    (storeNeedsRefresh ||
      account?.address?.toLowerCase() !== storedAddress?.toLowerCase());

  // query
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['ongoing-rewards', account?.address],
    queryFn: async () => {
      const res = await fetch(
        `${apiBaseUrl}/wallets/${account?.address}/ongoing-rewards`,
      );

      if (!res.ok) {
        return undefined;
      }

      const jsonResponse = await res.json();

      if (!jsonResponse || !jsonResponse.data || !account?.address) {
        return undefined;
      }

      const { data } = jsonResponse;
      return data;
    },
    enabled: queryIsEnabled,
    refetchInterval: 1000 * 60 * 60,
  });

  const returnLocalData = account?.address === storedAddress && !queryIsEnabled;

  const errorWhileFetchingData = !data || !account?.address; //|| !(account.chainType === 'EVM');

  if (returnLocalData) {
    return {
      data,
      isSuccess: true,
      isLoading: isLoading,
    };
  } else if (errorWhileFetchingData) {
    return {
      data: [],
      isSuccess: false,
      isLoading: isLoading,
    };
  }

  return { data, isSuccess, isLoading };
};
