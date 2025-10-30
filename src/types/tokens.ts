import { Token } from './jumper-backend';

// @Note: This might change after we decide on the backend API types for the portfolio token; then we can reuse also for the wallet menu
export interface MinimalToken
  extends Pick<Token, 'address' | 'chain' | 'symbol'> {
  balance: number;
  totalPriceUSD: number;
  relatedTokens?: Omit<MinimalToken, 'relatedTokens'>[];
}
