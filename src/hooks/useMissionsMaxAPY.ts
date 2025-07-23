'use client';
import { useQueries } from '@tanstack/react-query';
import {
  getMerklOpportunities,
  MerklOpportunity,
} from 'src/app/lib/getMerklOpportunities';
import { REWARDS_CHAIN_IDS } from 'src/const/partnerRewardsTheme';
import { MERKL_CACHE_TIME } from 'src/utils/merkl/merklApi';
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
  const { opportunities, maxApy, isLoading, isSuccess } = useQueries({
    queries: (chainIds || ACTIVE_CHAINS).flatMap((chainId) =>
      (searchQuery || []).map((claimingId) => ({
        queryKey: [
          'merklOpportunities',
          chainId,
          sanitizeSearchQuery(claimingId),
        ],
        queryFn: async () => {
          try {
            return await getMerklOpportunities({
              chainIds: [String(chainId)],
              searchQueries: [sanitizeSearchQuery(claimingId)],
            });
          } catch (err) {
            console.error(
              `Error fetching Merkl opportunities for chain ${chainId} and address ${sanitizeSearchQuery(claimingId)}:`,
              err,
            );
            return [];
          }
        },
        enabled: !!searchQuery?.length,
        refetchInterval: MERKL_CACHE_TIME,
        retry: 3,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
      })),
    ),
    combine: (results) => {
      const allData = results.flatMap((r) => r.data || []);

      const apy = allData.reduce((maxApy, opportunity) => {
        const matchingBreakdown = opportunity.aprRecord?.breakdowns.find(
          (breakdown) => searchQuery?.includes(breakdown.identifier),
        );
        return Math.max(maxApy, matchingBreakdown?.value || 0);
      }, 0);

      return {
        opportunities: allData,
        maxApy: apy,
        isLoading: results.some((r) => r.isLoading),
        isSuccess: results.every((r) => r.isSuccess),
      };
    },
  });

  return {
    apy: maxApy,
    data: opportunities,
    isLoading,
    isSuccess,
  };
};
