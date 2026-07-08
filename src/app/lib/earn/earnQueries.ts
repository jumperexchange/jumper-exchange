import type { EarnOpportunityFilter } from '@/app/lib/getOpportunitiesFiltered';
import { getOpportunitiesFiltered } from '@/app/lib/getOpportunitiesFiltered';
import { getOpportunityBySlug } from '@/app/lib/getOpportunityBySlug';
import { getOpportunityRelatedMarket } from '@/app/lib/getOpportunityRelatedMarket';
import { getOpportunitiesTop } from '@/app/lib/getOpportunitiesTop';
import type { Hex } from 'viem';

export const earnFilterOpportunitiesQueryKey = (
  filter: EarnOpportunityFilter,
) => ['earn-filter-opportunities', filter] as const;

export const earnOpportunityBySlugQueryKey = (slug: string) =>
  ['earn-opportunity-by-slug', slug] as const;

export const earnRelatedMarketsQueryKey = (slug: string) =>
  ['earn-related-markets', slug] as const;

export const earnTopOpportunitiesQueryKey = (address?: Hex) =>
  ['earn-top-opportunities', address] as const;

export const fetchEarnFilterOpportunities = (filter: EarnOpportunityFilter) =>
  getOpportunitiesFiltered(filter);

export const fetchEarnOpportunityBySlug = async (slug: string) => {
  const result = await getOpportunityBySlug(slug);
  return result.data;
};

export const fetchEarnRelatedMarkets = async (slug: string) => {
  const result = await getOpportunityRelatedMarket(slug);
  return result.data;
};

export const fetchEarnTopOpportunities = async (address?: Hex) => {
  const result = await getOpportunitiesTop(address);
  if (!result.ok) {
    throw result.error;
  }
  return result.data.data;
};
