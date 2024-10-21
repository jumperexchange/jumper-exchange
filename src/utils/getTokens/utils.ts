import type { TokenAmount } from '@lifi/sdk';
import { formatUnits } from 'viem';

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
