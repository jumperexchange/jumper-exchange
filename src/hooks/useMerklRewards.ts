'use client';
import { getMerklTokens, MerklToken } from '@/app/lib/getMerklTokens';
import { getMerklUserRewards } from '@/app/lib/getMerklUserRewards';
import { useQueries, useQuery } from '@tanstack/react-query';
import { REWARDS_CHAIN_IDS } from 'src/const/partnerRewardsTheme';
import { AvailableRewardsExtended, ChainInfo } from 'src/types/merkl';
import type { ClaimableRewards, MerklRewardsData } from 'src/types/strapi';

interface ApiToken {
  symbol: string;
  decimals: number;
  address: string;
  chainId: number;
}

interface ApiReward {
  token: ApiToken;
  claimed: string | bigint;
  recipient: string;
  amount: string | bigint;
  root: string;
  proofs: string[];
  pending: string | bigint;
  breakdowns: Array<{
    reason: string;
    amount: string | bigint;
    claimed: string | bigint;
    pending: string | bigint;
    campaignId: string;
  }>;
}

interface MerklUserReward {
  chain: ChainInfo;
  rewards: ApiReward[];
}

export interface UseMerklRes {
  isSuccess: boolean;
  isLoading: boolean;
  availableRewards: AvailableRewardsExtended[];
  pastCampaigns: string[];
}

export interface UseMerklRewardsProps {
  userAddress?: string;
  merklRewards?: MerklRewardsData[];
  claimableTokens?: ClaimableRewards;
  claimableOnly?: boolean;
  includeTokenIcons?: boolean;
}

const MERKL_CLAIMING_ADDRESS = '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae';
const CACHE_TIME = 1000 * 60 * 60; // 1 hour
const STALE_TIME = 1000 * 60 * 5; // 5 minutes

interface TokenAddressesByChain {
  [chainId: number]: Set<string>;
}

// Helper functions
const processTokenAddressesByChain = (
  merklRewards: MerklRewardsData[] = [],
): TokenAddressesByChain => {
  return merklRewards.reduce<TokenAddressesByChain>((acc, reward) => {
    if (reward.ChainId && reward.TokenAddress) {
      const chainId = Number(reward.ChainId);
      const tokenAddress = reward.TokenAddress.toLowerCase();
      if (!acc[chainId]) {
        acc[chainId] = new Set();
      }
      acc[chainId].add(tokenAddress);
    }
    return acc;
  }, {});
};

const processReward = (
  reward: ApiReward,
  chainData: MerklUserReward,
): AvailableRewardsExtended => {
  const amountBigInt = BigInt(reward.amount);
  const claimedBigInt = BigInt(reward.claimed);
  const decimals = reward.token.decimals;
  const amountToClaim = Number(
    (amountBigInt - claimedBigInt) / BigInt(10 ** decimals),
  );

  return {
    chainId: reward.token.chainId,
    address: reward.token.address,
    symbol: reward.token.symbol,
    accumulatedAmountForContractBN: String(reward.amount),
    amountToClaim,
    amountAccumulated: Number(amountBigInt / BigInt(10 ** decimals)),
    proof: reward.proofs,
    explorerLink: chainData.chain.Explorer[0]?.url || '',
    chainLogo: chainData.chain.icon,
    tokenLogo: '', // Will be filled later if needed
    claimingAddress: MERKL_CLAIMING_ADDRESS,
    tokenDecimals: decimals,
  };
};

const processRewardsData = (
  userRewardsData: MerklUserReward[],
  merklRewards?: MerklRewardsData[],
) => {
  const tokenAddressesByChain = processTokenAddressesByChain(merklRewards);

  // Process all rewards and collect campaign IDs
  const processedData = userRewardsData.flatMap(
    (chainData: MerklUserReward) => {
      const chainId = Number(chainData.chain.id);
      return chainData.rewards
        .filter((reward: ApiReward) => {
          const chainTokens = tokenAddressesByChain[chainId];
          if (chainTokens?.size > 0) {
            return chainTokens.has(reward.token.address.toLowerCase());
          }
          return true;
        })
        .map((reward: ApiReward) => processReward(reward, chainData));
    },
  );

  // Collect all campaign IDs
  const campaignIds = userRewardsData.flatMap((chainData: MerklUserReward) =>
    chainData.rewards.flatMap((reward: ApiReward) =>
      reward.breakdowns.map((breakdown) => String(breakdown.campaignId)),
    ),
  );

  // Get unique chain IDs where user has claimable rewards
  const chainsWithRewards = new Set(
    processedData
      .filter((reward) => reward.amountToClaim > 0)
      .map((reward) => reward.chainId),
  );

  return {
    rewardsToClaim: processedData,
    pastCampaigns: Array.from(new Set(campaignIds)),
    chainsWithClaimableRewards: Array.from(chainsWithRewards),
  };
};

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
      ? processRewardsData(userRewardsData as MerklUserReward[], merklRewards)
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
