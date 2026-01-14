import type { PortfolioToken } from '@/types/tokens';
import type { Account } from '@lifi/wallet-management';

/**
 * Connected wallet account for portfolio (address is required).
 */
export type PortfolioAccount = Omit<Account, 'address'> & { address: string };

/**
 * Summary data for a token (used in portfolio summary view).
 */
export interface PortfolioTokenSummary extends Omit<
  PortfolioToken,
  'relatedTokens' | 'totalPriceUSD' | 'balance'
> {
  totalValueUSD: number;
  formattedTotalValueUSD: string;
  balance: number;
  formattedBalance: string;
  percentageOfTotalValueUSD: number;
}
