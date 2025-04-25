'use client';
import { useQueries, useQuery } from '@tanstack/react-query';
import { REWARDS_CHAIN_IDS } from 'src/const/partnerRewardsTheme';
import type { ClaimableRewards, MerklRewardsData } from 'src/types/strapi';
import { type MerklToken } from './useMerklTokens';

interface ChainInfo {
  id: number;
  name: string;
  icon: string;
  Explorer: {
    id: string;
    type: string;
    url: string;
    chainId: number;
  }[];
}

interface TokenInfo {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
}

interface RewardBreakdown {
  reason: string;
  amount: string;
  claimed: string;
  pending: string;
  campaignId: string;
}

interface Reward {
  root: string;
  recipient: string;
  amount: string;
  claimed: string;
  pending: string;
  proofs: string[];
  token: TokenInfo;
  breakdowns: RewardBreakdown[];
}

interface MerklRewardResponse {
  chain: ChainInfo;
  rewards: Reward[];
}

export interface AvailableRewards {
  chainId: number;
  address: string;
  symbol: string;
  accumulatedAmountForContractBN: string;
  amountToClaim: number;
  amountAccumulated: number;
  proof: string[];
  explorerLink: string;
  chainLogo: string;
  tokenLogo: string;
  claimingAddress: string;
  tokenDecimals: number;
}

export interface UseMerklRes {
  isSuccess: boolean;
  isLoading: boolean;
  availableRewards: AvailableRewards[];
  pastCampaigns: string[];
}

export interface UseMerklRewardsProps {
  userAddress?: string;
  rewardToken?: string;
  MerklRewards?: MerklRewardsData[];
  claimableTokens?: ClaimableRewards;
  includeTokenIcons?: boolean;
}

const MERKL_API = 'https://api.merkl.xyz/v4';
const MERKL_CLAIMING_ADDRESS = '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae';
const CACHE_TIME = 1000 * 60 * 60; // 1 hour
const STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const useMerklRewards = ({
  userAddress,
  MerklRewards,
  claimableTokens,
  includeTokenIcons = false,
}: UseMerklRewardsProps): UseMerklRes => {
  // Get unique chain IDs from MerklRewards or use default chains
  const chainIds =
    Array.isArray(MerklRewards) && MerklRewards.length > 0
      ? [
          ...new Set(
            MerklRewards.flatMap((reward) => reward.ChainId).filter(Boolean),
          ),
        ]
      : REWARDS_CHAIN_IDS;

  // Get Merkl tokens for each chain if we need token icons
  const merklTokensQueries = useQueries({
    queries: includeTokenIcons
      ? chainIds.map((chainId) => ({
          queryKey: ['MerklTokens', chainId],
          queryFn: async () => {
            const response = await fetch(
              `${MERKL_API}/tokens/reward/${chainId}`,
              {
                next: {
                  revalidate: 3600, // Revalidate every hour
                  tags: ['merkl-tokens', `merkl-tokens-${chainId}`], // Tag for manual revalidation
                },
              },
            );
            return response.json();
          },
          enabled: !!chainId,
          refetchInterval: CACHE_TIME, // Refetch every hour
          staleTime: STALE_TIME, // Consider data stale after 5 minutes
          gcTime: CACHE_TIME, // Keep data in cache for 1 hour
        }))
      : [],
  });

  // Map of chainId to tokens
  const merklTokensByChain: Record<string, MerklToken[] | undefined> =
    includeTokenIcons
      ? chainIds.reduce(
          (acc, chainId, index) => {
            if (chainId) {
              acc[chainId.toString()] = merklTokensQueries[index].data;
            }
            return acc;
          },
          {} as Record<string, MerklToken[] | undefined>,
        )
      : {};

  // Call to get the active positions with new v4 API format
  const MERKL_POSITIONS_API = `${MERKL_API}/users/${userAddress}/rewards${
    chainIds?.length > 0 ? '?chainId=' + chainIds.join(',') : ''
  }`;

  const {
    data: userRewardsData,
    isSuccess: positionsIsSuccess,
    isLoading: positionsIsLoading,
  } = useQuery<MerklRewardResponse[]>({
    queryKey: ['MerklPositions', userAddress, chainIds.join(',')],
    queryFn: async () => {
      const response = await fetch(MERKL_POSITIONS_API, {
        next: {
          revalidate: 3600, // Revalidate every hour
          tags: ['merkl-rewards', `merkl-rewards-${userAddress}`], // Tag for manual revalidation
        },
      });
      if (!response.ok) {
        throw new Error(`Merkl API error: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!userAddress && chainIds.length > 0,
    refetchInterval: CACHE_TIME, // Refetch every hour
    staleTime: STALE_TIME, // Consider data stale after 5 minutes
    gcTime: CACHE_TIME, // Keep data in cache for 1 hour
  });

  // Process the rewards data with new v4 format
  const { rewardsToClaim, pastCampaigns } = userRewardsData
    ? (() => {
        // Get token addresses from MerklRewards if provided
        const tokenAddresses = (MerklRewards || [])
          .flatMap((el) => el.TokenAddress)
          .filter((el) => !!el)
          .map((addr) => (addr as string).toLowerCase());

        // Process all rewards and collect campaign IDs
        const processedData = userRewardsData.flatMap((chainData) => {
          const rewards = chainData.rewards
            .filter((reward) => {
              // Skip if we have token addresses and this reward's token is not in the list
              if (tokenAddresses?.length > 0) {
                return tokenAddresses.includes(
                  reward.token.address.toLowerCase(),
                );
              }
              return true;
            })
            .map((reward) => {
              // Find matching token for icon if needed
              let tokenLogo = '';
              if (includeTokenIcons) {
                const chainTokens =
                  merklTokensByChain[reward.token.chainId.toString()];
                const matchingToken = chainTokens?.find(
                  (token: MerklToken) =>
                    token.address.toLowerCase() ===
                    reward.token.address.toLowerCase(),
                );
                tokenLogo = matchingToken?.icon || '';
              }

              // Calculate amounts
              const amountBigInt = BigInt(reward.amount);
              const claimedBigInt = BigInt(reward.claimed);
              const decimals = reward.token.decimals;

              return {
                chainId: reward.token.chainId,
                address: reward.token.address,
                symbol: reward.token.symbol,
                accumulatedAmountForContractBN: reward.amount,
                amountToClaim: Number(
                  (amountBigInt - claimedBigInt) / BigInt(10 ** decimals),
                ),
                amountAccumulated: Number(
                  amountBigInt / BigInt(10 ** decimals),
                ),
                proof: reward.proofs,
                explorerLink: chainData.chain.Explorer[0]?.url || '',
                chainLogo: chainData.chain.icon,
                tokenLogo,
                claimingAddress: MERKL_CLAIMING_ADDRESS,
                tokenDecimals: decimals,
              };
            });

          return rewards;
        });

        // Collect all campaign IDs
        const campaignIds = userRewardsData.flatMap((chainData) =>
          chainData.rewards.flatMap((reward) =>
            reward.breakdowns.map((breakdown) => breakdown.campaignId),
          ),
        );

        return {
          rewardsToClaim: processedData,
          pastCampaigns: [...new Set(campaignIds)],
        };
      })()
    : { rewardsToClaim: [], pastCampaigns: [] };

  return {
    isLoading: positionsIsLoading,
    isSuccess: positionsIsSuccess,
    availableRewards: rewardsToClaim,
    pastCampaigns,
  };
};
