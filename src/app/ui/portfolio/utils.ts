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
  tokensWallets: parseAsArrayOf(parseAsString),
  tokensChains: parseAsArrayOf(parseAsInteger),
  tokensAssets: parseAsArrayOf(parseAsString),
  tokensMinValue: parseAsFloat,
  tokensMaxValue: parseAsFloat,
};

export const extractFilteringParams = (
  data: CacheToken[],
  accounts: Account[],
): PortfolioFilteringParams => {
  const allWallets: WalletInfo[] = accounts.map((account) => {
    const connector = account.connector as any;
    return {
      address: account.address!,
      connectorName: connector?.name || 'Unknown Wallet',
      connector: account.connector,
    };
  });

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

  const allAssets = uniqBy(data, 'address');

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

export const filterPortfolioData = (
  queriesByAddress: Map<string, { data: CacheToken[] }>,
  filter: PortfolioTokensFilter,
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

  return allData;
};
