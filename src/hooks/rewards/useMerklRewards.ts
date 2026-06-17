'use client';
import { getUserRewards } from '@/app/lib/getUserRewards';
import { useQuery } from '@tanstack/react-query';
import { isAddress } from 'viem';
import type { MerklReward } from 'src/types/rewards';

const CACHE_TIME = 1000 * 60 * 60; // 1 hour
const STALE_TIME = 1000 * 60 * 5; // 5 minutes

interface UseMerklRewardsProps {
  userAddress?: string;
}

interface UseMerklRewardsResult {
  isSuccess: boolean;
  isLoading: boolean;
  availableRewards: MerklReward[];
}

export const useMerklRewards = ({
  userAddress,
}: UseMerklRewardsProps): UseMerklRewardsResult => {
  const isValidAddress = !!userAddress && isAddress(userAddress);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['MerklUserRewards', userAddress],
    queryFn: () => getUserRewards(userAddress!),
    enabled: isValidAddress,
    refetchInterval: CACHE_TIME,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    select: (res) => (res?.rewards ?? []) as MerklReward[],
  });

  if (!isValidAddress) {
    return { isLoading: false, isSuccess: false, availableRewards: [] };
  }

  return {
    isLoading,
    isSuccess,
    availableRewards: data ?? [],
  };
};
