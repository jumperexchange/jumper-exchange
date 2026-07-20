import { describe, expect, it } from 'vitest';
import { buildEarnSearchIndex } from './searchOpportunities';
import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';

const chain = (chainId: number, chainKey: string) => ({ chainId, chainKey });

const createOpportunity = (
  overrides: Partial<EarnOpportunityWithLatestAnalytics> & { slug: string },
): EarnOpportunityWithLatestAnalytics =>
  ({
    name: 'Steakhouse USDC',
    asset: { name: 'USDC', chain: chain(1, 'eth') },
    lpToken: { name: 'Steakhouse USDC', chain: chain(1, 'eth') },
    protocol: { name: 'Morpho', product: 'metamorpho' },
    ...overrides,
  }) as never as EarnOpportunityWithLatestAnalytics;

const noChainNames = () => undefined;

const opportunities: EarnOpportunityWithLatestAnalytics[] = [
  createOpportunity({
    slug: 'steakhouse-usdc',
    name: 'Steakhouse USDC',
    protocol: { name: 'Morpho', product: 'metamorpho' } as never,
    asset: { name: 'USDC', chain: chain(1, 'ethereum') } as never,
    lpToken: { name: 'Steakhouse USDC', chain: chain(1, 'ethereum') } as never,
  }),
  createOpportunity({
    slug: 'spark-susds',
    name: 'Spark sUSDS',
    protocol: { name: 'Spark' } as never,
    asset: { name: 'sUSDS', chain: chain(8453, 'base') } as never,
    lpToken: { name: 'Spark sUSDS', chain: chain(8453, 'base') } as never,
  }),
  createOpportunity({
    slug: 'aave-v3-eth',
    name: 'Aave v3 ETH',
    protocol: { name: 'Aave', product: 'aave-v3' } as never,
    asset: { name: 'ETH', chain: chain(42161, 'arbitrum') } as never,
    lpToken: { name: 'Aave v3 ETH', chain: chain(42161, 'arbitrum') } as never,
  }),
];

describe('buildEarnSearchIndex', () => {
  it('matches on pool name, case-insensitively', () => {
    const index = buildEarnSearchIndex(opportunities, noChainNames);
    expect(index.search('steakhouse')).toEqual(new Set(['steakhouse-usdc']));
    expect(index.search('STEAKHOUSE')).toEqual(new Set(['steakhouse-usdc']));
  });

  it('matches on partial/substring terms', () => {
    const index = buildEarnSearchIndex(opportunities, noChainNames);
    expect(index.search('steak')).toEqual(new Set(['steakhouse-usdc']));
    expect(index.search('hous')).toEqual(new Set(['steakhouse-usdc']));
  });

  it('matches on protocol name', () => {
    const index = buildEarnSearchIndex(opportunities, noChainNames);
    expect(index.search('morpho')).toEqual(new Set(['steakhouse-usdc']));
    expect(index.search('spark')).toEqual(new Set(['spark-susds']));
  });

  it('matches on chain, resolving display names via getChainById', () => {
    const getChainById = ((id: number) =>
      id === 8453 ? { name: 'Base' } : undefined) as never;
    const index = buildEarnSearchIndex(opportunities, getChainById);
    expect(index.search('base')).toEqual(new Set(['spark-susds']));
  });

  it('falls back to a capitalized chainKey when chain metadata is unavailable', () => {
    const index = buildEarnSearchIndex(opportunities, noChainNames);
    expect(index.search('arbitrum')).toEqual(new Set(['aave-v3-eth']));
  });

  it('combines multiple terms with AND semantics across fields', () => {
    const index = buildEarnSearchIndex(opportunities, noChainNames);
    expect(index.search('morpho usdc')).toEqual(new Set(['steakhouse-usdc']));
    expect(index.search('morpho base')).toEqual(new Set());
  });

  it('returns no matches for an unrelated query', () => {
    const index = buildEarnSearchIndex(opportunities, noChainNames);
    expect(index.search('nonexistent')).toEqual(new Set());
  });

  it('returns no matches for an empty/whitespace query', () => {
    const index = buildEarnSearchIndex(opportunities, noChainNames);
    expect(index.search('')).toEqual(new Set());
    expect(index.search('   ')).toEqual(new Set());
  });

  it('handles an empty opportunity list without throwing', () => {
    const index = buildEarnSearchIndex([], noChainNames);
    expect(index.search('anything')).toEqual(new Set());
  });
});
