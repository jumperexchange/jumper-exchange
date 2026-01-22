import type { Nullable } from 'nuqs';
import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs';
import { sortBy } from 'lodash';
import type { PortfolioTokenGroup } from '../types/tokens';
import type {
  PortfolioTokensFilteringParams,
  PortfolioTokensFilter,
  PortfolioDeFiPositionsFilteringParams,
  PortfolioDeFiPositionsFilter,
  SortByEnum,
  OrderEnum,
} from './types';
import { OrderOptions, SortByOptions } from './types';
import { DEFAULT_DEFI_POSITIONS_MIN_VALUE } from './constants';
import type { PortfolioDeFiPositionsGroup } from '../types/positions';

export type SortAccessors<T> = Partial<
  Record<SortByEnum, (item: T) => string | number>
>;

export const sanitizeValue = (value: number): number => {
  if (!isFinite(value)) {
    return value;
  }
  return Number(value.toFixed(2));
};

export const sortPortfolioItems = <T>(
  items: T[],
  sortByValue: SortByEnum,
  order: OrderEnum,
  accessors: SortAccessors<T>,
): T[] => {
  if (!accessors[sortByValue]) {
    return items;
  }

  const sorted = sortBy(items, accessors[sortByValue]);

  if (order === OrderOptions.DESC) {
    return sorted.reverse();
  }

  return sorted;
};

export const tokenSortAccessors: SortAccessors<PortfolioTokenGroup> = {
  [SortByOptions.VALUE]: (group) => group.amountUSD ?? 0,
  [SortByOptions.CHAIN]: (group) => group.main.chainKey ?? '',
  [SortByOptions.ASSET]: (group) => group.main.name ?? '',
};

const portfolioPositionSortAccessors: SortAccessors<PortfolioDeFiPositionsGroup> =
  {
    [SortByOptions.VALUE]: (group) => group.amountUSD,
    [SortByOptions.CHAIN]: (group) => group.main.chain.chainKey ?? '',
    [SortByOptions.ASSET]: (group) => group.main.protocol.name ?? '',
  };

export const isWithinValueRange = (
  value: number,
  minValue?: number,
  maxValue?: number,
): boolean => {
  const meetsMin = minValue === undefined || value >= minValue;
  const meetsMax = maxValue === undefined || value <= maxValue;
  return meetsMin && meetsMax;
};

export const tokensSearchParamsParsers = {
  tokensSortBy: parseAsStringEnum(Object.values(SortByOptions)).withDefault(
    SortByOptions.VALUE,
  ),
  tokensOrder: parseAsStringEnum(Object.values(OrderOptions)).withDefault(
    OrderOptions.DESC,
  ),
  tokensWallets: parseAsArrayOf(parseAsString),
  tokensChains: parseAsArrayOf(parseAsInteger),
  tokensAssets: parseAsArrayOf(parseAsString),
  tokensMinValue: parseAsFloat,
  tokensMaxValue: parseAsFloat,
};

export const removeNullValuesFromFilter = <T>(filter: Nullable<T>): T => {
  return Object.fromEntries(
    Object.entries(filter).filter(([_, value]) => value !== null),
  ) as T;
};

export const sanitizeTokensFilter = (
  filter: PortfolioTokensFilter,
  stats: PortfolioTokensFilteringParams,
): Nullable<PortfolioTokensFilter> => {
  if (
    !stats.allWallets.length ||
    !stats.allChains.length ||
    !stats.allAssets.length
  ) {
    return filter;
  }

  const validWalletAddresses = new Set(stats.allWallets.map((w) => w.address));
  const validChainIds = new Set(stats.allChains.map((c) => c.chainId));
  const validAssets = new Set(stats.allAssets.map((a) => a.address));
  const { min: valueMin, max: valueMax } = stats.allValueRange;

  return {
    ...filter,
    tokensWallets:
      filter.tokensWallets?.filter((w) => validWalletAddresses.has(w)) ?? null,
    tokensChains:
      filter.tokensChains?.filter((id) => validChainIds.has(id)) ?? null,
    tokensAssets:
      filter.tokensAssets?.filter((a) => validAssets.has(a)) ?? null,
    tokensMinValue:
      filter.tokensMinValue !== undefined
        ? Math.max(Math.min(filter.tokensMinValue, valueMax), valueMin)
        : null,
    tokensMaxValue:
      filter.tokensMaxValue !== undefined
        ? Math.max(Math.min(filter.tokensMaxValue, valueMax), valueMin)
        : null,
  };
};

export const filterSortPortfolioTokensData = (
  tokensByAddress: Record<string, PortfolioTokenGroup[]>,
  filter: PortfolioTokensFilter,
  sortByValue: SortByEnum,
  order: OrderEnum,
): PortfolioTokenGroup[] => {
  let allData: PortfolioTokenGroup[] = [];

  const walletsToInclude = filter.tokensWallets?.length
    ? filter.tokensWallets
    : Object.keys(tokensByAddress);

  walletsToInclude.forEach((wallet) => {
    const groups = tokensByAddress[wallet];
    if (groups) {
      allData = [...allData, ...groups];
    }
  });

  if (filter.tokensChains?.length) {
    allData = allData.filter((group) =>
      filter.tokensChains!.includes(group.main.chainId),
    );
  }

  if (filter.tokensAssets?.length) {
    allData = allData.filter((group) =>
      filter.tokensAssets!.includes(group.main.address),
    );
  }

  if (
    filter.tokensMinValue !== undefined ||
    filter.tokensMaxValue !== undefined
  ) {
    allData = allData.filter((group) => {
      const value = group.amountUSD ?? 0;
      return isWithinValueRange(
        sanitizeValue(value),
        filter.tokensMinValue,
        filter.tokensMaxValue,
      );
    });
  }

  allData = sortPortfolioItems(allData, sortByValue, order, tokenSortAccessors);

  return allData;
};

export const deFiPositionsSearchParamsParsers = {
  defiSortBy: parseAsStringEnum(Object.values(SortByOptions)).withDefault(
    SortByOptions.VALUE,
  ),
  defiOrder: parseAsStringEnum(Object.values(OrderOptions)).withDefault(
    OrderOptions.DESC,
  ),
  defiChains: parseAsArrayOf(parseAsInteger),
  defiProtocols: parseAsArrayOf(parseAsString),
  defiTypes: parseAsArrayOf(parseAsString),
  defiAssets: parseAsArrayOf(parseAsString),
  defiMinValue: parseAsFloat,
  defiMaxValue: parseAsFloat,
};

export const sanitizeDeFiPositionsFilter = (
  filter: PortfolioDeFiPositionsFilter,
  stats: PortfolioDeFiPositionsFilteringParams,
): Nullable<PortfolioDeFiPositionsFilter> => {
  if (
    !stats.allChains.length ||
    !stats.allProtocols.length ||
    !stats.allTypes.length ||
    !stats.allAssets.length
  ) {
    return filter;
  }

  const validChainIds = new Set(stats.allChains.map((c) => c.chainId));
  const validProtocols = new Set(stats.allProtocols.map((p) => p.name));
  const validTypes = new Set(stats.allTypes);
  const validAssets = new Set(stats.allAssets.map((a) => a.name));
  const { min: valueMin, max: valueMax } = stats.allValueRange;

  return {
    ...filter,
    defiChains:
      filter.defiChains?.filter((id) => validChainIds.has(id)) ?? null,
    defiProtocols:
      filter.defiProtocols?.filter((p) => validProtocols.has(p)) ?? null,
    defiTypes: filter.defiTypes?.filter((t) => validTypes.has(t)) ?? null,
    defiAssets: filter.defiAssets?.filter((a) => validAssets.has(a)) ?? null,
    defiMinValue:
      filter.defiMinValue !== undefined
        ? Math.max(Math.min(filter.defiMinValue, valueMax), valueMin)
        : null,
    defiMaxValue:
      filter.defiMaxValue !== undefined
        ? Math.max(Math.min(filter.defiMaxValue, valueMax), valueMin)
        : null,
  };
};

export const getEffectiveValueRange = (
  allValueRange: { min: number; max: number },
  defaultMinValue: number = DEFAULT_DEFI_POSITIONS_MIN_VALUE,
) => {
  if (allValueRange.max < defaultMinValue) {
    return allValueRange;
  }

  return {
    min: Math.max(defaultMinValue, allValueRange.min),
    max: Math.max(defaultMinValue, allValueRange.max),
  };
};

export const filterSortDeFiPositionsData = (
  groups: PortfolioDeFiPositionsGroup[],
  filter: PortfolioDeFiPositionsFilter,
  sortByValue: SortByEnum,
  order: OrderEnum,
): PortfolioDeFiPositionsGroup[] => {
  let result = [...groups];

  if (filter.defiMinValue !== undefined || filter.defiMaxValue !== undefined) {
    result = result.filter((group) => {
      const value = group.amountUSD || 0;
      return isWithinValueRange(
        sanitizeValue(value),
        filter.defiMinValue,
        filter.defiMaxValue,
      );
    });
  }

  if (sortByValue === SortByOptions.VALUE) {
    result = sortPortfolioItems(
      result,
      sortByValue,
      order,
      portfolioPositionSortAccessors,
    );
  }

  return result;
};
