import { EarnOpportunityFilter } from 'src/app/lib/getOpportunitiesFiltered';
import { Chain, Protocol, Token } from 'src/types/jumper-backend';

type SortByType = NonNullable<NonNullable<EarnOpportunityFilter>['sortBy']>;

export const SortByOptions = {
  APY: 'apy',
  TVL: 'tvl',
} as const satisfies Record<string, SortByType>;

export type SortByEnum = (typeof SortByOptions)[keyof typeof SortByOptions];

type OrderType = NonNullable<NonNullable<EarnOpportunityFilter>['order']>;

export const OrderOptions = {
  ASC: 'asc',
  DESC: 'desc',
} as const satisfies Record<string, OrderType>;

export type OrderEnum = (typeof OrderOptions)[keyof typeof OrderOptions];

export interface EarnFilteringParams {
  allChains: Chain[];
  allProtocols: Protocol[];
  allAssets: Token[];
  allTags: string[];
  allAPY: Record<number, number>; // histogram of apy
}

export type EarnOpportunityFilterWithoutSortByAndOrder = Omit<
  NonNullable<EarnOpportunityFilter>,
  'sortBy' | 'order'
>;

export type EarnOpportunityFilterUI =
  EarnOpportunityFilterWithoutSortByAndOrder & {
    sortBy?: SortByEnum;
    order?: OrderEnum;
    forYou?: boolean;
  };
