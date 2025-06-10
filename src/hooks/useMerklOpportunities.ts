'use client';
import {
  getMerklOpportunities,
  MerklOpportunity,
} from '@/app/lib/getMerklOpportunities';
import { useQuery } from '@tanstack/react-query';

interface UseMerklOpportunitiesRes {
  isLoading: boolean;
  isSuccess: boolean;
  data: MerklOpportunity[];
}

interface UseMerklOpportunitiesProps {
  chainId: number;
  searchQuery?: string;
}

export const useMerklOpportunities = ({
  chainId,
  searchQuery,
}: UseMerklOpportunitiesProps): UseMerklOpportunitiesRes => {
  const { data, isSuccess, isLoading } = useQuery<MerklOpportunity[]>({
    queryKey: ['merklOpportunities', chainId, searchQuery],
    queryFn: async () => {
      return getMerklOpportunities({
        chainIds: [chainId.toString()],
        ...(searchQuery && { searchQueries: [searchQuery] }),
      });
    },
    enabled: !!chainId,
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
