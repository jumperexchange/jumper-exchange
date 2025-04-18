'use client';
import { useQuery } from '@tanstack/react-query';
import { REWARDS_CHAIN_IDS } from 'src/const/partnerRewardsTheme';
import type { ClaimableRewards } from 'src/types/strapi';

interface TokenData {
  accumulated: string;
  decimals: number;
  proof: string[];
  symbol: string;
  unclaimed: string;
}
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
  decimalsToShow: number;
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
  userAddress?: string;
  rewardToken?: string;
  claimableTokens?: ClaimableRewards;
}

const ACTIVE_CHAINS = REWARDS_CHAIN_IDS;

const MERKL_API = 'https://api.merkl.xyz/v4';

// TESTING
// const TOKEN = '0x41A65AAE5d1C8437288d5a29B4D049897572758E';

export const useMerklUserRewards = ({
  userAddress,
}: UseMerklRewardsProps): UseMerklRes => {
  // state
  let userTVL = 0;
  let rewardsToClaim: AvailableRewards[] = [];
  const activeCampaigns = [] as string[];
  const pastCampaigns = [] as string[];
  // Call to get the active positions
  const MERKL_POSITIONS_API = `${MERKL_API}/users/${userAddress}/rewards?chainId=${ACTIVE_CHAINS.join(',')}`;
  const {
    data: userRewardsData,
    isSuccess: positionsIsSuccess,
    isLoading: positionsIsLoading,
  } = useQuery({
    queryKey: ['MerklPositions', userAddress],

    queryFn: async () => {
      const response = await fetch(MERKL_POSITIONS_API, {});
      const result = await response.json();
      return result as MerklPositionData;
    },
    enabled: !!userAddress,
    refetchInterval: 1000 * 60 * 60,
  });

  if (userRewardsData) {
    for (const chain of ACTIVE_CHAINS) {
      if (userRewardsData[chain]) {
        for (const [key, data] of Object.entries(userRewardsData[chain])) {
          activeCampaigns.push(key);
        }
      }
    }
  }

  return {
    isLoading: positionsIsLoading,
    isSuccess: positionsIsSuccess,
    userTVL: userTVL,
    activeCampaigns: activeCampaigns,
    availableRewards: rewardsToClaim,
    pastCampaigns: pastCampaigns,
    // activePosition: [],
  };
};
