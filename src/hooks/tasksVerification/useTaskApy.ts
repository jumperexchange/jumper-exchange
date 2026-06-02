'use client';
import { useQuery } from '@tanstack/react-query';
import { getMerklOpportunities } from 'src/app/lib/getMerklOpportunities';
import { calculateMaxApy } from 'src/utils/merkl/merklHelper';
import { MERKL_CACHE_TIME } from 'src/utils/merkl/merklApi';

export const useTaskApy = (campaignId: string | undefined) => {
  return useQuery({
    queryKey: ['task-apy', campaignId],
    queryFn: async () => {
      const opportunities = await getMerklOpportunities({
        campaignId: campaignId!,
      });
      return calculateMaxApy(opportunities);
    },
    enabled: !!campaignId,
    staleTime: MERKL_CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
