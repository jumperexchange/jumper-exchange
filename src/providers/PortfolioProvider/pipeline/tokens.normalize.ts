import {
  compact,
  head,
  isEmpty,
  map,
  orderBy,
  sumBy,
  tail,
  toNumber,
  values,
} from 'lodash';
import type { PortfolioToken } from '@/types/tokens';
import type { AugmentedToken } from './tokens.augment';

/**
 * Normalize an AugmentedToken to the app's internal PortfolioToken type.
 * This converts external SDK types to the app's consistent internal schema.
 */
export const normalizeToken = (token: AugmentedToken): PortfolioToken => {
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
 * Normalize a group of tokens with the same symbol into a single PortfolioToken
 * with relatedTokens for cross-chain holdings.
 */
const normalizeTokenGroup = (
  group: AugmentedToken[],
): PortfolioToken | null => {
  if (isEmpty(group)) {
    return null;
  }

  // Sort by amountUSD descending (highest value first)
  const sorted = orderBy(group, (t) => t.amountUSD ?? 0, 'desc');

  const cumulatedAmountUSD = sumBy(sorted, (t) => t.amountUSD ?? 0);
  const cumulatedAmount = sumBy(sorted, (t) => toNumber(t.amount) ?? 0);

  const main = head(sorted)!;
  const rest = tail(sorted);
  const mainToken = normalizeToken(main);

  return {
    ...mainToken,
    totalPriceUSD: cumulatedAmountUSD,
    balance: cumulatedAmount,
    relatedTokens: isEmpty(rest) ? undefined : map(rest, normalizeToken),
  };
};

/**
 * Convert grouped tokens (Record<symbol, AugmentedToken[]>) to PortfolioToken[].
 * Each group becomes a single PortfolioToken with relatedTokens.
 * Results are sorted by totalPriceUSD descending.
 */
export const normalizeGroupedTokens = (
  groupedTokens: Record<string, AugmentedToken[]>,
): PortfolioToken[] => {
  const normalized = map(values(groupedTokens), normalizeTokenGroup);
  return orderBy(compact(normalized), 'totalPriceUSD', 'desc');
};
