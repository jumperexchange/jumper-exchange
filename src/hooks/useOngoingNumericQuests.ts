import config from '@/config/env-config';
import { useAccount } from '@lifi/wallet-management';
import { useQuery } from '@tanstack/react-query';
import { ONE_HOUR_MS } from 'src/const/time';

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
    enabled: !!account?.address,
    refetchInterval: ONE_HOUR_MS,
  });

  const errorWhileFetchingData = !data || !account?.address;

  if (errorWhileFetchingData) {
    return {
      data: [],
      isSuccess: false,
      isLoading: isLoading,
    };
  }

  return { data, isSuccess, isLoading };
};
