'use client';
import { getMerklOpportunities } from '@/app/lib/getMerklOpportunities';
import { useQuery } from '@tanstack/react-query';
import { MerklOpportunity } from 'src/types/merkl';

interface UseMerklOpportunitiesRes {
  isLoading: boolean;
  isSuccess: boolean;
  data: MerklOpportunity[];
}

interface UseMerklOpportunitiesProps {
  rewardsIds?: string[];
  campaignId?: string;
}

export const useMerklOpportunities = ({
  rewardsIds = [],
  campaignId,
}: UseMerklOpportunitiesProps): UseMerklOpportunitiesRes => {
  const { data, isSuccess, isLoading } = useQuery<MerklOpportunity[]>({
    queryKey: ['merklOpportunities', campaignId ?? rewardsIds],
    queryFn: async () => {
      const response = await getMerklOpportunities({
        rewardsIds,
        campaignId,
      });
      return response.data;
    },
    enabled: !!campaignId || rewardsIds.length > 0,
    refetchInterval: 1000 * 60 * 60, // 1 hour
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    data: data || [],
    isLoading,
    isSuccess,
  };
};
