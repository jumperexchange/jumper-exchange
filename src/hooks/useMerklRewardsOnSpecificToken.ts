'use client';
import { useQuery } from '@tanstack/react-query';

interface TokenData {
  accumulated: string;
  decimals: number;
  proof: string[];
  symbol: string;
  unclaimed: string;
}

interface TokenDataMap {
  [address: string]: TokenData;
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
  // activePosition?: any[];
}

export interface UseMerklRewardsProps {
  rewardChainId: number;
  userAddress?: string;
  rewardToken?: string;
}

const JUMPER_QUEST_ID = ['0x1C6A6Ee7D2e0aC0D2E3de4a69433553e0cb52777'];

const ACTIVE_CHAINS = ['10', '252', '8453', '34443'];

const MERKL_API = 'https://api.merkl.xyz/v3';

const CREATOR_TAG = 'jumper-test';

export const useMerklRewards = ({
  userAddress,
  rewardChainId,
  rewardToken,
}: UseMerklRewardsProps): UseMerklRes => {
  // state
  let userTVL = 0;
  let rewardsToClaim: AvailableRewards[] = [];
  const activeCampaigns = [];

  // Call to get the active positions
  // To do -> use the label to get only
  const MERKL_POSITIONS_API = `${MERKL_API}/multiChainPositions?chainIds=${ACTIVE_CHAINS.join(',')}&user=${userAddress}&creatorTag=${CREATOR_TAG}`;
  const {
    data: positionsData,
    isSuccess: positionsIsSuccess,
    isLoading: positionsIsLoading,
  } = useQuery({
    queryKey: ['MerklPositions'],

    queryFn: async () => {
      const response = await fetch(MERKL_POSITIONS_API, {});
      const result = await response.json();
      return result;
    },
    enabled: !!userAddress,
    refetchInterval: 1000 * 60 * 60,
  });

  // loop through the position and sum the TVL USD
  if (positionsData) {
    for (const chain of ACTIVE_CHAINS) {
      if (positionsData[chain]) {
        console.log(positionsData[chain]);
        for (const [key, data] of Object.entries(positionsData[chain])) {
          activeCampaigns.push(key);
          if (
            JUMPER_QUEST_ID.includes(key.split('_')[1]) &&
            (data as any)?.userTVL
          ) {
            userTVL += (data as any)?.userTVL;
          }
        }
      }
    }
  }
  console.log(activeCampaigns);

  // check the user positions for the interesting campaign
  const MERKL_REWARDS_API = `${MERKL_API}/rewards?chainIds=${rewardChainId}&user=${userAddress}`;
  const {
    data: rewardsData,
    isSuccess: rewardsIsSuccess,
    isLoading: rewardsIsLoading,
  } = useQuery({
    queryKey: ['MerklRewards'],

    queryFn: async () => {
      const response = await fetch(MERKL_REWARDS_API, {});
      const result = await response.json();
      return result;
    },
    enabled: !!userAddress,
    refetchInterval: 1000 * 60 * 60,
  });

  // transform to know what is not coming from Jumper campaigns
  if (rewardsData) {
    const tokenData = rewardsData[rewardChainId]?.tokenData;
    if (tokenData) {
      rewardsToClaim = Object.entries(tokenData).map(
        (elem): AvailableRewards => {
          console.log(elem);
          const key = elem[0];
          const value = elem[1] as TokenData;
          return {
            chainId: rewardChainId,
            address: key,
            symbol: value.symbol,
            accumulatedAmountForContractBN: value.accumulated,
            amountToClaim: (value.unclaimed as any) / 10 ** value.decimals,
            amountAccumulated: (value.unclaimed as any) / 10 ** value.decimals,
            proof: value.proof,
          };
        },
      );
    }
  }

  return {
    isLoading: positionsIsLoading && rewardsIsLoading,
    isSuccess: positionsIsSuccess && rewardsIsSuccess,
    userTVL: userTVL,
    activeCampaigns: activeCampaigns,
    availableRewards: rewardsToClaim,
    // activePosition: [],
  };
};
