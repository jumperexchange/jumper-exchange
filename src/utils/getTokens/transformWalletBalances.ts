import type { ExtendedChain, WalletTokenExtended } from '@lifi/sdk';
import type { ExtendedTokenAmountWithChain } from '@/utils/getTokens/index';
import { getBalance } from '@/utils/getTokens/utils';

function calculateFormattedBalance(token: WalletTokenExtended): number {
  if ('balance' in token && typeof token.balance === 'number') {
    return token.balance;
  }

  return getBalance({
    amount: BigInt(token.amount),
    decimals: token.decimals,
  });
}

function createChainToken(
  token: WalletTokenExtended,
  chain: ExtendedChain | undefined,
  formattedBalance: number,
): ExtendedTokenAmountWithChain {
  const totalPriceUSD = formattedBalance * parseFloat(token.priceUSD);

  return {
    ...token,
    amount: BigInt(token.amount),
    cumulatedBalance: formattedBalance,
    totalPriceUSD,
    chainLogoURI: chain?.logoURI,
    chainName: chain?.name,
    chains: [],
  };
}

function updateCumulatedValues(token: ExtendedTokenAmountWithChain): void {
  token.cumulatedBalance = token.chains.reduce(
    (sum, chain) => sum + (chain.cumulatedBalance ?? 0),
    0,
  );

  token.cumulatedTotalUSD = token.chains.reduce(
    (sum, chain) => sum + (chain.totalPriceUSD ?? 0),
    0,
  );
}

function addChainToToken(
  token: ExtendedTokenAmountWithChain,
  chainToken: ExtendedTokenAmountWithChain,
): void {
  token.chains.push(chainToken);
  token.chains.sort((a, b) => (b.totalPriceUSD ?? 0) - (a.totalPriceUSD ?? 0));
  updateCumulatedValues(token);
}

function createTokenGroup(
  token: WalletTokenExtended,
  chainToken: ExtendedTokenAmountWithChain,
): ExtendedTokenAmountWithChain {
  return {
    address: token.address,
    symbol: token.symbol,
    chainId: token.chainId,
    amount: BigInt(token.amount),
    name: token.name,
    priceUSD: token.priceUSD,
    decimals: token.decimals,
    logoURI: token.logoURI,
    cumulatedBalance: chainToken.cumulatedBalance ?? 0,
    cumulatedTotalUSD: chainToken.totalPriceUSD ?? 0,
    totalPriceUSD: chainToken.totalPriceUSD ?? 0,
    chains: [chainToken],
  };
}

function groupTokensBySymbol(
  balances: WalletTokenExtended[],
  chains: ExtendedChain[],
): Record<string, ExtendedTokenAmountWithChain> {
  const symbolMap: Record<string, ExtendedTokenAmountWithChain> = {};

  for (const balance of balances) {
    const chain = chains.find((c) => c.id === balance.chainId);
    const formattedBalance = calculateFormattedBalance(balance);
    const chainToken = createChainToken(balance, chain, formattedBalance);

    const existingToken = symbolMap[balance.symbol];

    if (existingToken) {
      addChainToToken(existingToken, chainToken);
    } else {
      symbolMap[balance.symbol] = createTokenGroup(balance, chainToken);
    }
  }

  return symbolMap;
}

function enrichWithPrimaryChain(
  token: ExtendedTokenAmountWithChain,
): ExtendedTokenAmountWithChain {
  const primaryChain = token.chains[0];

  return {
    ...token,
    chainId: primaryChain?.chainId ?? token.chainId,
    chainLogoURI: primaryChain?.chainLogoURI,
    chainName: primaryChain?.chainName,
  };
}

function sortByTotalValue(
  tokens: ExtendedTokenAmountWithChain[],
): ExtendedTokenAmountWithChain[] {
  return tokens.sort(
    (a, b) => (b.cumulatedTotalUSD ?? 0) - (a.cumulatedTotalUSD ?? 0),
  );
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
  const allBalances = Object.values(walletBalances).flat();
  const symbolMap = groupTokensBySymbol(allBalances, chains);
  const tokens = Object.values(symbolMap).map(enrichWithPrimaryChain);

  return sortByTotalValue(tokens);
}
