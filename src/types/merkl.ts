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

export interface RewardBreakdown {
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
}

export interface AvailableRewardsExtended extends AvailableRewards {
  explorerLink: string;
  chainLogo: string;
  tokenLogo: string;
  claimingAddress: string;
  tokenDecimals: number;
}

export interface Token {
  id: string;
  name: string;
  chainId: number;
  address: string;
  decimals: number;
  icon: string;
  verified: boolean;
  isTest: boolean;
  isPoint: boolean;
  isPreTGE: boolean;
  isNative: boolean;
  price: number;
  symbol: string;
  displaySymbol?: string;
}

export interface Chain {
  id: number;
  name: string;
  icon: string;
  Explorer: Array<{
    id: string;
    type: string;
    url: string;
    chainId: number;
  }>;
}

export interface Protocol {
  id: string;
  tags: string[];
  name: string;
  description: string;
  url: string;
  icon: string;
}

export interface Breakdown {
  distributionType: string;
  identifier: string;
  type: string;
  value: number;
}

export interface AprRecord {
  cumulated: number;
  timestamp: string;
  breakdowns: Breakdown[];
}

export interface TvlRecord {
  id: string;
  total: number;
  timestamp: string;
  breakdowns: Array<{
    identifier: string;
    type: string;
    value: number;
  }>;
}

export interface RewardToken extends Token {
  displaySymbol: string;
}

export interface RewardBreakdown {
  token: RewardToken;
  amount: string;
  value: number;
  distributionType: string;
  id: string;
  campaignId: string;
  dailyRewardsRecordId: string;
}

export interface RewardsRecord {
  id: string;
  total: number;
  timestamp: string;
  breakdowns: RewardBreakdown[];
}

export interface MerklOpportunity {
  // Core properties
  chainId: number;
  type: string;
  identifier: string;
  name: string;
  description: string;
  howToSteps: string[];
  status: string;
  action: string;
  tvl: number;
  apr: number;
  dailyRewards: number;
  tags: string[];
  id: string;
  depositUrl: string;
  explorerAddress: string;
  lastCampaignCreatedAt: string;
  tokens: Token[];
  chain: Chain;
  protocol: Protocol;
  aprRecord: AprRecord;
  tvlRecord: TvlRecord;
  rewardsRecord: RewardsRecord;

  // UI related properties
  logo: string;
  text: string;
  link: string;
  claimingId: string;
  rewardId?: string;
  apy: number;
  weeklyApy?: string;
}

export interface TokenData {
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

export type TaskOpportunities = Record<string, MerklOpportunity[]>;
