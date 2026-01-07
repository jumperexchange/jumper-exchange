import type { Token, TokenAmount, TokensResponse } from '@lifi/sdk';
import type { ExtendedTokenAmountWithChain } from '@/utils/getTokens/index';
import { formatUnits } from 'viem';
import {
  orderBy,
  sumBy,
  concat,
  first,
  flatMap,
  map,
  reduce,
  filter,
} from 'lodash';

export function getBalance(tokenBalance: Partial<TokenAmount>): number {
  return tokenBalance?.amount && tokenBalance?.decimals
    ? Number(formatUnits(tokenBalance.amount, tokenBalance.decimals))
    : 0;
}

export function arraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  return sortedArr1.every((value, index) => value === sortedArr2[index]);
}

export function mergeTokenIntoSymbolMap(
  symbolMap: Record<string, ExtendedTokenAmountWithChain>,
  token: ExtendedTokenAmountWithChain,
): void {
  const existing = symbolMap[token.symbol];

  if (existing) {
    const mergedChains = concat(existing.chains || [], token.chains || []);
    const sortedChains = orderBy(
      mergedChains,
      [(c) => c.totalPriceUSD ?? 0],
      ['desc'],
    );

    const cumulatedBalance = sumBy(
      sortedChains,
      (c) => c.cumulatedBalance ?? 0,
    );
    const cumulatedTotalUSD = sumBy(sortedChains, (c) => c.totalPriceUSD ?? 0);

    const primaryChain = first(sortedChains);

    symbolMap[token.symbol] = {
      ...existing,
      chainId: primaryChain?.chainId ?? existing.chainId,
      chainLogoURI: primaryChain?.chainLogoURI ?? existing.chainLogoURI,
      chainName: primaryChain?.chainName ?? existing.chainName,
      totalPriceUSD: primaryChain?.totalPriceUSD ?? existing.totalPriceUSD,
      chains: sortedChains,
      cumulatedBalance,
      cumulatedTotalUSD,
    };
  } else {
    symbolMap[token.symbol] = { ...token };
  }
}

export function mergeTokenBalances(
  primary: ExtendedTokenAmountWithChain[],
  additional: ExtendedTokenAmountWithChain[],
): ExtendedTokenAmountWithChain[] {
  const symbolMap: Record<string, ExtendedTokenAmountWithChain> = {};

  for (const token of primary) {
    mergeTokenIntoSymbolMap(symbolMap, token);
  }

  for (const token of additional) {
    mergeTokenIntoSymbolMap(symbolMap, token);
  }

  return orderBy(
    Object.values(symbolMap),
    [(t) => t.cumulatedTotalUSD ?? 0],
    ['desc'],
  );
}

export function filterExcludedTokens(
  allTokens: TokensResponse['tokens'],
  walletBalances: Record<number, { address: string }[]>,
): TokensResponse['tokens'] {
  const walletTokenKeys = new Set(
    flatMap(walletBalances, (tokens, chainId) =>
      map(tokens, (token) => `${chainId}:${token.address.toLowerCase()}`),
    ),
  );

  return reduce(
    allTokens,
    (acc, tokens, chainId) => {
      const filtered = filter(
        tokens,
        (token: Token) =>
          !walletTokenKeys.has(`${chainId}:${token.address.toLowerCase()}`),
      );
      if (filtered.length > 0) {
        acc[Number(chainId)] = filtered;
      }
      return acc;
    },
    {} as TokensResponse['tokens'],
  );
}
