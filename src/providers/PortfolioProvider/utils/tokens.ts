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
import type { LiFiCommonToken } from '../lib/fetchBalancesForAddresses';
import {
  PortfolioExtendedToken,
  PortfolioTokenGroup,
  type PriceLookup,
  type NormalizeTokensParams,
  type TokenGroupingKey,
  type TokenGroupingFn,
  PortfolioBalance,
} from '../types/tokens';
import type { LpTokenIdentifier } from '../types/positions';
import { TokenBalance } from '@/types/tokens';
import { formatUnits } from 'viem';

export const toPortfolioBalances = (
  balances: TokenBalance[],
): PortfolioBalance[] => {
  return balances
    .map((balance) => {
      const amount = formatUnits(balance.amount, balance.token.decimals);
      const amountUSD = Number(amount) * Number(balance.token.priceUSD);
      return {
        ...balance,
        amountUSD,
      };
    })
    .filter(Boolean) as PortfolioBalance[];
};

export const groupBySymbol: TokenGroupingFn = (t) => t.symbol || 'Unknown';

export const groupByChain: TokenGroupingFn = (t) => t.chainKey;

export const tokenGroupingFns: Record<TokenGroupingKey, TokenGroupingFn> = {
  bySymbol: groupBySymbol,
  byChain: groupByChain,
};

export const toTokensGroup = (
  balances: TokenBalance[],
): PortfolioTokenGroup | null => {
  if (balances.length === 0) {
    return null;
  }
  return new PortfolioTokenGroup(tokens, 0);
};

export const groupTokens = (
  balances: TokenBalance[],
  groupBy: TokenGroupingKey,
): PortfolioTokenGroup[] => {
  const groupingFn = tokenGroupingFns[groupBy];
  const grouped = groupByLodash(balances, groupingFn);
  const groups = values(grouped).map(toTokensGroup);
  return orderBy(compact(groups), (g) => g.amountUSD, 'desc');
};

const getTokenKey = (address: string, chainId: number): string =>
  `${address.toLowerCase()}-${chainId}`;

export const dedupTokensFromLpPositions = (
  balances: TokenBalance[],
  lpTokens: LpTokenIdentifier[],
): TokenBalance[] => {
  if (isEmpty(balances) || isEmpty(lpTokens)) {
    return balances;
  }

  return differenceWith(balances, lpTokens, (balance, lpToken) => {
    const tokenKey = getTokenKey(balance.token.address, balance.token.chainId);
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
