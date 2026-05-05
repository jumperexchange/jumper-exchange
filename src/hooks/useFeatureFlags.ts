'use client';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from '@lifi/wallet-management';
import { makeClient } from '@/app/lib/client';
import { useFpStore } from 'src/stores/fp';
import type { FeatureFlagResponseDto } from 'src/types/jumper-backend';

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
      // @ts-expect-error: see LF-15589 - we are transforming data in the backend
      return res.data.data ?? [];
    },
    staleTime: Infinity,
  });
};
