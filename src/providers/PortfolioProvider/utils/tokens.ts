import {
  compact,
  differenceWith,
  groupBy as groupByLodash,
  isEmpty,
  orderBy,
  values,
} from 'lodash';
import type { ExtendedChain } from '@lifi/sdk';
import type { AllTokens } from '@/hooks/useTokens';
import type { LiFiCommonToken } from '../lib/fetchTokensForAddresses';
import {
  PortfolioExtendedToken,
  PortfolioTokenGroup,
  type PriceLookup,
  type NormalizeTokensParams,
  type TokenGroupingKey,
  type TokenGroupingFn,
} from '../types/tokens';
import type { LpTokenIdentifier } from '../types/positions';

export const normalizeTokens = ({
  tokens,
  chains,
  getPrice,
}: NormalizeTokensParams): PortfolioExtendedToken[] => {
  return tokens
    .map((token) => {
      try {
        const chain = chains.find((c) => c.id === token.chainId);
        if (!chain) {
          return null;
        }
        return PortfolioExtendedToken.fromLiFiToken(token, chain, getPrice);
      } catch (error) {
        console.warn(
          `[normalizeTokens] Failed to normalize token ${token.symbol} on chain ${token.chainId}:`,
          error,
        );
        return null;
      }
    })
    .filter(Boolean) as PortfolioExtendedToken[];
};

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

const getTokenKey = (address: string, chainId: number): string =>
  `${address.toLowerCase()}-${chainId}`;

export const dedupTokensFromLpPositions = (
  tokens: PortfolioExtendedToken[],
  lpTokens: LpTokenIdentifier[],
): PortfolioExtendedToken[] => {
  if (isEmpty(tokens) || isEmpty(lpTokens)) {
    return tokens;
  }

  return differenceWith(tokens, lpTokens, (token, lpToken) => {
    const tokenKey = getTokenKey(token.address, token.chainId);
    const lpKey = getTokenKey(lpToken.address, lpToken.chainId);

    return tokenKey === lpKey;
  });
};

export const createPriceLookup = (tokensByChain: AllTokens['tokens']) => {
  return (chainId: number, address: string): number | undefined => {
    const chainTokens = tokensByChain[chainId];
    if (!chainTokens) {
      return undefined;
    }
    const token = chainTokens.find(
      (t) => t.address.toLowerCase() === address.toLowerCase(),
    );
    return token?.priceUSD ? Number(token.priceUSD) : undefined;
  };
};
