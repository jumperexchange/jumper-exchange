import { describe, expect, it } from 'vitest';
import { EMPTY_HOLDINGS_FILTERING_PARAMS } from './constants';
import {
  extractHoldingsFilteringParams,
  filterSortPositionsData,
  getDefaultHoldingsMinValue,
  getEffectiveValueRange,
  isFullHoldingsValueRange,
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

const statsAboveOne = {
  ...EMPTY_HOLDINGS_FILTERING_PARAMS,
  allAssets: [{ symbol: 'ETH' } as never],
  allValueRange: { min: 0.00003492862, max: 5000 },
};

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

describe('getEffectiveValueRange', () => {
  it('uses a default min of 1 when any asset is above 1', () => {
    expect(getEffectiveValueRange({ min: 0.05, max: 100 })).toEqual({
      min: 1,
      max: 100,
    });
  });

  it('returns the portfolio range when all assets are below 1', () => {
    expect(getEffectiveValueRange({ min: 0.05, max: 0.85 })).toEqual({
      min: 0.05,
      max: 0.85,
    });
  });
});

describe('getDefaultHoldingsMinValue', () => {
  it('returns 1 when the portfolio max is at least 1', () => {
    expect(getDefaultHoldingsMinValue({ min: 0.05, max: 100 })).toBe(1);
  });

  it('returns undefined when all holdings are below 1', () => {
    expect(
      getDefaultHoldingsMinValue({ min: 0.05, max: 0.85 }),
    ).toBeUndefined();
  });
});

describe('isFullHoldingsValueRange', () => {
  it('treats an empty value filter as the full range', () => {
    expect(isFullHoldingsValueRange({}, statsAboveOne)).toBe(true);
  });

  it('treats explicit portfolio endpoints as the full range', () => {
    expect(
      isFullHoldingsValueRange(
        {
          minValue: statsAboveOne.allValueRange.min,
          maxValue: statsAboveOne.allValueRange.max,
        },
        statsAboveOne,
      ),
    ).toBe(true);
  });

  it('does not treat the default min filter as the full range', () => {
    expect(isFullHoldingsValueRange({ minValue: 1 }, statsAboveOne)).toBe(
      false,
    );
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

  it('does not re-apply the default min after the value range was cleared', () => {
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

  it('does not apply a default min when stats are still empty', () => {
    const stats = {
      ...EMPTY_HOLDINGS_FILTERING_PARAMS,
      allValueRange: { min: 0, max: 0 },
    };

    expect(
      resolveHoldingsFilter({}, stats, {
        hasExplicitValueRange: false,
        isAllBalancesDataLoading: false,
      }),
    ).toEqual({});
  });

  it('applies the default min while balances are loading once stats are available', () => {
    const stats = {
      ...EMPTY_HOLDINGS_FILTERING_PARAMS,
      allAssets: [{ symbol: 'ETH' } as never],
      allValueRange: { min: 0, max: 100 },
    };

    expect(
      resolveHoldingsFilter({}, stats, {
        hasExplicitValueRange: false,
        isAllBalancesDataLoading: true,
      }),
    ).toEqual({ minValue: 1 });
  });

  it('does not apply a default min when all holdings are below 1', () => {
    const stats = {
      ...EMPTY_HOLDINGS_FILTERING_PARAMS,
      allAssets: [{ symbol: 'ETH' } as never],
      allValueRange: { min: 0.05, max: 0.85 },
    };

    expect(
      resolveHoldingsFilter({}, stats, {
        hasExplicitValueRange: false,
        isAllBalancesDataLoading: false,
      }),
    ).toEqual({});
  });

  it('applies the default min alongside other filters when no explicit range exists', () => {
    const stats = {
      ...EMPTY_HOLDINGS_FILTERING_PARAMS,
      allAssets: [{ symbol: 'ETH' } as never],
      allValueRange: { min: 0, max: 100 },
    };

    expect(
      resolveHoldingsFilter({ chains: [1] }, stats, {
        hasExplicitValueRange: false,
        isAllBalancesDataLoading: false,
      }),
    ).toEqual({ chains: [1], minValue: 1 });
  });
});

describe('serializeHoldingsFilterForUrl', () => {
  it('persists the default min in the URL when it is applied', () => {
    expect(
      serializeHoldingsFilterForUrl(
        {
          minValue: 1,
          maxValue: 5000,
          wallets: [],
          chains: [1],
          assets: [],
        },
        statsAboveOne,
      ),
    ).toEqual({
      holdingsWallets: null,
      holdingsChains: [1],
      holdingsAssets: null,
      holdingsMinValue: 1,
      holdingsMaxValue: null,
    });
  });

  it('omits value params when the filter uses the full available range', () => {
    expect(serializeHoldingsFilterForUrl({}, statsAboveOne)).toEqual({
      holdingsWallets: null,
      holdingsChains: null,
      holdingsAssets: null,
      holdingsMinValue: null,
      holdingsMaxValue: null,
    });
  });

  it('persists an explicit max below the portfolio top', () => {
    expect(
      serializeHoldingsFilterForUrl({ maxValue: 100 }, statsAboveOne)
        .holdingsMaxValue,
    ).toBe(100);
  });

  it('persists an explicit min below the default threshold', () => {
    expect(
      serializeHoldingsFilterForUrl({ minValue: 0 }, statsAboveOne)
        .holdingsMinValue,
    ).toBe(0);
  });
});

describe('buildHoldingsFilterPatchFromPending', () => {
  it('does not include value params when only chains change at the default min', () => {
    expect(
      buildHoldingsFilterPatchFromPending(
        {
          wallets: [],
          chains: ['1'],
          assets: [],
          value: [1, 5000],
        },
        statsAboveOne,
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
        statsAboveOne,
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

  it('applies the default min after the slider was reset to the full range', () => {
    expect(
      buildHoldingsFilterPatchFromPending(
        {
          wallets: [],
          chains: [],
          assets: [],
          value: [1, 5000],
        },
        statsAboveOne,
        {},
      ),
    ).toEqual({
      wallets: null,
      chains: null,
      assets: null,
      minValue: 1,
    });
  });

  it('resets minValue when the slider returns to the default min from a higher value', () => {
    expect(
      buildHoldingsFilterPatchFromPending(
        {
          wallets: [],
          chains: [],
          assets: [],
          value: [1, 5000],
        },
        statsAboveOne,
        { minValue: 2 },
      ),
    ).toEqual({
      wallets: null,
      chains: null,
      assets: null,
      minValue: 1,
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
