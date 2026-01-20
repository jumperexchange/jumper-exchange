import type { PortfolioToken } from '@/types/tokens';
import type { Account } from '@lifi/wallet-management';
import type { LiFiCommonToken } from '../datasources/tokens.datasource';

/** Token augmented with chain info and computed USD value */
export interface AugmentedToken extends LiFiCommonToken {
  chainKey: string;
  chainName: string;
  amountUSD: number;
}

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
