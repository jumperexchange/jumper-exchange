import type { Nullable } from 'nuqs';
import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs';
import { sortBy } from 'lodash';
import type { PortfolioToken } from '../types/tokens.types';
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
import type { PortfolioPosition } from '../types/positions.types';

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

export const tokenSortAccessors: SortAccessors<PortfolioToken> = {
  [SortByOptions.VALUE]: (token) => token.amountUSD ?? 0,
  [SortByOptions.CHAIN]: (token) => token.chain.chainKey ?? '',
  [SortByOptions.ASSET]: (token) => token.name ?? '',
};

const portfolioPositionSortAccessors: SortAccessors<PortfolioPosition> = {
  [SortByOptions.VALUE]: (position) => position.totalNetUsd,
  [SortByOptions.CHAIN]: (position) => position.chain.chainKey ?? '',
  [SortByOptions.ASSET]: (position) => position.protocol.name ?? '',
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
  tokensByAddress: Record<string, PortfolioToken[]>,
  filter: PortfolioTokensFilter,
  sortByValue: SortByEnum,
  order: OrderEnum,
): PortfolioToken[] => {
  let allData: PortfolioToken[] = [];

  const walletsToInclude = filter.tokensWallets?.length
    ? filter.tokensWallets
    : Object.keys(tokensByAddress);

  walletsToInclude.forEach((wallet) => {
    const tokens = tokensByAddress[wallet];
    if (tokens) {
      allData = [...allData, ...tokens];
    }
  });

  if (filter.tokensChains?.length) {
    allData = allData.filter(
      (token) =>
        filter.tokensChains!.includes(token.chain.chainId) ||
        token.relatedTokens?.some((rt) =>
          filter.tokensChains!.includes(rt.chain.chainId),
        ),
    );
  }

  if (filter.tokensAssets?.length) {
    allData = allData.filter((token) =>
      filter.tokensAssets!.includes(token.address),
    );
  }

  if (
    filter.tokensMinValue !== undefined ||
    filter.tokensMaxValue !== undefined
  ) {
    allData = allData.filter((token) => {
      const value = token.amountUSD ?? 0;
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
  positions: PortfolioPosition[],
  filter: PortfolioDeFiPositionsFilter,
  sortByValue: SortByEnum,
  order: OrderEnum,
): PortfolioPosition[] => {
  let result = [...positions];

  if (filter.defiMinValue !== undefined || filter.defiMaxValue !== undefined) {
    result = result.filter((position) => {
      const value = position.totalNetUsd || 0;
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
