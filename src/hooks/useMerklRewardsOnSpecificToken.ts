'use client';
import { useQuery } from '@tanstack/react-query';
import {
  MERKL_CREATOR_TAG,
  REWARDS_CHAIN_IDS,
} from 'src/const/partnerRewardsTheme';
import { TokenData } from 'src/types/merkl';

interface UserPosition {
  balance: number;
  token: string;
  origin: string;
  totalSupply: number;
  tvl: number;
}

interface TokenDataPosition {
  userPositions: UserPosition[];
  symbol?: string;
  decimals: number;
  token: string;
  userTVL: number;
  totalSupply?: number;
  tvl?: number;
}

interface MerklPositionData {
  [key: string]: {
    [key: string]: TokenDataPosition;
  };
}

interface AvailableRewards {
  chainId: number;
  address: string;
  symbol: string;
  accumulatedAmountForContractBN: string;
  amountToClaim: number;
  amountAccumulated: number;
  proof: string[];
}

export interface UseMerklRes {
  isSuccess: boolean;
  isLoading: boolean;
  userTVL: number;
  activeCampaigns: string[];
  availableRewards: AvailableRewards[];
  pastCampaigns: string[];
  // activePosition?: {}[];
}

export interface UseMerklRewardsProps {
  rewardChainId: number;
  userAddress?: string;
  rewardToken?: string;
}

const ACTIVE_CHAINS = REWARDS_CHAIN_IDS;
const CREATOR_TAG = MERKL_CREATOR_TAG;

const MERKL_API = 'https://api.merkl.xyz/v3';
const CACHE_TIME = 1000 * 60 * 60; // 1 hour
const STALE_TIME = 1000 * 60 * 5; // 5 minutes

// TESTING
// const TOKEN = '0x41A65AAE5d1C8437288d5a29B4D049897572758E';

export const useMerklRewardsOnSpecificToken = ({
  userAddress,
  rewardChainId,
  rewardToken,
}: UseMerklRewardsProps): UseMerklRes => {
  // state
  let userTVL = 0;
  let rewardsToClaim: AvailableRewards[] = [];
  const activeCampaigns = [] as string[];
  const pastCampaigns = [] as string[];

  // Call to get the active positions
  // To do -> use the label to get only
  const MERKL_POSITIONS_API = `${MERKL_API}/multiChainPositions?chainIds=${ACTIVE_CHAINS.join(',')}&user=${userAddress}&creatorTag=${CREATOR_TAG}`;
  const {
    data: positionsData,
    isSuccess: positionsIsSuccess,
    isLoading: positionsIsLoading,
  } = useQuery({
    queryKey: ['MerklPositions', userAddress, ACTIVE_CHAINS.join(',')],
    queryFn: async () => {
      const response = await fetch(MERKL_POSITIONS_API, {
        next: {
          revalidate: 3600, // Revalidate every hour
          tags: ['merkl-positions', `merkl-positions-${userAddress}`], // Tag for manual revalidation
        },
      });
      if (!response.ok) {
        throw new Error(`Merkl API error: ${response.status}`);
      }
      const result = await response.json();
      return result as MerklPositionData;
    },
    enabled: !!userAddress,
    refetchInterval: CACHE_TIME, // Refetch every hour
    staleTime: STALE_TIME, // Consider data stale after 5 minutes
    gcTime: CACHE_TIME, // Keep data in cache for 1 hour
  });

  // loop through the chains and positions
  if (positionsData) {
    for (const chain of ACTIVE_CHAINS) {
      if (positionsData[chain]) {
        for (const [key, data] of Object.entries(positionsData[chain])) {
          activeCampaigns.push(key);
        }
      }
    }
  }

  // check the user positions for the interesting campaign
  const MERKL_REWARDS_API = `${MERKL_API}/rewards?chainIds=${rewardChainId}&user=${userAddress}`;
  const {
    data: rewardsData,
    isSuccess: rewardsIsSuccess,
    isLoading: rewardsIsLoading,
  } = useQuery({
    queryKey: ['MerklRewards', userAddress, rewardChainId],
    queryFn: async () => {
      const response = await fetch(MERKL_REWARDS_API, {
        next: {
          revalidate: 3600, // Revalidate every hour
          tags: [
            'merkl-rewards',
            `merkl-rewards-${userAddress}-${rewardChainId}`,
          ], // Tag for manual revalidation
        },
      });
      if (!response.ok) {
        throw new Error(`Merkl API error: ${response.status}`);
      }
      const result = await response.json();
      return result;
    },
    enabled: !!userAddress,
    refetchInterval: CACHE_TIME, // Refetch every hour
    staleTime: STALE_TIME, // Consider data stale after 5 minutes
    gcTime: CACHE_TIME, // Keep data in cache for 1 hour
  });

  // transform to know what is not coming from Jumper campaigns
  if (rewardsData) {
    const tokenData = rewardsData?.[rewardChainId]?.tokenData;
    if (tokenData) {
      rewardsToClaim = Object.entries<TokenData>(tokenData)
        .map(([key, value]): AvailableRewards => {
          return {
            chainId: rewardChainId,
            address: key,
            symbol: value.symbol,
            accumulatedAmountForContractBN: value.accumulated,
            amountToClaim: (value.unclaimed as any) / 10 ** value.decimals, //todo: need to be typed with big int
            amountAccumulated: (value.unclaimed as any) / 10 ** value.decimals, //todo: need to be typed with big int
            proof: value.proof,
          };
        })
        .filter(
          (elem) =>
            elem.address.toLowerCase() === String(rewardToken).toLowerCase(),
        );
    }

    for (const chain of ACTIVE_CHAINS) {
      const campaignData = rewardsData[chain]?.campaignData;
      if (campaignData) {
        for (const [key, _] of Object.entries(campaignData)) {
          pastCampaigns.push(key);
        }
      }
    }
  }

  return {
    isLoading: positionsIsLoading && rewardsIsLoading,
    isSuccess: positionsIsSuccess && rewardsIsSuccess,
    userTVL: userTVL,
    activeCampaigns: activeCampaigns,
    availableRewards: rewardsToClaim,
    pastCampaigns: pastCampaigns,
    // activePosition: [],
  };
};
