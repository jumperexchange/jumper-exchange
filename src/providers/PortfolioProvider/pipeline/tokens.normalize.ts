import {
  compact,
  head,
  isEmpty,
  map,
  orderBy,
  sumBy,
  toNumber,
  values,
} from 'lodash';
import type { PortfolioToken } from '@/types/tokens';
import type { EnrichedToken, TokensBySymbol } from '../types/tokens.types';

/**
 * Convert an EnrichedToken to the app's internal PortfolioToken type.
 */
export const toPortfolioToken = (token: EnrichedToken): PortfolioToken => {
  return {
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logo: token.logoURI,
    address: token.address,
    chain: {
      chainId: token.chainId,
      chainKey: token.chainKey ?? token.chainName ?? '',
    },
    balance: toNumber(token.amount) || 0,
    totalPriceUSD: token.amountUSD,
  };
};

/**
 * Convert a group of tokens with the same symbol into a single PortfolioToken
 * with relatedTokens for cross-chain holdings.
 */
const toPortfolioTokenFromGroup = (
  group: EnrichedToken[],
): PortfolioToken | null => {
  if (isEmpty(group)) {
    return null;
  }

  const sorted = orderBy(group, (t) => t.amountUSD ?? 0, 'desc');

  const cumulatedAmountUSD = sumBy(sorted, (t) => t.amountUSD ?? 0);
  const cumulatedAmount = sumBy(sorted, (t) => toNumber(t.amount) ?? 0);

  const main = head(sorted)!;
  const mainToken = toPortfolioToken(main);

  return {
    ...mainToken,
    totalPriceUSD: cumulatedAmountUSD,
    balance: cumulatedAmount,
    relatedTokens: map(sorted, toPortfolioToken),
  };
};

/**
 * Convert grouped tokens to PortfolioToken[].
 * Each group becomes a single PortfolioToken with relatedTokens.
 * Results are sorted by totalPriceUSD descending.
 */
export const toPortfolioTokens = (
  groupedTokens: TokensBySymbol,
): PortfolioToken[] => {
  const portfolioTokens = map(values(groupedTokens), toPortfolioTokenFromGroup);
  return orderBy(compact(portfolioTokens), 'totalPriceUSD', 'desc');
};
