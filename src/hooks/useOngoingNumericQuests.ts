import { useLoyaltyPassStore } from '@/stores/loyaltyPass';
import { useAccount } from '@lifi/wallet-management';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { SECONDS_IN_AN_HOUR } from 'src/const/time';
import config from '@/config/env-config';

export interface useOngoingNumericQuestsType {
  isSuccess: boolean;
  isLoading: boolean;
  data: OngoingNumericItem[];
}

export interface OngoingNumericItemStats {
  currentValue: number;
  max: number;
  min: number;
}
export interface OngoingNumericItem extends OngoingNumericItemStats {
  description: string | null;
  displayName: string;
  currentRangeXP: number;
  id: number;
  image: string;
  name: string;
  nextRangeXP: number;
  type: string;
}

export const useOngoingNumericQuests = (): useOngoingNumericQuestsType => {
  const { account } = useAccount();
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

  // we store the data for 1 hour
  const t = Date.now() / 1000;
  const storeNeedsRefresh = t > (timestamp ?? 0) + SECONDS_IN_AN_HOUR;

  const queryIsEnabled =
    !!account?.address &&
    // account?.chainType === 'EVM' &&
    (storeNeedsRefresh ||
      account?.address?.toLowerCase() !== storedAddress?.toLowerCase());

  // query
  const apiBaseUrl = config.NEXT_PUBLIC_BACKEND_URL;
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['ongoing-numeric-quests', account?.address],
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

  const errorWhileFetchingData = !data || !account?.address;

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
