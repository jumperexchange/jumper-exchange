'use client';
import { useQueries } from '@tanstack/react-query';
import {
  getMerklOpportunities,
  MerklOpportunity,
} from 'src/app/lib/getMerklOpportunities';
import { REWARDS_CHAIN_IDS } from 'src/const/partnerRewardsTheme';
import { sanitizeSearchQuery } from 'src/utils/merkl/merklHelper';

const ACTIVE_CHAINS = REWARDS_CHAIN_IDS;
interface useMissionsAPYRes {
  isLoading: boolean;
  isSuccess: boolean;
  apy: number;
  data: MerklOpportunity[];
}

// todo: testing of DepositCard.tsx
export const useMissionsMaxAPY = (
  searchQuery: string[] | undefined,
  chainIds: number[] | undefined,
): useMissionsAPYRes => {
  // Create all combinations of chainIds and searchQuery with simple underscore check
  const queryCombinations = (chainIds || ACTIVE_CHAINS).flatMap((chainId) =>
    (searchQuery || []).map((claimingId) => ({
      chainId,
      address: sanitizeSearchQuery(claimingId),
    })),
  );

  const results = useQueries({
    queries: queryCombinations.map(({ chainId, address }) => ({
      queryKey: ['merklOpportunities', chainId, address],
      queryFn: async () => {
        try {
          return await getMerklOpportunities({
            chainIds: [String(chainId)],
            searchQueries: [address],
          });
        } catch (err) {
          console.error(
            `Error fetching Merkl opportunities for chain ${chainId} and address ${address}:`,
            err,
          );
          return [];
        }
      },
      enabled: !!searchQuery && searchQuery.length > 0,
      refetchInterval: 1000 * 60 * 60, // 1 hour
      retry: 3,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    })),
  });

  const data = results
    .map((r) => r.data)
    .filter((d) => Array.isArray(d))
    .flat();

  let apy = 0;

  if (searchQuery && data) {
    // Find the highest APR among the claiming IDs by checking breakdowns
    for (const opportunity of data) {
      // Check each breakdown in aprRecord for matching identifier
      const matchingBreakdown = opportunity.aprRecord?.breakdowns.find(
        (breakdown) => searchQuery.includes(breakdown.identifier),
      );

      if (matchingBreakdown && matchingBreakdown.value > apy) {
        apy = matchingBreakdown.value;
      }
    }
  }

  return {
    apy,
    data,
    isLoading: results.some((r) => r.isLoading),
    isSuccess: results.every((r) => r.isSuccess),
  };
};
