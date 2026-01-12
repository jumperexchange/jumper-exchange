import type { Token } from './jumper-backend';

// @Note: This might change after we decide on the backend API types for the portfolio token; then we can reuse also for the wallet menu
export interface PortfolioToken extends Token {
  balance: number;
  totalPriceUSD: number;
  relatedTokens?: Omit<PortfolioToken, 'relatedTokens'>[];
}

export type PortfolioTokenWithRelated = PortfolioToken & {
  relatedTokens: Omit<PortfolioToken, 'relatedTokens'>[];
};
