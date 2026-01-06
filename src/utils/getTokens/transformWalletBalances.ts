import type { ExtendedChain, WalletTokenExtended } from '@lifi/sdk';
import type { ExtendedTokenAmountWithChain } from '@/utils/getTokens/index';
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
): ExtendedTokenAmountWithChain {
  const priceUSD = parseFloat(token.priceUSD);
  const totalPriceUSD = isNaN(priceUSD) ? 0 : formattedBalance * priceUSD;

  return {
    ...token,
    amount: safeBigInt(token.amount),
    cumulatedBalance: formattedBalance,
    totalPriceUSD,
    chainLogoURI: chain?.logoURI,
    chainName: chain?.name,
    chains: [],
  };
}

function createTokenGroup(
  balances: WalletTokenExtended[],
  chains: ExtendedChain[],
): ExtendedTokenAmountWithChain {
  const chainTokens = map(balances, (balance) => {
    const chain = find(chains, { id: balance.chainId });
    const formattedBalance = calculateFormattedBalance(balance);
    return createChainToken(balance, chain, formattedBalance);
  });

  const sortedChains = orderBy(
    chainTokens,
    [(c) => c.totalPriceUSD ?? 0],
    ['desc'],
  );
  const primaryChain = first(sortedChains);
  const firstBalance = first(balances)!;

  return {
    address: firstBalance.address,
    symbol: firstBalance.symbol,
    chainId: primaryChain?.chainId ?? firstBalance.chainId,
    amount: safeBigInt(firstBalance.amount),
    name: firstBalance.name,
    priceUSD: firstBalance.priceUSD,
    decimals: firstBalance.decimals,
    logoURI: firstBalance.logoURI,
    chainLogoURI: primaryChain?.chainLogoURI,
    chainName: primaryChain?.chainName,
    cumulatedBalance: sumBy(sortedChains, (c) => c.cumulatedBalance ?? 0),
    cumulatedTotalUSD: sumBy(sortedChains, (c) => c.totalPriceUSD ?? 0),
    totalPriceUSD: primaryChain?.totalPriceUSD ?? 0,
    chains: sortedChains,
  };
}

/**
 * Transforms wallet balances from getWalletBalances API into grouped token format
 *
 * Groups tokens by symbol across chains and calculates cumulated values:
 * - balance & cumulatedBalance: formatted with decimals
 * - totalPriceUSD: individual chain value
 * - cumulatedTotalUSD: sum across all chains
 */
export function transformWalletBalances(
  walletBalances: Record<number, WalletTokenExtended[]>,
  chains: ExtendedChain[],
): ExtendedTokenAmountWithChain[] {
  const allBalances = flatMap(walletBalances);
  const groupedBySymbol = groupBy(allBalances, 'symbol');
  const tokens = map(groupedBySymbol, (balances) =>
    createTokenGroup(balances, chains),
  );
  return orderBy(tokens, [(t) => t.cumulatedTotalUSD ?? 0], ['desc']);
}
