'use client';

import { useQuery } from '@tanstack/react-query';
import { getMerklApy } from 'src/utils/merkl/merklApy';
import { MERKL_CACHE_TIME } from 'src/utils/merkl/merklApi';
import type { RewardApiLink } from '@/types/jumper-backend';

interface UseMerklApysByLinksResult {
  apy: number;
  isLoading: boolean;
  isSuccess: boolean;
}

export const useMerklApysByLinks = (
  criteria: RewardApiLink[] | undefined,
): UseMerklApysByLinksResult => {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: [
      'merklApy',
      criteria?.map((c) => `${c.type}:${c.identifier}`) ?? [],
    ],
    queryFn: () => getMerklApy(criteria ?? []),
    enabled: !!criteria?.length,
    refetchInterval: MERKL_CACHE_TIME,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  return {
    apy: data?.maxApy ?? 0,
    isLoading,
    isSuccess,
  };
};
