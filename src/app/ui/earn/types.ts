import type { Chain, Protocol, Token } from 'src/types/jumper-backend';

export const SortByOptions = {
  APY: 'apy',
  TVL: 'tvl',
} as const;

export type SortByEnum = (typeof SortByOptions)[keyof typeof SortByOptions];

export const OrderOptions = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type OrderEnum = (typeof OrderOptions)[keyof typeof OrderOptions];

export const RewardsAPYOptions = {
  WITH_REWARDS: 'withRewards',
} as const satisfies Record<string, string>;

export type RewardsAPYEnum =
  (typeof RewardsAPYOptions)[keyof typeof RewardsAPYOptions];

export interface EarnFilteringParams {
  allChains: Chain[];
  allProtocols: Protocol[];
  allAssets: Token[];
  allTags: string[];
  allAPY: Record<number, number>; // histogram of apy
  allTVL: Record<number, number>; // histogram of tvl
  allRewardsOptions: string[];
}

export interface EarnOpportunityFilterWithoutSortByAndOrder {
  chains?: number[];
  protocols?: string[];
  assets?: string[];
  tags?: string[];
  minAPY?: number;
  maxAPY?: number;
  minTVL?: number;
  maxTVL?: number;
  minRewardsAPY?: number;
  maxRewardsAPY?: number;
}

export type EarnOpportunityFilterUI =
  EarnOpportunityFilterWithoutSortByAndOrder & {
    sortBy?: SortByEnum;
    order?: OrderEnum;
    forYou?: boolean;
  };

export enum EarnFilterTab {
  FOR_YOU = 'foryou',
  ALL = 'all',
  YOUR_POSITIONS = 'yourpositions',
}
