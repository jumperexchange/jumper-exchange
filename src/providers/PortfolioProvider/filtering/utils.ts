import type { Nullable } from 'nuqs';
import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs';
import { sortBy, orderBy, groupBy, sumBy, minBy } from 'lodash';
import type {
  BalancesFilteringParams,
  BalancesFilter,
  PositionsFilteringParams,
  PositionsFilter,
  SortByEnum,
  OrderEnum,
} from './types';
import { OrderOptions, SortByOptions } from './types';
import { DEFAULT_POSITIONS_MIN_VALUE } from './constants';
import type { PortfolioPosition } from '../types';
import { balanceAccessors, positionAccessors } from '../utils';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';

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

export type BalanceGroup = [string, PortfolioBalance<WalletToken>[]];

export const balanceGroupSortAccessors: SortAccessors<BalanceGroup> = {
  [SortByOptions.VALUE]: ([, group]) =>
    sumBy(group, (b) => Number(balanceAccessors.amountUSD(b) ?? 0)),
  [SortByOptions.CHAIN]: ([, group]) => {
    const getKey = (b: PortfolioBalance<WalletToken>) =>
      balanceAccessors.chainKey(b) ?? '';
    return getKey(minBy(group, getKey) ?? group[0]);
  },
  [SortByOptions.ASSET]: ([symbol]) => symbol,
};

export type PositionGroup = [string, PortfolioPosition[]];

export const positionGroupSortAccessors: SortAccessors<PositionGroup> = {
  [SortByOptions.VALUE]: ([, group]) =>
    sumBy(group, (p) => Number(positionAccessors.netUsd(p) ?? 0)),
  [SortByOptions.CHAIN]: ([, group]) => {
    const getKey = (p: PortfolioPosition) =>
      positionAccessors.chainKey(p) ?? positionAccessors.appKey(p) ?? '';
    return getKey(minBy(group, getKey) ?? group[0]);
  },
  [SortByOptions.ASSET]: ([, group]) =>
    positionAccessors.protocol(group[0]) ?? '',
};

export const isWithinValueRange = (
  value: number,
  minValue?: number,
  maxValue?: number,
): boolean => {
  const meetsMin = minValue === undefined || value >= sanitizeValue(minValue);
  const meetsMax = maxValue === undefined || value <= sanitizeValue(maxValue);
  return meetsMin && meetsMax;
};

export const balancesSearchParamsParsers = {
  balancesSortBy: parseAsStringEnum(Object.values(SortByOptions)).withDefault(
    SortByOptions.VALUE,
  ),
  balancesOrder: parseAsStringEnum(Object.values(OrderOptions)).withDefault(
    OrderOptions.DESC,
  ),
  balancesWallets: parseAsArrayOf(parseAsString),
  balancesChains: parseAsArrayOf(parseAsInteger),
  balancesAssets: parseAsArrayOf(parseAsString),
  balancesMinValue: parseAsFloat,
  balancesMaxValue: parseAsFloat,
};

export const removeNullValuesFromFilter = <T>(filter: Nullable<T>): T => {
  return Object.fromEntries(
    Object.entries(filter).filter(([_, value]) => value !== null),
  ) as T;
};

export const sanitizeBalancesFilter = (
  filter: BalancesFilter,
  stats: BalancesFilteringParams,
  shouldClampRangeFilter?: boolean,
): Nullable<BalancesFilter> => {
  if (
    !stats.allWallets.length ||
    !stats.allChains.length ||
    !stats.allAssets.length
  ) {
    return filter;
  }

  const validWalletAddresses = new Set(stats.allWallets);
  const validChainIds = new Set(stats.allChains);
  const validAssets = new Set(stats.allAssets.map((asset) => asset.symbol));
  const { min: valueMin, max: valueMax } = stats.allValueRange;

  return {
    ...filter,
    wallets: filter.wallets?.filter((w) => validWalletAddresses.has(w)) ?? null,
    chains: filter.chains?.filter((id) => validChainIds.has(id)) ?? null,
    assets: filter.assets?.filter((a) => validAssets.has(a)) ?? null,
    minValue:
      filter.minValue !== undefined
        ? shouldClampRangeFilter
          ? Math.max(Math.min(filter.minValue, valueMax), valueMin)
          : filter.minValue
        : null,
    maxValue:
      filter.maxValue !== undefined
        ? shouldClampRangeFilter
          ? Math.max(Math.min(filter.maxValue, valueMax), valueMin)
          : filter.maxValue
        : null,
  };
};

export const filterSortBalancesData = (
  balancesByAddress: Record<
    string,
    Record<string, PortfolioBalance<WalletToken>[]>
  >,
  filter: BalancesFilter,
  sortByValue: SortByEnum,
  order: OrderEnum,
): Record<string, PortfolioBalance<WalletToken>[]> => {
  let allBalances: PortfolioBalance<WalletToken>[] = [];

  const walletsToInclude = filter.wallets?.length
    ? filter.wallets
    : Object.keys(balancesByAddress);

  walletsToInclude.forEach((wallet) => {
    const grouped = balancesByAddress[wallet];
    if (grouped) {
      const walletBalances = Object.values(grouped).flat();
      allBalances = [...allBalances, ...walletBalances];
    }
  });

  if (filter.chains?.length) {
    allBalances = allBalances.filter((balance) =>
      filter.chains!.includes(balance.token.chainId),
    );
  }

  if (filter.assets?.length) {
    allBalances = allBalances.filter((balance) =>
      filter.assets!.includes(balance.token.symbol),
    );
  }

  if (filter.minValue !== undefined || filter.maxValue !== undefined) {
    allBalances = allBalances.filter((balance) => {
      return isWithinValueRange(
        sanitizeValue(balance.amountUSD),
        filter.minValue,
        filter.maxValue,
      );
    });
  }

  const sortedByAmount = orderBy(
    allBalances,
    [balanceAccessors.amountUSD],
    ['desc'],
  );

  const groupedBySymbol = groupBy(sortedByAmount, balanceAccessors.symbol);

  const sortedGroups = sortPortfolioItems(
    Object.entries(groupedBySymbol),
    sortByValue,
    order,
    balanceGroupSortAccessors,
  );

  return Object.fromEntries(sortedGroups);
};

export const positionsSearchParamsParsers = {
  positionsSortBy: parseAsStringEnum(Object.values(SortByOptions)).withDefault(
    SortByOptions.VALUE,
  ),
  positionsOrder: parseAsStringEnum(Object.values(OrderOptions)).withDefault(
    OrderOptions.DESC,
  ),
  positionsChains: parseAsArrayOf(parseAsInteger),
  positionsProtocols: parseAsArrayOf(parseAsString),
  positionsTypes: parseAsArrayOf(parseAsString),
  positionsAssets: parseAsArrayOf(parseAsString),
  positionsMinValue: parseAsFloat,
  positionsMaxValue: parseAsFloat,
};

export const sanitizePositionsFilter = (
  filter: PositionsFilter,
  stats: PositionsFilteringParams,
): Nullable<PositionsFilter> => {
  if (
    !stats.allChains.length ||
    !stats.allProtocols.length ||
    !stats.allTypes.length ||
    !stats.allAssets.length
  ) {
    return filter;
  }

  const validChainIds = new Set(stats.allChains);
  const validProtocols = new Set(
    stats.allProtocols.map((protocol) => protocol.name),
  );
  const validTypes = new Set(stats.allTypes);
  const validAssets = new Set(stats.allAssets.map((asset) => asset.symbol));
  const { min: valueMin, max: valueMax } = stats.allValueRange;

  return {
    ...filter,
    chains: filter.chains?.filter((id) => validChainIds.has(id)) ?? null,
    protocols: filter.protocols?.filter((p) => validProtocols.has(p)) ?? null,
    types: filter.types?.filter((t) => validTypes.has(t)) ?? null,
    assets: filter.assets?.filter((a) => validAssets.has(a)) ?? null,
    minValue:
      filter.minValue !== undefined
        ? Math.max(Math.min(filter.minValue, valueMax), valueMin)
        : null,
    maxValue:
      filter.maxValue !== undefined
        ? Math.max(Math.min(filter.maxValue, valueMax), valueMin)
        : null,
  };
};

export const getEffectiveValueRange = (
  allValueRange: { min: number; max: number },
  defaultMinValue: number = DEFAULT_POSITIONS_MIN_VALUE,
) => {
  if (allValueRange.max < defaultMinValue) {
    return allValueRange;
  }

  return {
    min: Math.max(defaultMinValue, allValueRange.min),
    max: Math.max(defaultMinValue, allValueRange.max),
  };
};

export const filterSortPositionsData = (
  positions: PortfolioPosition[],
  filter: PositionsFilter,
  sortByValue: SortByEnum,
  order: OrderEnum,
): Record<string, PortfolioPosition[]> => {
  let result = [...positions];

  if (filter.minValue !== undefined || filter.maxValue !== undefined) {
    result = result.filter((position) => {
      const value = position.netUsd;
      return isWithinValueRange(
        sanitizeValue(value),
        filter.minValue,
        filter.maxValue,
      );
    });
  }

  if (sortByValue === SortByOptions.VALUE) {
    result = orderBy(result, [positionAccessors.netUsd], ['desc']);
  }

  const groupedByProtocolAndChain = groupBy(
    result,
    positionAccessors.protocolAndChain,
  );

  const sortedGroups = sortPortfolioItems(
    Object.entries(groupedByProtocolAndChain),
    sortByValue,
    order,
    positionGroupSortAccessors,
  );

  return Object.fromEntries(sortedGroups);
};
