import type { TokenAmount, ExtendedChain } from '@lifi/sdk';
import { formatUnits } from 'viem';
import type { PortfolioToken } from '@/types/tokens';

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

export interface TransformableToken extends Pick<
  TokenAmount,
  | 'address'
  | 'name'
  | 'symbol'
  | 'decimals'
  | 'logoURI'
  | 'chainId'
  | 'priceUSD'
> {}

/**
 * Transforms a token with balance into a PortfolioToken (without relatedTokens)
 *
 * @param token - The token to transform (TokenAmount or WalletTokenExtended)
 * @param chain - The chain info for the token
 * @param formattedBalance - The human-readable balance
 */
export function transformToPortfolioToken<T extends TransformableToken>(
  token: T,
  chain: ExtendedChain | undefined,
  formattedBalance: number,
  formattedTotalPriceUSD?: number,
): Omit<PortfolioToken, 'relatedTokens'> {
  const priceUSD = parseFloat(token.priceUSD);
  const totalPriceUSD =
    formattedTotalPriceUSD ??
    (isNaN(priceUSD) ? 0 : formattedBalance * priceUSD);

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
