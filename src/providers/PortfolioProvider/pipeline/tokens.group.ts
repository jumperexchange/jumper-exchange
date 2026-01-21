import {
  compact,
  groupBy as groupByLodash,
  orderBy,
  sumBy,
  values,
} from 'lodash';
import { PortfolioTokenGroup } from '../types/PortfolioTokenGroup';
import type { PortfolioExtendedToken } from '../types/PortfolioExtendedToken';

export type TokenGroupingFn = (token: PortfolioExtendedToken) => string;

export type TokenGroupingKey = 'bySymbol' | 'byChain';

export const groupBySymbol: TokenGroupingFn = (t) => t.symbol || 'Unknown';

export const groupByChain: TokenGroupingFn = (t) => t.chainKey;

export const tokenGroupingFns: Record<TokenGroupingKey, TokenGroupingFn> = {
  bySymbol: groupBySymbol,
  byChain: groupByChain,
};

export const toTokensGroup = (
  tokens: PortfolioExtendedToken[],
): PortfolioTokenGroup | null => {
  if (tokens.length === 0) {
    return null;
  }
  return new PortfolioTokenGroup(tokens, 0);
};

export const groupTokens = (
  tokens: PortfolioExtendedToken[],
  groupBy: TokenGroupingKey,
): PortfolioTokenGroup[] => {
  const groupingFn = tokenGroupingFns[groupBy];
  const grouped = groupByLodash(tokens, groupingFn);
  const groups = values(grouped).map(toTokensGroup);
  return orderBy(compact(groups), (g) => g.amountUSD, 'desc');
};
