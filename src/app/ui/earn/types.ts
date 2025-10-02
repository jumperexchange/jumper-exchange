import { EarnOpportunityFilter } from 'src/app/lib/getOpportunitiesFiltered';
import { Chain, Protocol, Token } from 'src/types/jumper-backend';

// TODO: migrate to backend's typing
export enum SortByOptions {
  APY = 'apy',
  TVL = 'tvl',
}

export interface EarnFilteringParams {
  allChains: Chain[];
  allProtocols: Protocol[];
  allAssets: Token[];
  allTags: string[];
  allAPY: Record<number, number>; // histogram of apy
}

export interface EarnsPageSearchParams {
  forYou?: string;
  sortBy?: string;
  variant?: string;
  assets?: string;
  chains?: string;
  protocols?: string;
  tags?: string;
  apy?: string;
  tvl?: string;
}

export type FilterKey = keyof EarnOpportunityFilter;
