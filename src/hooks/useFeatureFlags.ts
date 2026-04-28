'use client';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from '@lifi/wallet-management';
import config from '@/config/env-config';
import { useFpStore } from 'src/stores/fp';
import type { FeatureFlagResponseDto } from 'src/types/jumper-backend';

export const useFeatureFlagsDistinctId = () => {
  const { account } = useAccount();
  const fp = useFpStore((state) => state.fp);
  return account.address || fp;
};

export const useFeatureFlags = () => {
  const distinctId = useFeatureFlagsDistinctId();

  return useQuery({
    queryKey: ['feature-flags', distinctId],
    queryFn: async (): Promise<FeatureFlagResponseDto[]> => {
      const backendUrl = config.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        return [];
      }

      const url = `${backendUrl}/feature-flags?distinctId=${encodeURIComponent(distinctId)}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to fetch feature flags');
      }

      const json = await res.json();
      return json.data ?? json ?? [];
    },
    staleTime: Infinity,
  });
};
