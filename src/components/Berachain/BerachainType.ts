import type { Quest } from '@/types/loyaltyPass';
import type { QuestDetails } from '@/types/questDetails';

export interface BerachainIncentiveToken {
  id: string;
  chain_id: number;
  contract_address: string;
  name: string;
  symbol: string;
  image: string;
  decimals: number;
  source: string;
  search_id: string;
  type: string;
  raw_amount: string;
  token_amount: number;
  token_amount_usd: number;
  price: number;
  fdv: number;
  total_supply: number;
  annual_change_ratio: number;
  per_input_token: number;
  token_rate: number;
}

export interface ExtraRewards {
  type: string;
  included: boolean;
}

export interface QuestWithExtraRewards extends Quest {
  CustomInformation?: QuestDetails & {
    extraRewards?: ExtraRewards;
  };
}
