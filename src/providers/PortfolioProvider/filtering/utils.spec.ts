import { describe, expect, it } from 'vitest';
import { EMPTY_HOLDINGS_FILTERING_PARAMS } from './constants';
import {
  extractHoldingsFilteringParams,
  filterSortPositionsData,
  resolveHoldingsFilter,
  sanitizeHoldingsFilter,
  serializeHoldingsFilterForUrl,
  buildHoldingsFilterPatchFromPending,
} from './utils';
import type { HoldingsFilter } from './types';
import { OrderOptions, SortByOptions } from './types';
import type { PortfolioPosition } from '../types';

const createPosition = (
  address: string,
  protocolName: string,
): PortfolioPosition =>
  ({
    address,
    netUsd: 10,
    protocol: { name: protocolName, logo: '' },
    source: 'chain',
    chain: { chainId: 1, chainKey: 'eth', name: 'Ethereum' },
    type: 'deposit',
    name: protocolName,
    assetUsd: 10,
    debtUsd: 0,
    supplyTokens: [],
    borrowTokens: [],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [],
  }) as PortfolioPosition;

describe('extractHoldingsFilteringParams', () => {
  it('returns empty params when both sources are empty', () => {
    expect(
      extractHoldingsFilteringParams({
        balancesIsEmpty: true,
        positionsIsEmpty: true,
        balancesMetadata: {
          wallets: [],
          chains: [],
          assets: [],
          valueRange: { min: 0, max: 0 },
        },
        positionsMetadata: {
          chains: [],
          protocols: [],
          types: [],
          assets: [],
          valueRange: { min: 0, max: 0 },
        },
      }),
    ).toEqual(EMPTY_HOLDINGS_FILTERING_PARAMS);
  });
});

describe('resolveHoldingsFilter', () => {
  it('applies the default min value when no explicit range preference exists', () => {
    const stats = {
      ...EMPTY_HOLDINGS_FILTERING_PARAMS,
      allAssets: [{ symbol: 'ETH' } as never],
      allValueRange: { min: 0, max: 100 },
    };

    expect(
      resolveHoldingsFilter({}, stats, {
        hasExplicitValueRange: false,
        isAllBalancesDataLoading: false,
      }),
    ).toEqual({ minValue: 1 });
  });

  it('preserves an explicit cleared value range', () => {
    const stats = {
      ...EMPTY_HOLDINGS_FILTERING_PARAMS,
      allAssets: [{ symbol: 'ETH' } as never],
      allValueRange: { min: 0, max: 100 },
    };

    expect(
      resolveHoldingsFilter({}, stats, {
        hasExplicitValueRange: true,
        isAllBalancesDataLoading: false,
      }),
    ).toEqual({});
  });
});

describe('serializeHoldingsFilterForUrl', () => {
  const stats = {
    ...EMPTY_HOLDINGS_FILTERING_PARAMS,
    allValueRange: { min: 0.00003492862, max: 5000 },
  };

  it('omits default min, portfolio max, and empty array params', () => {
    expect(
      serializeHoldingsFilterForUrl(
        {
          minValue: 1,
          maxValue: 5000,
          wallets: [],
          chains: [1],
          assets: [],
        },
        stats,
        false,
      ),
    ).toEqual({
      holdingsWallets: null,
      holdingsChains: [1],
      holdingsAssets: null,
      holdingsMinValue: null,
      holdingsMaxValue: null,
    });
  });

  it('persists an explicit max below the portfolio top', () => {
    expect(
      serializeHoldingsFilterForUrl({ maxValue: 100 }, stats, true)
        .holdingsMaxValue,
    ).toBe(100);
  });

  it('persists an explicit min opt-out at the portfolio floor', () => {
    expect(
      serializeHoldingsFilterForUrl({ minValue: 0 }, stats, true)
        .holdingsMinValue,
    ).toBe(0);
  });
});

describe('buildHoldingsFilterPatchFromPending', () => {
  const stats = {
    ...EMPTY_HOLDINGS_FILTERING_PARAMS,
    allValueRange: { min: 0.00003492862, max: 5000 },
  };

  it('does not include value params when only chains change at default slider', () => {
    expect(
      buildHoldingsFilterPatchFromPending(
        {
          wallets: [],
          chains: ['1'],
          assets: [],
          value: [1, 5000],
        },
        stats,
        { minValue: 1 },
      ),
    ).toEqual({
      wallets: null,
      chains: [1],
      assets: null,
    });
  });

  it('clears value params when the slider is reset to the full range', () => {
    expect(
      buildHoldingsFilterPatchFromPending(
        {
          wallets: [],
          chains: [],
          assets: [],
          value: [0.00003492862, 5000],
        },
        stats,
        { minValue: 1 },
      ),
    ).toEqual({
      wallets: null,
      chains: null,
      assets: null,
      minValue: null,
      maxValue: null,
    });
  });
});

describe('filterSortPositionsData', () => {
  it('filters positions by wallet address', () => {
    const positions = [
      createPosition('0xEVM', 'Aave'),
      createPosition('solana-phantom', 'Jupiter'),
    ];

    const result = filterSortPositionsData(
      positions,
      { wallets: ['solana-phantom'] },
      SortByOptions.VALUE,
      OrderOptions.DESC,
    );

    expect(Object.values(result).flat()).toHaveLength(1);
    expect(Object.values(result).flat()[0]?.address).toBe('solana-phantom');
  });
});

describe('sanitizeHoldingsFilter', () => {
  it('preserves chain filters when assets are loaded but chains are not yet available', () => {
    const filter: HoldingsFilter = { chains: [999] };
    const stats = {
      ...EMPTY_HOLDINGS_FILTERING_PARAMS,
      allAssets: [{ symbol: 'ETH' } as never],
    };

    expect(sanitizeHoldingsFilter(filter, stats).chains).toEqual([999]);
  });

  it('preserves chain filters while balances are still loading', () => {
    const filter: HoldingsFilter = { chains: [999] };
    const stats = {
      ...EMPTY_HOLDINGS_FILTERING_PARAMS,
      allChains: [1],
      allAssets: [{ symbol: 'ETH' } as never],
    };

    expect(sanitizeHoldingsFilter(filter, stats, false, false).chains).toEqual([
      999,
    ]);
  });

  it('removes invalid chain filters once chain stats are ready', () => {
    const filter: HoldingsFilter = { chains: [999, 1] };
    const stats = {
      ...EMPTY_HOLDINGS_FILTERING_PARAMS,
      allChains: [1, 137],
      allAssets: [{ symbol: 'ETH' } as never],
    };

    expect(sanitizeHoldingsFilter(filter, stats).chains).toEqual([1]);
  });

  it('preserves an explicit min below the portfolio minimum when clamping', () => {
    const filter: HoldingsFilter = { minValue: 0, maxValue: 100 };
    const stats = {
      ...EMPTY_HOLDINGS_FILTERING_PARAMS,
      allAssets: [{ symbol: 'ETH' } as never],
      allValueRange: { min: 1.5, max: 100 },
    };

    expect(sanitizeHoldingsFilter(filter, stats, true).minValue).toBe(0);
  });
});
