import type { ExtendedChain, WalletTokenExtended } from '@lifi/sdk';
import type { PortfolioToken, PortfolioTokenWithRelated } from '@/types/tokens';
import { getBalance, transformToPortfolioToken } from '@/utils/getTokens/utils';
import { find, flatMap, sumBy, orderBy, map, groupBy, first } from 'lodash';

const safeBigInt = (value: string): bigint => {
  try {
    return BigInt(value);
  } catch {
    return 0n;
  }
};

function calculateFormattedBalance(token: WalletTokenExtended): number {
  if ('balance' in token && typeof token.balance === 'number') {
    return token.balance;
  }

  return getBalance({
    amount: safeBigInt(token.amount),
    decimals: token.decimals,
  });
}

function createTokenGroup(
  balances: WalletTokenExtended[],
  chains: ExtendedChain[],
): PortfolioTokenWithRelated {
  const chainTokens = map(balances, (balance) => {
    const chain = find(chains, { id: balance.chainId });
    const formattedBalance = calculateFormattedBalance(balance);
    return transformToPortfolioToken(balance, chain, formattedBalance);
  });

  const sortedRelatedTokens = orderBy(
    chainTokens,
    [(c) => c.totalPriceUSD ?? 0],
    ['desc'],
  );
  const primaryToken = first(sortedRelatedTokens);
  const primaryBalance =
    find(balances, { chainId: primaryToken?.chain?.chainId }) ??
    first(balances)!;
  const primaryChain = find(chains, { id: primaryBalance.chainId });

  const cumulatedBalance = sumBy(sortedRelatedTokens, (t) => t.balance ?? 0);
  const cumulatedTotalUSD = sumBy(
    sortedRelatedTokens,
    (t) => t.totalPriceUSD ?? 0,
  );

  return {
    ...transformToPortfolioToken(
      primaryBalance,
      primaryChain,
      cumulatedBalance,
      cumulatedTotalUSD,
    ),
    relatedTokens: sortedRelatedTokens,
  };
}

/**
 * Transforms wallet balances from getWalletBalances API into grouped token format
 *
 * Groups tokens by symbol across chains and calculates cumulated values:
 * - balance: formatted balance summed across all chains
 * - totalPriceUSD: total USD value across all chains
 * - relatedTokens: individual chain breakdown sorted by USD value
 */
export function transformWalletBalances(
  walletBalances: Record<number, WalletTokenExtended[]>,
  chains: ExtendedChain[],
): PortfolioToken[] {
  const allBalances = flatMap(walletBalances);
  const groupedBySymbol = groupBy(allBalances, 'symbol');
  const tokens = map(groupedBySymbol, (balances) =>
    createTokenGroup(balances, chains),
  );
  return orderBy(tokens, [(t) => t.totalPriceUSD ?? 0], ['desc']);
}
