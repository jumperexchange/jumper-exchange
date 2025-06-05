'use client';
import { MERKL_API } from '@/utils/merkl/merklApi';
import { useQueries, useQuery } from '@tanstack/react-query';
import { REWARDS_CHAIN_IDS } from 'src/const/partnerRewardsTheme';
import {
  AvailableRewardsExtended,
  ChainInfo,
  MerklToken,
  Reward,
} from 'src/types/merkl';
import type { ClaimableRewards, MerklRewardsData } from 'src/types/strapi';

interface MerklRewardResponse {
  chain: ChainInfo;
  rewards: Reward[];
}
export interface UseMerklRes {
  isSuccess: boolean;
  isLoading: boolean;
  availableRewards: AvailableRewardsExtended[];
  pastCampaigns: string[];
}

export interface UseMerklRewardsProps {
  userAddress?: string;
  rewardToken?: string;
  MerklRewards?: MerklRewardsData[];
  claimableTokens?: ClaimableRewards;
  includeTokenIcons?: boolean;
}

const MERKL_CLAIMING_ADDRESS = '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae';
const CACHE_TIME = 1000 * 60 * 60; // 1 hour
const STALE_TIME = 1000 * 60 * 5; // 5 minutes

interface TokenAddressesByChain {
  [chainId: number]: Set<string>;
}

export const useMerklRewards = ({
  userAddress,
  MerklRewards,
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
  const { rewardsToClaim, pastCampaigns, chainsWithClaimableRewards } =
    userRewardsData
      ? (() => {
          // Get token addresses with their chain IDs from MerklRewards if provided
          const tokenAddressesByChain = (
            MerklRewards || []
          ).reduce<TokenAddressesByChain>((acc, reward) => {
            if (reward.ChainId && reward.TokenAddress) {
              const chainId = Number(reward.ChainId);
              const tokenAddress = (
                reward.TokenAddress as string
              ).toLowerCase();
              if (!acc[chainId]) {
                acc[chainId] = new Set();
              }
              acc[chainId].add(tokenAddress);
            }
            return acc;
          }, {});

          // Process all rewards and collect campaign IDs
          const processedData = userRewardsData.flatMap((chainData) => {
            const chainId = Number(chainData.chain.id);
            const rewards = chainData.rewards
              .filter((reward) => {
                // Skip if we have token addresses for this chain and this reward's token is not in the list
                const chainTokens = tokenAddressesByChain[chainId];
                if (chainTokens?.size > 0) {
                  return chainTokens.has(reward.token.address.toLowerCase());
                }
                return true;
              })
              .map((reward) => {
                // Calculate amounts
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
                  accumulatedAmountForContractBN: reward.amount,
                  amountToClaim,
                  amountAccumulated: Number(
                    amountBigInt / BigInt(10 ** decimals),
                  ),
                  proof: reward.proofs,
                  explorerLink: chainData.chain.Explorer[0]?.url || '',
                  chainLogo: chainData.chain.icon,
                  tokenLogo: '', // Will be filled later if needed
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

          // Get unique chain IDs where user has claimable rewards
          const chainsWithRewards = new Set(
            processedData
              .filter((reward) => reward.amountToClaim > 0)
              .map((reward) => reward.chainId),
          );

          return {
            rewardsToClaim: processedData,
            pastCampaigns: [...new Set(campaignIds)],
            chainsWithClaimableRewards: Array.from(chainsWithRewards),
          };
        })()
      : {
          rewardsToClaim: [],
          pastCampaigns: [],
          chainsWithClaimableRewards: [],
        };

  // Get Merkl tokens only for chains where user has claimable rewards
  const merklTokensQueries = useQueries({
    queries: includeTokenIcons
      ? chainsWithClaimableRewards.map((chainId) => ({
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
            if (!response.ok) {
              throw new Error(`Merkl API error: ${response.status}`);
            }
            return response.json();
          },
          enabled: !!userAddress && !!chainId,
          refetchInterval: CACHE_TIME, // Refetch every hour
          staleTime: STALE_TIME, // Consider data stale after 5 minutes
          gcTime: CACHE_TIME, // Keep data in cache for 1 hour
        }))
      : [],
  });

  // Map of chainId to tokens
  const merklTokensByChain: Record<string, MerklToken[] | undefined> =
    includeTokenIcons
      ? chainsWithClaimableRewards.reduce(
          (acc, chainId, index) => {
            if (chainId) {
              acc[chainId.toString()] = merklTokensQueries[index].data;
            }
            return acc;
          },
          {} as Record<string, MerklToken[] | undefined>,
        )
      : {};

  // Add token logos to rewards if needed
  const rewardsWithLogos = includeTokenIcons
    ? rewardsToClaim.map((reward) => {
        const chainTokens = merklTokensByChain[reward.chainId.toString()];
        const matchingToken = chainTokens?.find(
          (token: MerklToken) =>
            token.address.toLowerCase() === reward.address.toLowerCase(),
        );
        return {
          ...reward,
          tokenLogo: matchingToken?.icon || '',
        };
      })
    : rewardsToClaim;

  return {
    isLoading: positionsIsLoading,
    isSuccess: positionsIsSuccess,
    availableRewards: rewardsWithLogos,
    pastCampaigns,
  };
};
