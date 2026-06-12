export interface RewardFilterCriteria {
  chainId: number;
  tokenAddress?: string;
}

export interface BaseReward {
  chainId: number;
  address: string;
  symbol: string;
  amountToClaim: number;
  tokenDecimals: number;
  logoURI?: string;
}

export interface MerklReward extends BaseReward {
  proof: string[];
  claimingAddress: string;
  accumulatedAmountForContractBN: string;
  amountAccumulated: number;
}

export interface DeFiReacherReward extends BaseReward {
  campaignId: string;
  contractAddress: string;
}

export type MerklRewardItem = { type: 'merkl'; reward: MerklReward };
export type DeFiReacherRewardItem = {
  type: 'defi-reacher';
  reward: DeFiReacherReward;
};
export type RewardItem = MerklRewardItem | DeFiReacherRewardItem;
