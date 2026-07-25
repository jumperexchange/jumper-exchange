import { describe, expect, it } from 'vitest';
import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';
import {
  extractFilteringParams,
  filterOpportunities,
  sanitizeFilter,
} from './filterOpportunities';
import type { EarnFilteringParams } from './types';

const createOpportunity = (
  overrides: Partial<EarnOpportunityWithLatestAnalytics> = {},
): EarnOpportunityWithLatestAnalytics =>
  ({
    name: 'Opportunity',
    asset: {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address: '0x0',
      chain: { chainId: 1, chainKey: 'eth' },
    },
    protocol: { name: 'aave' },
    isRedeemable: true,
    description: '',
    tags: [],
    rewards: [],
    messages: [],
    lpToken: {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address: '0x0',
      chain: { chainId: 1, chainKey: 'eth' },
    },
    slug: 'opportunity',
    featured: false,
    forYou: false,
    interactionFlags: {
      canBorrow: false,
      canDeposit: true,
      canRepay: false,
      canRewardClaim: false,
      canRewardCompound: false,
      canWithdraw: true,
    },
    latest: {
      date: '2026-01-01T00:00:00.000Z',
      tvlUsd: '100',
      tvlNative: '100',
      apy: { base: 0.05, reward: 0, intrinsic: 0 },
    },
    ...overrides,
  }) as EarnOpportunityWithLatestAnalytics;

describe('filterOpportunities', () => {
  it('matches USDC across differing per-chain asset names by symbol', () => {
    const data = [
      createOpportunity({
        slug: 'usdc-ethereum',
        asset: {
          name: 'USD Coin',
          symbol: 'USDC',
          decimals: 6,
          address: '0x1',
          chain: { chainId: 1, chainKey: 'eth' },
        },
      }),
      createOpportunity({
        slug: 'usdc-hyperevm',
        asset: {
          name: 'USDC',
          symbol: 'USDC',
          decimals: 6,
          address: '0x2',
          chain: { chainId: 999, chainKey: 'hyperevm' },
        },
      }),
      createOpportunity({
        slug: 'weth-ethereum',
        asset: {
          name: 'Wrapped Ether',
          symbol: 'WETH',
          decimals: 18,
          address: '0x3',
          chain: { chainId: 1, chainKey: 'eth' },
        },
      }),
    ];

    const filtered = filterOpportunities(data, { assets: ['USDC'] });

    expect(filtered.map((item) => item.slug)).toEqual([
      'usdc-ethereum',
      'usdc-hyperevm',
    ]);
  });
});

describe('extractFilteringParams', () => {
  it('dedupes assets by symbol instead of per-chain name', () => {
    const data = [
      createOpportunity({
        asset: {
          name: 'USD Coin',
          symbol: 'USDC',
          decimals: 6,
          address: '0x1',
          chain: { chainId: 1, chainKey: 'eth' },
        },
      }),
      createOpportunity({
        asset: {
          name: 'USDC',
          symbol: 'USDC',
          decimals: 6,
          address: '0x2',
          chain: { chainId: 999, chainKey: 'hyperevm' },
        },
      }),
    ];

    const { allAssets } = extractFilteringParams(data);

    expect(allAssets).toHaveLength(1);
    expect(allAssets[0].symbol).toBe('USDC');
  });

  it('picks the most common name for a symbol across chains', () => {
    const data = [
      createOpportunity({
        asset: {
          name: 'USD Coin',
          symbol: 'USDC',
          decimals: 6,
          address: '0x1',
          chain: { chainId: 1, chainKey: 'eth' },
        },
      }),
      createOpportunity({
        asset: {
          name: 'USD Coin',
          symbol: 'USDC',
          decimals: 6,
          address: '0x2',
          chain: { chainId: 8453, chainKey: 'base' },
        },
      }),
      createOpportunity({
        asset: {
          name: 'USDC',
          symbol: 'USDC',
          decimals: 6,
          address: '0x3',
          chain: { chainId: 999, chainKey: 'hyperevm' },
        },
      }),
    ];

    const { allAssets } = extractFilteringParams(data);

    expect(allAssets).toHaveLength(1);
    expect(allAssets[0].name).toBe('USD Coin');
  });
});

describe('sanitizeFilter', () => {
  it('keeps asset filter values that match a known symbol', () => {
    const stats: EarnFilteringParams = {
      allChains: [{ chainId: 1, chainKey: 'eth' }],
      allProtocols: [{ name: 'aave' }],
      allAssets: [
        {
          name: 'USD Coin',
          symbol: 'USDC',
          decimals: 6,
          address: '0x1',
          chain: { chainId: 1, chainKey: 'eth' },
        },
      ],
      allTags: ['stable'],
      allAPY: {},
      allTVL: {},
      allRewardsOptions: [],
    };

    const sanitized = sanitizeFilter({ assets: ['USDC', 'UNKNOWN'] }, stats);

    expect(sanitized.assets).toEqual(['USDC']);
  });
});
