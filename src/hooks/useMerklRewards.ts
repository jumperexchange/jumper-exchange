'use client';
import { getMerklTokens, MerklToken } from '@/app/lib/getMerklTokens';
import { getMerklUserRewards } from '@/app/lib/getMerklUserRewards';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { REWARDS_CHAIN_IDS } from 'src/const/partnerRewardsTheme';
import { AvailableRewardsExtended } from 'src/types/merkl';
import type { ClaimableRewards, MerklRewardsData } from 'src/types/strapi';
import { MERKL_CACHE_TIME, MERKL_STALE_TIME } from 'src/utils/merkl/merklApi';
import { processRewardsData } from 'src/utils/merkl/merklHelper';

interface UseMerklRes {
  isSuccess: boolean;
  isLoading: boolean;
  availableRewards: AvailableRewardsExtended[];
  pastCampaigns: string[];
}

interface UseMerklRewardsProps {
  userAddress?: string;
  merklRewards?: MerklRewardsData[];
  claimableTokens?: ClaimableRewards;
  claimableOnly?: boolean;
  includeTokenIcons?: boolean;
}

export const useMerklRewards = ({
  userAddress,
  merklRewards,
  claimableOnly = false,
  includeTokenIcons = false,
}: UseMerklRewardsProps): UseMerklRes => {
  // Memoize chain IDs calculation - use Set for O(1) lookup
  const chainIds = useMemo(() => {
    if (!Array.isArray(merklRewards) || merklRewards.length === 0) {
      return REWARDS_CHAIN_IDS;
    }

    // Use Set for automatic deduplication, then convert to array
    return Array.from(
      new Set(
        merklRewards
          .map((reward) => reward.ChainId)
          .filter(Boolean)
          .map(String),
      ),
    );
  }, [merklRewards]);

  // Memoize query function
  const fetchUserRewards = useCallback(async () => {
    return getMerklUserRewards({ userAddress, chainIds, claimableOnly });
  }, [userAddress, chainIds, claimableOnly]);

  // Fetch user rewards
  const {
    data: userRewardsData,
    isSuccess: positionsIsSuccess,
    isLoading: positionsIsLoading,
  } = useQuery({
    queryKey: ['MerklUserRewards', userAddress, chainIds.join(',')],
    queryFn: fetchUserRewards,
    enabled: !!userAddress && chainIds.length > 0,
    refetchInterval: MERKL_CACHE_TIME,
    staleTime: MERKL_STALE_TIME,
    gcTime: MERKL_CACHE_TIME,
  });

  // Memoize processed rewards data
  const { rewardsToClaim, pastCampaigns, chainsWithClaimableRewards } =
    useMemo(() => {
      if (!userRewardsData) {
        return {
          rewardsToClaim: [],
          pastCampaigns: [],
          chainsWithClaimableRewards: [],
        };
      }
      return processRewardsData(userRewardsData, merklRewards);
    }, [userRewardsData, merklRewards]);

  // Get Merkl tokens for chains with claimable rewards using combine method
  const { merklTokensByChain, tokenAddressMap } = useQueries({
    queries: chainsWithClaimableRewards.map((chainId) => ({
      queryKey: ['MerklTokens', chainId, userAddress] as const,
      queryFn: async () => {
        const numericChainId = Number(chainId);
        return getMerklTokens({ chainId: numericChainId });
      },
      enabled: !!userAddress && !!chainId && includeTokenIcons,
      refetchInterval: MERKL_CACHE_TIME,
      staleTime: MERKL_STALE_TIME,
      gcTime: MERKL_CACHE_TIME,
      retry: 1,
      retryDelay: 1000,
    })),
    combine: (results) => {
      const tokensByChain: Record<string, MerklToken[]> = {};
      const addressMap: Record<string, MerklToken> = {};

      chainsWithClaimableRewards.forEach((chainId, index) => {
        const tokens = results[index].data || [];
        tokensByChain[chainId.toString()] = tokens;

        // Create flat map for O(1) lookup
        tokens.forEach((token) => {
          addressMap[token.address.toLowerCase()] = token;
        });
      });

      return {
        merklTokensByChain: tokensByChain,
        tokenAddressMap: addressMap,
      };
    },
  });

  // Memoize rewards with logos - use the address map for O(1) lookup instead of find()
  const rewardsWithLogos = useMemo(
    () =>
      rewardsToClaim.map((reward) => {
        const matchingToken = tokenAddressMap[reward.address.toLowerCase()];
        return {
          ...reward,
          tokenLogo: matchingToken?.icon || '',
        };
      }),
    [rewardsToClaim, tokenAddressMap],
  );

  // Early return for no user address
  if (!userAddress) {
    return {
      isLoading: false,
      isSuccess: false,
      availableRewards: [],
      pastCampaigns: [],
    };
  }

  return {
    isLoading: positionsIsLoading,
    isSuccess: positionsIsSuccess,
    availableRewards: rewardsWithLogos,
    pastCampaigns,
  };
};
