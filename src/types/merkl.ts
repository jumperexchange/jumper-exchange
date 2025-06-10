import { type MerklApi } from '@merkl/api';
import { type MerklOpportunity } from 'src/app/lib/getMerklOpportunities';
import { TaskVerification } from './loyaltyPass';
import { QuestData } from './strapi';

export type MerklApi = typeof MerklApi;

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
  price: number;
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

export interface TaskVerificationExtended extends TaskVerification {
  opportunity?: MerklOpportunity;
}

export interface QuestDataExtended extends QuestData {
  opportunities?: MerklOpportunity[];
  maxApy?: number;
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
