'use client';
import { useAccount } from '@jumperexchange/wallet-management';
import { useQuery } from '@tanstack/react-query';
import { useFpStore } from 'src/stores/fp';
import type { FeatureFlagResponseDto } from 'src/types/jumper-backend';
import { makeClient } from '@/app/lib/client';

export const useFeatureFlagsDistinctId = () => {
  const { account } = useAccount();
  const fp = useFpStore((state) => state.fp);
  return account?.address || fp;
};

export const useFeatureFlags = () => {
  const distinctId = useFeatureFlagsDistinctId();

  return useQuery({
    queryKey: ['feature-flags', distinctId],
    queryFn: async (): Promise<FeatureFlagResponseDto[]> => {
      const client = makeClient();
      const res = await client.v1.featureFlagControllerGetAllV1({ distinctId });
      return res.data.data ?? [];
    },
    staleTime: Infinity,
  });
};
