import type { PortfolioBalance, WalletToken } from '@/types/tokens';
import { ChainId } from '@lifi/sdk';

export const getChainMinUsdThreshold = (chainId: number) => {
  if (chainId === ChainId.ETH) {
    return 0.5;
  }
  return 0.05;
};

export const checkBalanceWithinRange = (
  balance: PortfolioBalance<WalletToken>,
  maxUsd: number,
  minUsd: number,
): boolean => maxUsd >= balance.amountUSD && balance.amountUSD > minUsd;
