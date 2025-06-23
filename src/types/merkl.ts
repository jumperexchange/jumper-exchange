import { type MerklApi } from '@merkl/api';
import { type MerklOpportunity } from 'src/app/lib/getMerklOpportunities';
import { QuestData } from './strapi';

export type MerklApi = typeof MerklApi;

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

export interface QuestDataExtended extends QuestData {
  opportunities?: MerklOpportunity[];
  maxApy?: number;
}
