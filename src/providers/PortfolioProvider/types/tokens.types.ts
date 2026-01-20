import type { PortfolioToken } from '@/types/tokens';
import type { Account } from '@lifi/wallet-management';
import type { LiFiCommonToken } from '../datasources/tokens.datasource';

/**
 * Token enriched with chain metadata and computed USD value.
 * Used internally during pipeline processing.
 */
export interface EnrichedToken extends LiFiCommonToken {
  chainKey: string;
  chainName: string;
  amountUSD: number;
}

/**
 * Tokens organized by symbol for aggregation.
 * Multiple tokens with the same symbol (e.g., USDC on different chains)
 * are grouped together before normalization to PortfolioToken.
 */
export type TokensBySymbol = Record<string, EnrichedToken[]>;

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
