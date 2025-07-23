import { useQuery } from '@tanstack/react-query';
import { getMerklOpportunities } from 'src/app/lib/getMerklOpportunities';

// Hook for campaign-specific opportunities
export function useMerklCampaignOpportunities(campaignId?: string) {
  return useQuery({
    queryKey: ['merkl', 'campaign', campaignId],
    queryFn: async () => {
      if (!campaignId) return [];
      return getMerklOpportunities({ campaignId });
    },
    enabled: !!campaignId,
  });
}

// Hook for chain-specific opportunities
export function useMerklChainOpportunities(chainIds?: string[]) {
  return useQuery({
    queryKey: ['merkl', 'chains', chainIds],
    queryFn: async () => {
      if (!chainIds?.length) return [];
      return getMerklOpportunities({ chainIds });
    },
    enabled: !!chainIds?.length,
  });
}

// Hook for search-specific opportunities
export function useMerklSearchOpportunities(searchQueries?: string[]) {
  return useQuery({
    queryKey: ['merkl', 'search', searchQueries],
    queryFn: async () => {
      if (!searchQueries?.length) return [];
      return getMerklOpportunities({ searchQueries });
    },
    enabled: !!searchQueries?.length,
  });
}

// Hook for combined chain and search opportunities
export function useMerklChainSearchOpportunities(
  chainIds?: string[],
  searchQueries?: string[],
) {
  return useQuery({
    queryKey: ['merkl', 'chainSearch', chainIds, searchQueries],
    queryFn: async () => {
      if (!chainIds?.length && !searchQueries?.length) return [];
      return getMerklOpportunities({ chainIds, searchQueries });
    },
    enabled: !!(chainIds?.length || searchQueries?.length),
  });
}
