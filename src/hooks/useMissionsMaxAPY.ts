'use client';
import { useQueries } from '@tanstack/react-query';
import { REWARDS_CHAIN_IDS } from 'src/const/partnerRewardsTheme';

const ACTIVE_CHAINS = REWARDS_CHAIN_IDS;
const MERKL_API = 'https://api.merkl.xyz/v4';

interface MerklV4Token {
  address: string;
  symbol: string;
  decimals: number;
  price: number;
}

interface MerklV4Opportunity {
  chainId: number;
  type: string;
  identifier: string;
  name: string;
  status: string;
  apr: number;
  dailyRewards: number;
  tokens: MerklV4Token[];
  aprRecord: {
    cumulated: number;
    timestamp: string;
    breakdowns: Array<{
      distributionType: string;
      identifier: string;
      type: string;
      value: number;
    }>;
  };
  rewardsRecord: {
    total: number;
    timestamp: string;
    breakdowns: Array<{
      token: MerklV4Token;
      amount: string;
      value: number;
      distributionType: string;
      campaignId: string;
    }>;
  };
}

interface useMissionsAPYRes {
  isLoading: boolean;
  isSuccess: boolean;
  apy: number;
  data: MerklV4Opportunity[];
}

export const useMissionsMaxAPY = (
  searchQuery: string[] | undefined,
  chainIds: number[] | undefined,
): useMissionsAPYRes => {
  // Create all combinations of chainIds and searchQuery with simple underscore check
  const queryCombinations = (chainIds || ACTIVE_CHAINS).flatMap((chainId) =>
    (searchQuery || []).map((claimingId) => ({
      chainId,
      address: claimingId.includes('_') ? claimingId.split('_')[1] : claimingId,
    })),
  );

  const results = useQueries({
    queries: queryCombinations.map(({ chainId, address }) => ({
      queryKey: ['merklOpportunities', chainId, address],
      queryFn: async () => {
        try {
          const response = await fetch(
            `${MERKL_API}/opportunities?chainId=${chainId}&search=${address}`,
          );
          const result = await response.json();
          return result as MerklV4Opportunity[];
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
    .filter((d): d is MerklV4Opportunity[] => Array.isArray(d))
    .flat();

  let apy = 0;

  if (searchQuery && data) {
    // Find the highest APR among the claiming IDs by checking breakdowns
    for (const opportunity of data) {
      // Check each breakdown in aprRecord for matching identifier
      const matchingBreakdown = opportunity.aprRecord.breakdowns.find(
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
