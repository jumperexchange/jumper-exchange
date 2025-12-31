import type { Nullable } from 'nuqs';
import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs';
import { map, uniq, uniqBy, flatMap, min, max, sortBy, sumBy } from 'lodash';
import type { CacheToken } from 'src/types/portfolio';
import type {
  PortfolioTokensFilteringParams,
  PortfolioTokensFilter,
  PortfolioDeFiPositionsFilteringParams,
  PortfolioDeFiPositionsFilter,
  SortByEnum,
  OrderEnum,
} from './types';
import type { Account } from '@lifi/wallet-management';
import type { DefiPosition, WalletPositions } from '@/types/jumper-backend';
import { OrderOptions, SortByOptions } from './types';
import { DEFAULT_DEFI_POSITIONS_MIN_VALUE } from './constants';

export type SortAccessors<T> = Record<SortByEnum, (item: T) => string | number>;

export const sortPortfolioItems = <T>(
  items: T[],
  sortByValue: SortByEnum,
  order: OrderEnum,
  accessors: SortAccessors<T>,
): T[] => {
  const sorted = sortBy(items, accessors[sortByValue]);

  if (order === OrderOptions.DESC) {
    return sorted.reverse();
  }

  return sorted;
};

export const tokenSortAccessors: SortAccessors<CacheToken> = {
  [SortByOptions.VALUE]: (token) =>
    token.cumulatedTotalUSD ?? token.totalPriceUSD ?? 0,
  [SortByOptions.CHAIN]: (token) => token.chainName ?? '',
  [SortByOptions.ASSET]: (token) => token.name ?? '',
};

export const defiGroupSortAccessors: SortAccessors<DefiPosition[]> = {
  [SortByOptions.VALUE]: (group) =>
    sumBy(group, (pos) => pos.netUsd || pos.assetUsd || 0),
  [SortByOptions.CHAIN]: (group) => group[0]?.chain?.chainKey ?? '',
  [SortByOptions.ASSET]: (group) => group[0]?.protocol?.name ?? '',
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

export const extractTokensFilteringParams = (
  data: CacheToken[],
  accounts: Account[],
): PortfolioTokensFilteringParams => {
  const allWallets = accounts
    .filter((account) => account.address)
    .map((account) => ({
      ...account,
      address: account.address!.toString(),
    }));

  const allChains = uniqBy(
    flatMap(data, (token) => [
      ...(token.chainId && token.chainName
        ? [{ chainId: token.chainId, chainKey: token.chainName || '' }]
        : []),
      ...flatMap(token.chains || [], (chain) =>
        chain.chainId && chain.chainName
          ? [{ chainId: chain.chainId, chainKey: chain.chainName || '' }]
          : [],
      ),
    ]),
    'chainId',
  );

  const allAssets = uniqBy(data, 'address');

  const allValues = map(
    data,
    (token) => token.cumulatedTotalUSD ?? token.totalPriceUSD ?? 0,
  );

  const minValue = allValues.length > 0 ? (min(allValues) ?? 0) : 0;
  const maxValue = allValues.length > 0 ? (max(allValues) ?? 0) : 0;

  return {
    allWallets,
    allChains,
    allAssets,
    allValueRange: {
      min: Number(minValue.toFixed(2)),
      max: Number(maxValue.toFixed(2)),
    },
  };
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
  queriesByAddress: Map<string, { data: CacheToken[] }>,
  filter: PortfolioTokensFilter,
  sortByValue: SortByEnum,
  order: OrderEnum,
): CacheToken[] => {
  let allData: CacheToken[] = [];

  const walletsToInclude = filter.tokensWallets?.length
    ? filter.tokensWallets
    : Array.from(queriesByAddress.keys());

  walletsToInclude.forEach((wallet) => {
    const queryData = queriesByAddress.get(wallet);
    if (queryData?.data) {
      allData = [...allData, ...queryData.data];
    }
  });

  if (filter.tokensChains?.length) {
    allData = allData.filter((token) =>
      token.chains?.some((chain) =>
        filter.tokensChains!.includes(chain.chainId),
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
      const value = token.cumulatedTotalUSD ?? token.totalPriceUSD ?? 0;
      const meetsMin =
        filter.tokensMinValue === undefined || value >= filter.tokensMinValue;
      const meetsMax =
        filter.tokensMaxValue === undefined || value <= filter.tokensMaxValue;
      return meetsMin && meetsMax;
    });
  }

  allData = sortPortfolioItems(allData, sortByValue, order, tokenSortAccessors);

  allData = allData.map((token) => ({
    ...token,
    chains: token.chains
      ? sortPortfolioItems(token.chains, sortByValue, order, tokenSortAccessors)
      : [],
  }));

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

export const extractDeFiPositionsFilteringParams = (
  wallet: WalletPositions,
): PortfolioDeFiPositionsFilteringParams => {
  const allPositions = wallet.data;

  const allChains = uniqBy(
    map(allPositions, (position) => position.chain).filter(Boolean),
    'chainId',
  );

  const allProtocols = uniqBy(
    map(allPositions, (position) => position.protocol).filter(Boolean),
    'name',
  );

  const allTypes = uniq(map(allPositions, 'type').filter(Boolean));

  const allTokens = flatMap(allPositions, (position) => [
    ...(position.supplyTokens || []),
    ...(position.assetTokens || []),
    ...(position.collateralTokens || []),
    ...(position.borrowTokens || []),
    ...(position.rewardTokens || []),
  ]);

  const allAssets = uniqBy(allTokens, 'name');

  const values = map(
    allPositions,
    (position) => position.netUsd || position.assetUsd || 0,
  );
  const minValue = values.length > 0 ? (min(values) ?? 0) : 0;
  const maxValue = values.length > 0 ? (max(values) ?? 0) : 0;

  return {
    allChains,
    allProtocols,
    allTypes,
    allAssets,
    allValueRange: {
      min: Number(minValue.toFixed(2)),
      max: Number(maxValue.toFixed(2)),
    },
  };
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
) => ({
  min: Math.max(defaultMinValue, allValueRange.min),
  max: Math.max(defaultMinValue, allValueRange.max),
});
