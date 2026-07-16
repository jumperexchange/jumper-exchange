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
  HoldingsFilteringParams,
  HoldingsFilter,
  SortByEnum,
  OrderEnum,
} from './types';
import { OrderOptions, SortByOptions } from './types';
import {
  DEFAULT_MIN_VALUE,
  EMPTY_HOLDINGS_FILTERING_PARAMS,
} from './constants';
import type { PortfolioPosition } from '../types';
import type { BalancesMetadata, PositionsMetadata } from '../types';
import { balanceAccessors, positionAccessors } from '../utils';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';
import type { NullableFields } from '@/types/internal';

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

export const holdingsSearchParamsParsers = {
  holdingsSortBy: parseAsStringEnum(Object.values(SortByOptions)).withDefault(
    SortByOptions.VALUE,
  ),
  holdingsOrder: parseAsStringEnum(Object.values(OrderOptions)).withDefault(
    OrderOptions.DESC,
  ),
  holdingsWallets: parseAsArrayOf(parseAsString),
  holdingsChains: parseAsArrayOf(parseAsInteger),
  holdingsAssets: parseAsArrayOf(parseAsString),
  holdingsMinValue: parseAsFloat,
  holdingsMaxValue: parseAsFloat,
};

export const removeNullValuesFromFilter = <T>(filter: Nullable<T>): T => {
  return Object.fromEntries(
    Object.entries(filter).filter(([_, value]) => value !== null),
  ) as T;
};

export const sanitizeHoldingsFilter = (
  filter: HoldingsFilter,
  stats: HoldingsFilteringParams,
  shouldClampRangeFilter?: boolean,
  shouldSanitizeChainsAndWallets: boolean = true,
): Nullable<HoldingsFilter> => {
  const validWalletAddresses = new Set(stats.allWallets);
  const validChainIds = new Set(stats.allChains);
  const validAssets = new Set(stats.allAssets.map((asset) => asset.symbol));
  const { min: valueMin, max: valueMax } = stats.allValueRange;

  const sanitizeWallets =
    shouldSanitizeChainsAndWallets && stats.allWallets.length > 0;
  const sanitizeChains =
    shouldSanitizeChainsAndWallets && stats.allChains.length > 0;
  const sanitizeAssets = stats.allAssets.length > 0;

  if (
    !sanitizeWallets &&
    !sanitizeChains &&
    !sanitizeAssets &&
    !shouldClampRangeFilter
  ) {
    return filter;
  }

  return {
    ...filter,
    wallets: sanitizeWallets
      ? (filter.wallets?.filter((w) => validWalletAddresses.has(w)) ?? null)
      : filter.wallets,
    chains: sanitizeChains
      ? (filter.chains?.filter((id) => validChainIds.has(id)) ?? null)
      : filter.chains,
    assets: sanitizeAssets
      ? (filter.assets?.filter((a) => validAssets.has(a)) ?? null)
      : filter.assets,
    minValue:
      filter.minValue !== undefined
        ? shouldClampRangeFilter
          ? filter.minValue < valueMin
            ? filter.minValue
            : Math.max(Math.min(filter.minValue, valueMax), valueMin)
          : filter.minValue
        : filter.minValue,
    maxValue:
      filter.maxValue !== undefined
        ? shouldClampRangeFilter
          ? Math.max(Math.min(filter.maxValue, valueMax), valueMin)
          : filter.maxValue
        : filter.maxValue,
  };
};

export const filterSortBalancesData = (
  balancesByAddress: Record<
    string,
    Record<string, PortfolioBalance<WalletToken>[]>
  >,
  filter: HoldingsFilter,
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

export const getEffectiveValueRange = (
  allValueRange: { min: number; max: number },
  defaultMinValue: number = DEFAULT_MIN_VALUE,
) => {
  if (allValueRange.max < defaultMinValue) {
    return allValueRange;
  }

  return {
    min: defaultMinValue,
    max: allValueRange.max,
  };
};

export const getDefaultHoldingsMinValue = (allValueRange: {
  min: number;
  max: number;
}): number | undefined => {
  if (allValueRange.max < DEFAULT_MIN_VALUE) {
    return undefined;
  }

  return DEFAULT_MIN_VALUE;
};

export const isFullHoldingsValueRange = (
  filter: HoldingsFilter,
  stats: HoldingsFilteringParams,
): boolean => {
  const { min: rangeMin, max: rangeMax } = stats.allValueRange;

  if (filter.minValue === undefined && filter.maxValue === undefined) {
    return true;
  }

  const effectiveMin = filter.minValue ?? rangeMin;
  const effectiveMax = filter.maxValue ?? rangeMax;

  return effectiveMin === rangeMin && effectiveMax === rangeMax;
};

export interface ExtractHoldingsFilteringParamsInput {
  balancesIsEmpty: boolean;
  positionsIsEmpty: boolean;
  balancesMetadata: BalancesMetadata;
  positionsMetadata: PositionsMetadata;
}

export const extractHoldingsFilteringParams = ({
  balancesIsEmpty,
  positionsIsEmpty,
  balancesMetadata,
  positionsMetadata,
}: ExtractHoldingsFilteringParamsInput): HoldingsFilteringParams => {
  const bothEmpty = balancesIsEmpty && positionsIsEmpty;
  if (bothEmpty) {
    return EMPTY_HOLDINGS_FILTERING_PARAMS;
  }

  const mergedChains = Array.from(
    new Set([
      ...(balancesIsEmpty ? [] : balancesMetadata.chains),
      ...(positionsIsEmpty ? [] : positionsMetadata.chains),
    ]),
  );

  const assetsBySymbol = new Map<
    string,
    | (typeof balancesMetadata.assets)[number]
    | (typeof positionsMetadata.assets)[number]
  >();
  if (!positionsIsEmpty) {
    positionsMetadata.assets.forEach((asset) =>
      assetsBySymbol.set(asset.symbol, asset),
    );
  }
  if (!balancesIsEmpty) {
    balancesMetadata.assets.forEach((asset) =>
      assetsBySymbol.set(asset.symbol, asset),
    );
  }

  const balancesRange = balancesIsEmpty ? null : balancesMetadata.valueRange;
  const positionsRange = positionsIsEmpty ? null : positionsMetadata.valueRange;

  const allValueRange =
    balancesRange && positionsRange
      ? {
          min: Math.min(balancesRange.min, positionsRange.min),
          max: Math.max(balancesRange.max, positionsRange.max),
        }
      : (balancesRange ?? positionsRange ?? { min: 0, max: 0 });

  return {
    allWallets: balancesIsEmpty ? [] : balancesMetadata.wallets,
    allChains: mergedChains,
    allAssets: Array.from(assetsBySymbol.values()),
    allValueRange,
  };
};

export interface ResolveHoldingsFilterContext {
  hasExplicitValueRange: boolean;
  isAllBalancesDataLoading: boolean;
}

export const resolveHoldingsFilter = (
  filter: HoldingsFilter,
  stats: HoldingsFilteringParams,
  context: ResolveHoldingsFilterContext,
): HoldingsFilter => {
  const shouldClampRangeFilter =
    context.hasExplicitValueRange && !context.isAllBalancesDataLoading;
  const shouldSanitizeChainsAndWallets = !context.isAllBalancesDataLoading;

  const sanitized = sanitizeHoldingsFilter(
    filter,
    stats,
    shouldClampRangeFilter,
    shouldSanitizeChainsAndWallets,
  );

  const defaultMin = getDefaultHoldingsMinValue(stats.allValueRange);
  const shouldApplyDefaultMin =
    !context.hasExplicitValueRange &&
    defaultMin !== undefined &&
    stats.allValueRange.max > 0;

  const withDefaults = shouldApplyDefaultMin
    ? {
        ...sanitized,
        minValue: sanitized.minValue ?? defaultMin,
      }
    : sanitized;

  return removeNullValuesFromFilter<HoldingsFilter>(withDefaults);
};

export const serializeHoldingsFilterForUrl = (
  filter: HoldingsFilter,
  stats: HoldingsFilteringParams,
) => {
  const { min: rangeMin, max: rangeMax } = stats.allValueRange;
  const defaultMin = getDefaultHoldingsMinValue(stats.allValueRange);

  const holdingsMinValue = isFullHoldingsValueRange(filter, stats)
    ? null
    : filter.minValue !== undefined
      ? filter.minValue
      : defaultMin !== undefined
        ? defaultMin
        : null;

  const holdingsMaxValue =
    filter.maxValue !== undefined && filter.maxValue < rangeMax
      ? filter.maxValue
      : null;

  return {
    holdingsWallets: filter.wallets?.length ? filter.wallets : null,
    holdingsChains: filter.chains?.length ? filter.chains : null,
    holdingsAssets: filter.assets?.length ? filter.assets : null,
    holdingsMinValue,
    holdingsMaxValue,
  };
};

export const buildHoldingsFilterPatchFromPending = (
  values: {
    wallets: string[];
    chains: string[];
    assets: string[];
    value: number[];
  },
  stats: HoldingsFilteringParams,
  currentFilter: HoldingsFilter = {},
): NullableFields<HoldingsFilter> => {
  const pendingMin = values.value[0] ?? stats.allValueRange.min;
  const pendingMax = values.value[1] ?? stats.allValueRange.max;
  const { min: rangeMin, max: rangeMax } = stats.allValueRange;
  const defaultMin = getDefaultHoldingsMinValue(stats.allValueRange);
  const isFullValueRange = pendingMin === rangeMin && pendingMax === rangeMax;

  const patch: NullableFields<HoldingsFilter> = {
    wallets: values.wallets.length ? values.wallets : null,
    chains: values.chains.length ? values.chains.map(Number) : null,
    assets: values.assets.length ? values.assets : null,
  };

  if (isFullValueRange) {
    patch.minValue = null;
    patch.maxValue = null;
    return patch;
  }

  if (defaultMin !== undefined && pendingMin === defaultMin) {
    const wasAtFullRange = isFullHoldingsValueRange(currentFilter, stats);
    if (
      wasAtFullRange ||
      (currentFilter.minValue !== undefined &&
        currentFilter.minValue !== defaultMin)
    ) {
      patch.minValue = defaultMin;
    }
  } else {
    patch.minValue = pendingMin;
  }

  if (pendingMax !== rangeMax) {
    patch.maxValue = pendingMax;
  } else if (currentFilter.maxValue !== undefined) {
    patch.maxValue = null;
  }

  return patch;
};

const getPositionAssetSymbols = (position: PortfolioPosition): string[] => {
  const balances = [
    ...position.supplyTokens,
    ...position.borrowTokens,
    ...position.assetTokens,
    ...position.collateralTokens,
    ...position.rewardTokens,
    ...(position.lpToken ? [position.lpToken] : []),
  ];

  return balances.map((balance) => balance.token.symbol);
};

export const filterSortPositionsData = (
  positions: PortfolioPosition[],
  filter: HoldingsFilter,
  sortByValue: SortByEnum,
  order: OrderEnum,
): Record<string, PortfolioPosition[]> => {
  let result = [...positions];

  if (filter.wallets?.length) {
    const walletsToInclude = new Set(
      filter.wallets.map((wallet) => wallet.toLowerCase()),
    );
    result = result.filter((position) =>
      walletsToInclude.has(position.address.toLowerCase()),
    );
  }

  if (filter.chains?.length) {
    result = result.filter((position) => {
      const chainId = positionAccessors.chainId(position);
      return chainId !== undefined && filter.chains!.includes(chainId);
    });
  }

  if (filter.assets?.length) {
    result = result.filter((position) =>
      getPositionAssetSymbols(position).some((symbol) =>
        filter.assets!.includes(symbol),
      ),
    );
  }

  if (filter.minValue !== undefined || filter.maxValue !== undefined) {
    result = result.filter((position) => {
      return isWithinValueRange(
        sanitizeValue(position.netUsd),
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
