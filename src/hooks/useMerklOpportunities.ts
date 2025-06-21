'use client';
import {
  getMerklOpportunities,
  MerklOpportunity,
} from '@/app/lib/getMerklOpportunities';
import { useQuery } from '@tanstack/react-query';
import { MERKL_CACHE_TIME, MERKL_STALE_TIME } from 'src/utils/merkl/merklApi';

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
    refetchInterval: MERKL_CACHE_TIME,
    staleTime: MERKL_STALE_TIME,
    gcTime: MERKL_CACHE_TIME,
  });

  return {
    data: data || [],
    isLoading,
    isSuccess,
  };
};
