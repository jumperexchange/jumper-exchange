export interface MerklToken {
  id: string;
  name: string;
  chainId: number;
  address: string;
  decimals: number;
  symbol: string;
  displaySymbol: string;
  icon: string;
  verified: boolean;
  isTest: boolean;
  isPoint: boolean;
  isPreTGE: boolean;
  isNative: boolean;
  price: number | null;
  minimumAmountPerHour: string;
}
export interface ChainInfo {
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

export interface Reward {
  root: string;
  recipient: string;
  amount: string;
  claimed: string;
  pending: string;
  proofs: string[];
  token: TokenInfo;
  breakdowns: RewardBreakdown[];
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
