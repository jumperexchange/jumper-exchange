import { describe, expect, it } from 'vitest';
import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';
import { filterOpportunities } from './filterOpportunities';
import type { EarnOpportunityFilterWithoutSortByAndOrder } from './types';

const createOpportunity = (
  overrides: Partial<EarnOpportunityWithLatestAnalytics> & {
    name: string;
    slug: string;
  },
): EarnOpportunityWithLatestAnalytics =>
  ({
    asset: { name: 'USDC', chain: { chainId: 1, chainKey: 'ethereum' } },
    protocol: { name: 'Morpho' },
    tags: [],
    lpToken: { chain: { chainId: 1, chainKey: 'ethereum' } },
    latest: { apy: { total: 0.05 }, tvlUsd: '1000' },
    ...overrides,
  }) as EarnOpportunityWithLatestAnalytics;

const opportunities: EarnOpportunityWithLatestAnalytics[] = [
  createOpportunity({ name: 'Steakhouse USDC', slug: 'steakhouse-usdc' }),
  createOpportunity({ name: 'Spark sUSDS', slug: 'spark-susds' }),
];

describe('filterOpportunities - search', () => {
  it('matches by pool name, case-insensitively', () => {
    const filter: EarnOpportunityFilterWithoutSortByAndOrder = {
      search: 'STEAK',
    };

    expect(
      filterOpportunities(opportunities, filter).map((o) => o.slug),
    ).toEqual(['steakhouse-usdc']);
  });

  it('stacks (AND) with structured filters', () => {
    const matchingBoth: EarnOpportunityFilterWithoutSortByAndOrder = {
      search: 'spark',
      pools: ['spark-susds'],
    };

    expect(
      filterOpportunities(opportunities, matchingBoth).map((o) => o.slug),
    ).toEqual(['spark-susds']);

    const matchingNeither: EarnOpportunityFilterWithoutSortByAndOrder = {
      search: 'steak',
      pools: ['spark-susds'],
    };

    expect(filterOpportunities(opportunities, matchingNeither)).toEqual([]);
  });

  it('leaves results unchanged when no search term is set', () => {
    const filter: EarnOpportunityFilterWithoutSortByAndOrder = {};

    expect(filterOpportunities(opportunities, filter)).toEqual(opportunities);
  });
});
