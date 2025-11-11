import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  Nullable,
} from 'nuqs';
import { uniqBy } from 'lodash';
import { CacheToken } from 'src/types/portfolio';
import {
  PortfolioFilteringParams,
  PortfolioTokensFilter,
  WalletInfo,
} from './types';
import type { Account } from '@lifi/wallet-management';

export const searchParamsParsers = {
  wallets: parseAsArrayOf(parseAsString),
  chains: parseAsArrayOf(parseAsInteger),
  assets: parseAsArrayOf(parseAsString),
  minValue: parseAsFloat,
  maxValue: parseAsFloat,
};

export const extractFilteringParams = (
  data: CacheToken[],
  accounts: Account[],
): PortfolioFilteringParams => {
  // Extract wallet information from accounts
  const allWallets: WalletInfo[] = accounts.map((account) => {
    const connector = account.connector as any;
    return {
      address: account.address!,
      connectorName: connector?.name || 'Unknown Wallet',
      connector: account.connector,
    };
  });
  // Get all unique chains from the data
  // Flatten all tokens including nested chains
  const allTokens = data.flatMap((token) => [token, ...(token.chains || [])]);

  const chainMap = new Map<
    number,
    { chainId: number; chainKey: string; name: string; logoURI?: string }
  >();

  allTokens.forEach((token) => {
    if (token.chainId && token.chainName && !chainMap.has(token.chainId)) {
      chainMap.set(token.chainId, {
        chainId: token.chainId,
        chainKey: token.chainName || '',
        name: token.chainName,
        logoURI: token.chainLogoURI,
      });
    }
  });

  const allChains = Array.from(chainMap.values());

  // Get all unique assets
  const allAssets = uniqBy(data, 'address');

  // Calculate value range
  const allValues = data
    .map((token) => token.cumulatedTotalUSD ?? token.totalPriceUSD ?? 0)
    .filter((value) => value > 0);

  const minValue = allValues.length > 0 ? Math.min(...allValues) : 0;
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;

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

export const removeNullValuesFromFilter = (
  filter: Nullable<PortfolioTokensFilter>,
): PortfolioTokensFilter => {
  return Object.fromEntries(
    Object.entries(filter).filter(([_, value]) => value !== null),
  ) as PortfolioTokensFilter;
};

export const sanitizeFilter = (
  filter: PortfolioTokensFilter,
  stats: PortfolioFilteringParams,
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
    wallets: filter.wallets?.filter((w) => validWalletAddresses.has(w)) ?? null,
    chains: filter.chains?.filter((id) => validChainIds.has(id)) ?? null,
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

export const filterPortfolioData = (
  queriesByAddress: Map<string, { data: CacheToken[] }>,
  filter: PortfolioTokensFilter,
): CacheToken[] => {
  let allData: CacheToken[] = [];

  // Filter by wallets first (multiple wallet selection)
  const walletsToInclude = filter.wallets?.length
    ? filter.wallets
    : Array.from(queriesByAddress.keys());

  walletsToInclude.forEach((wallet) => {
    const queryData = queriesByAddress.get(wallet);
    if (queryData?.data) {
      allData = [...allData, ...queryData.data];
    }
  });

  // Filter by chains
  if (filter.chains?.length) {
    allData = allData.filter((token) =>
      token.chains?.some((chain) => filter.chains!.includes(chain.chainId)),
    );
  }

  // Filter by assets
  if (filter.assets?.length) {
    allData = allData.filter((token) => filter.assets!.includes(token.address));
  }

  // Filter by value range
  if (filter.minValue !== undefined || filter.maxValue !== undefined) {
    allData = allData.filter((token) => {
      const value = token.cumulatedTotalUSD ?? token.totalPriceUSD ?? 0;
      const meetsMin =
        filter.minValue === undefined || value >= filter.minValue;
      const meetsMax =
        filter.maxValue === undefined || value <= filter.maxValue;
      return meetsMin && meetsMax;
    });
  }

  return allData;
};
