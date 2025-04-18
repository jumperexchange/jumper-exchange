'use client';
import { useQueries, useQuery } from '@tanstack/react-query';
import type { MerklRewardsData } from 'src/types/strapi';
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
  activeCampaigns: RewardBreakdown[];
  availableRewards: AvailableRewards[];
  pastCampaigns: string[];
  // activePosition?: {}[];
}

export interface UseMerklRewardsProps {
  userAddress?: string;
  rewardToken?: string;
  MerklRewards?: MerklRewardsData[];
}

const MERKL_API = 'https://api.merkl.xyz/v4';
const MERKL_CLAIMING_ADDRESS = '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae';

export const useMerklUserRewardsOnCampaign = ({
  userAddress,
  MerklRewards,
}: UseMerklRewardsProps): UseMerklRes => {
  // state
  let rewardsToClaim: AvailableRewards[] = [];
  const activeCampaigns: RewardBreakdown[] = [];
  const pastCampaigns = [] as string[];

  // Get unique chain IDs from MerklRewards
  const chainIds = MerklRewards?.length
    ? [
        ...new Set(
          MerklRewards.flatMap((reward) => reward.ChainId).filter(Boolean),
        ),
      ]
    : [];

  // Get Merkl tokens for each chain that's actually being used
  const merklTokensQueries = useQueries({
    queries: chainIds.map((chainId) => ({
      queryKey: ['MerklTokens', chainId],
      queryFn: async () => {
        const response = await fetch(`${MERKL_API}/tokens/reward/${chainId}`);
        return response.json();
      },
      enabled: !!chainId,
      refetchInterval: 1000 * 60 * 60,
    })),
  });

  // Map of chainId to tokens
  const merklTokensByChain: Record<string, MerklToken[] | undefined> = {};
  chainIds.forEach((chainId, index) => {
    if (chainId) {
      merklTokensByChain[chainId.toString()] = merklTokensQueries[index].data;
    }
  });

  // Call to get the active positions
  const MERKL_POSITIONS_API = `${MERKL_API}/users/${userAddress}/rewards${chainIds?.length > 0 ? '?chainId=' + chainIds.join(',') : ''}`;
  const {
    data: userRewardsData,
    isSuccess: positionsIsSuccess,
    isLoading: positionsIsLoading,
  } = useQuery<MerklRewardResponse[]>({
    queryKey: ['MerklPositions', userAddress, chainIds.join(',')],

    queryFn: async () => {
      const response = await fetch(MERKL_POSITIONS_API);
      if (!response.ok) {
        throw new Error(`Merkl API error: ${response.status}`);
      }
      const result = await response.json();
      return result as MerklRewardResponse[];
    },
    enabled: !!userAddress && !!MerklRewards && chainIds.length > 0,
    refetchInterval: 1000 * 60 * 60,
  });

  // Process the rewards data
  if (userRewardsData) {
    userRewardsData.forEach((chainData) => {
      // Get token addresses from MerklRewards
      const tokenAddresses = (MerklRewards || [])
        .flatMap((el) => el.TokenAddress)
        .filter((item) => !!item);

      // Skip if we have token addresses and this reward's token is not in the list
      if (
        tokenAddresses?.length > 0 &&
        !tokenAddresses.includes(
          chainData.rewards[0].token.address.toLowerCase(),
        )
      ) {
        return; // continue if defined token in MerklRewards doesn't match user's rewards token
      }

      chainData.rewards.forEach((reward) => {
        reward.breakdowns.forEach((breakdown) =>
          activeCampaigns.push(breakdown),
        );

        // Find matching token for icon
        const chainTokens = merklTokensByChain[reward.token.chainId.toString()];
        const matchingToken = chainTokens?.find(
          (token: MerklToken) =>
            token.address.toLowerCase() === reward.token.address.toLowerCase(),
        );

        // Process rewards
        rewardsToClaim.push({
          chainId: reward.token.chainId,
          address: reward.token.address,
          symbol: reward.token.symbol,
          accumulatedAmountForContractBN: reward.amount,
          amountToClaim: Number(
            (BigInt(reward.amount) - BigInt(reward.claimed)) /
              BigInt(10 ** reward.token.decimals),
          ),
          amountAccumulated: Number(
            BigInt(reward.amount) / BigInt(10 ** reward.token.decimals),
          ),
          proof: reward.proofs,
          explorerLink: chainData.chain.Explorer[0]?.url || '',
          chainLogo: chainData.chain.icon,
          tokenLogo: matchingToken?.icon || '',
          claimingAddress: MERKL_CLAIMING_ADDRESS,
          tokenDecimals: reward.token.decimals,
        });
      });
    });
  }

  return {
    isLoading: positionsIsLoading,
    isSuccess: positionsIsSuccess,
    activeCampaigns: activeCampaigns,
    availableRewards: rewardsToClaim,
    pastCampaigns: pastCampaigns,
  };
};
