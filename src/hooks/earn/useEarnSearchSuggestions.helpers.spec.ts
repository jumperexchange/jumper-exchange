import { describe, expect, it } from 'vitest';
import {
  buildSelectedOptions,
  EarnSearchCategory,
  filterSearchOptions,
  getHiddenCountByCategory,
  partitionSelectedOptions,
  type EarnSearchOption,
} from './useEarnSearchSuggestions.helpers';

const options: EarnSearchOption[] = [
  {
    category: EarnSearchCategory.Pool,
    value: 'steakhouse-usdc',
    label: 'Steakhouse USDC',
  },
  {
    category: EarnSearchCategory.Pool,
    value: 'spark-susds',
    label: 'Spark sUSDS',
  },
  { category: EarnSearchCategory.Chain, value: '1', label: 'Ethereum' },
  { category: EarnSearchCategory.Chain, value: '8453', label: 'Base' },
  { category: EarnSearchCategory.Protocol, value: 'Morpho', label: 'Morpho' },
  { category: EarnSearchCategory.Protocol, value: 'Spark', label: 'Spark' },
];

describe('buildSelectedOptions', () => {
  it('resolves selected options from chains/protocols/pools in the filter', () => {
    const selected = buildSelectedOptions(options, {
      chains: [8453],
      protocols: ['Morpho'],
      pools: ['spark-susds'],
    });

    expect(selected).toEqual([
      {
        category: EarnSearchCategory.Pool,
        value: 'spark-susds',
        label: 'Spark sUSDS',
      },
      { category: EarnSearchCategory.Chain, value: '8453', label: 'Base' },
      {
        category: EarnSearchCategory.Protocol,
        value: 'Morpho',
        label: 'Morpho',
      },
    ]);
  });

  it('returns an empty array when the filter has no chains/protocols/pools', () => {
    expect(buildSelectedOptions(options, {})).toEqual([]);
  });
});

describe('partitionSelectedOptions', () => {
  it('splits a mixed selection into chains/protocols/pools', () => {
    const selected: EarnSearchOption[] = [
      { category: EarnSearchCategory.Chain, value: '8453', label: 'Base' },
      {
        category: EarnSearchCategory.Protocol,
        value: 'Morpho',
        label: 'Morpho',
      },
      {
        category: EarnSearchCategory.Pool,
        value: 'spark-susds',
        label: 'Spark sUSDS',
      },
    ];

    expect(partitionSelectedOptions(selected)).toEqual({
      chains: [8453],
      protocols: ['Morpho'],
      pools: ['spark-susds'],
      search: null,
    });
  });

  it('returns null for categories with no selection, to clear that filter dimension', () => {
    expect(partitionSelectedOptions([])).toEqual({
      chains: null,
      protocols: null,
      pools: null,
      search: null,
    });
  });

  it('clears categories omitted from a partial selection', () => {
    const selected: EarnSearchOption[] = [
      { category: EarnSearchCategory.Chain, value: '8453', label: 'Base' },
    ];

    expect(partitionSelectedOptions(selected)).toEqual({
      chains: [8453],
      protocols: null,
      pools: null,
      search: null,
    });
  });

  it('maps a free-solo string entry to the search term', () => {
    const selected: (EarnSearchOption | string)[] = [
      { category: EarnSearchCategory.Chain, value: '8453', label: 'Base' },
      'steak',
    ];

    expect(partitionSelectedOptions(selected)).toEqual({
      chains: [8453],
      protocols: null,
      pools: null,
      search: 'steak',
    });
  });

  it('keeps only the last string when more than one is present', () => {
    expect(partitionSelectedOptions(['steak', 'spark'])).toEqual({
      chains: null,
      protocols: null,
      pools: null,
      search: 'spark',
    });
  });

  it('trims the search term and treats a blank string as no search', () => {
    expect(partitionSelectedOptions(['  '])).toEqual({
      chains: null,
      protocols: null,
      pools: null,
      search: null,
    });
  });
});

describe('filterSearchOptions', () => {
  it('returns no options when the input is empty, so the popup stays closed', () => {
    expect(filterSearchOptions(options, '')).toEqual([]);
    expect(filterSearchOptions(options, '   ')).toEqual([]);
  });

  it('matches case-insensitively on substrings', () => {
    expect(filterSearchOptions(options, 'BASE')).toEqual([
      { category: EarnSearchCategory.Chain, value: '8453', label: 'Base' },
    ]);
  });

  it('ranks prefix matches before other substring matches within a category', () => {
    const withPrefixAndSubstring: EarnSearchOption[] = [
      {
        category: EarnSearchCategory.Protocol,
        value: 'MetaMorpho',
        label: 'MetaMorpho',
      },
      {
        category: EarnSearchCategory.Protocol,
        value: 'Morpho',
        label: 'Morpho',
      },
    ];

    expect(filterSearchOptions(withPrefixAndSubstring, 'morpho')).toEqual([
      {
        category: EarnSearchCategory.Protocol,
        value: 'Morpho',
        label: 'Morpho',
      },
      {
        category: EarnSearchCategory.Protocol,
        value: 'MetaMorpho',
        label: 'MetaMorpho',
      },
    ]);
  });

  it('keeps matches grouped by category in a fixed pool/chain/protocol order', () => {
    const mixed: EarnSearchOption[] = [
      { category: EarnSearchCategory.Protocol, value: 'Spark', label: 'Spark' },
      {
        category: EarnSearchCategory.Pool,
        value: 'spark-susds',
        label: 'Spark sUSDS',
      },
      { category: EarnSearchCategory.Chain, value: '8453', label: 'Sparkland' },
    ];

    expect(filterSearchOptions(mixed, 'spark').map((o) => o.category)).toEqual([
      EarnSearchCategory.Pool,
      EarnSearchCategory.Chain,
      EarnSearchCategory.Protocol,
    ]);
  });

  it('caps the number of matches per category', () => {
    const manyPools: EarnSearchOption[] = Array.from(
      { length: 10 },
      (_, i) => ({
        category: EarnSearchCategory.Pool,
        value: `pool-${i}`,
        label: `Pool ${i}`,
      }),
    );

    expect(filterSearchOptions(manyPools, 'pool')).toHaveLength(5);
  });

  it('returns no matches for an unrelated query', () => {
    expect(filterSearchOptions(options, 'nonexistent')).toEqual([]);
  });
});

describe('getHiddenCountByCategory', () => {
  it('reports zero hidden matches for every category when the input is empty', () => {
    expect(getHiddenCountByCategory(options, '')).toEqual({
      pool: 0,
      chain: 0,
      protocol: 0,
    });
  });

  it('counts matches beyond the per-category cap', () => {
    const manyPools: EarnSearchOption[] = Array.from(
      { length: 10 },
      (_, i) => ({
        category: EarnSearchCategory.Pool,
        value: `pool-${i}`,
        label: `Pool ${i}`,
      }),
    );

    expect(getHiddenCountByCategory(manyPools, 'pool')).toEqual({
      pool: 5,
      chain: 0,
      protocol: 0,
    });
  });

  it('reports zero hidden matches when a category is under the cap', () => {
    expect(getHiddenCountByCategory(options, 'e')).toEqual(
      expect.objectContaining({ chain: 0 }),
    );
  });
});
