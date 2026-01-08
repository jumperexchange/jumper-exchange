import type { ExtendedChain, WalletTokenExtended } from '@lifi/sdk';
import type { PortfolioToken } from '@/types/tokens';
import { getBalance } from '@/utils/getTokens/utils';
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

function createChainToken(
  token: WalletTokenExtended,
  chain: ExtendedChain | undefined,
  formattedBalance: number,
): Omit<PortfolioToken, 'relatedTokens'> {
  const priceUSD = parseFloat(token.priceUSD);
  const totalPriceUSD = isNaN(priceUSD) ? 0 : formattedBalance * priceUSD;

  return {
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logo: token.logoURI,
    chain: {
      chainId: token.chainId,
      chainKey: chain?.key ?? chain?.name ?? '',
    },
    balance: formattedBalance,
    totalPriceUSD,
  };
}

type PortfolioTokenWithRelated = PortfolioToken & {
  relatedTokens: Omit<PortfolioToken, 'relatedTokens'>[];
};

function createTokenGroup(
  balances: WalletTokenExtended[],
  chains: ExtendedChain[],
): PortfolioTokenWithRelated {
  const chainTokens = map(balances, (balance) => {
    const chain = find(chains, { id: balance.chainId });
    const formattedBalance = calculateFormattedBalance(balance);
    return createChainToken(balance, chain, formattedBalance);
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

  const cumulatedBalance = sumBy(sortedRelatedTokens, (t) => t.balance ?? 0);
  const cumulatedTotalUSD = sumBy(
    sortedRelatedTokens,
    (t) => t.totalPriceUSD ?? 0,
  );

  return {
    address: primaryBalance.address,
    symbol: primaryBalance.symbol,
    name: primaryBalance.name,
    decimals: primaryBalance.decimals,
    logo: primaryBalance.logoURI,
    chain: {
      chainId: primaryToken?.chain.chainId ?? primaryBalance.chainId,
      chainKey: primaryToken?.chain.chainKey ?? '',
    },
    balance: cumulatedBalance,
    totalPriceUSD: cumulatedTotalUSD,
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
