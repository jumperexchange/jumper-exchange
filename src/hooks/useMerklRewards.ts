'use client';
import { getMerklTokens, MerklToken } from '@/app/lib/getMerklTokens';
import { getMerklUserRewards } from '@/app/lib/getMerklUserRewards';
import { useQueries, useQuery } from '@tanstack/react-query';
import { REWARDS_CHAIN_IDS } from 'src/const/partnerRewardsTheme';
import { AvailableRewardsExtended } from 'src/types/merkl';
import type { ClaimableRewards, MerklRewardsData } from 'src/types/strapi';
import { CACHE_TIME, STALE_TIME } from 'src/utils/merkl/merklApi';
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
  // Get unique chain IDs from merklRewards or use default chains
  const chainIds: string[] =
    Array.isArray(merklRewards) && merklRewards.length > 0
      ? [
          ...new Set(
            merklRewards
              .flatMap((reward) => reward.ChainId)
              .filter(Boolean)
              .map(String),
          ),
        ]
      : REWARDS_CHAIN_IDS;

  // Fetch user rewards
  const {
    data: userRewardsData,
    isSuccess: positionsIsSuccess,
    isLoading: positionsIsLoading,
  } = useQuery({
    queryKey: ['MerklUserRewards', userAddress, chainIds.join(',')],
    queryFn: () => {
      if (!userAddress) throw new Error('User address is required');
      return getMerklUserRewards({ userAddress, chainIds, claimableOnly });
    },
    enabled: !!userAddress && chainIds.length > 0,
    refetchInterval: CACHE_TIME,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });

  // Process the rewards data
  const { rewardsToClaim, pastCampaigns, chainsWithClaimableRewards } =
    userRewardsData
      ? processRewardsData(userRewardsData, merklRewards)
      : {
          rewardsToClaim: [],
          pastCampaigns: [],
          chainsWithClaimableRewards: [],
        };

  // Get Merkl tokens for chains with claimable rewards
  const merklTokensQueries = useQueries({
    queries: chainsWithClaimableRewards.map((chainId) => ({
      queryKey: ['MerklTokens', chainId],
      queryFn: async () => {
        const numericChainId = Number(chainId);
        return getMerklTokens({ chainId: numericChainId });
      },
      enabled: !!userAddress && !!chainId && includeTokenIcons,
      refetchInterval: CACHE_TIME,
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
      retry: 1,
      retryDelay: 1000,
    })),
  });

  // Map of chainId to tokens
  const merklTokensByChain = chainsWithClaimableRewards.reduce<
    Record<string, MerklToken[]>
  >((acc, chainId, index) => {
    if (chainId) {
      acc[chainId.toString()] = merklTokensQueries[index].data || [];
    }
    return acc;
  }, {});

  // Add token logos to rewards if needed
  const rewardsWithLogos = rewardsToClaim.map((reward) => {
    const chainTokens = merklTokensByChain[reward.chainId.toString()];
    const matchingToken = chainTokens?.find(
      (token) => token.address.toLowerCase() === reward.address.toLowerCase(),
    );
    return {
      ...reward,
      tokenLogo: matchingToken?.icon || '',
    };
  });

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
