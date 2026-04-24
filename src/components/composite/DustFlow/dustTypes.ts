import type {
  PortfolioBalance,
  WalletToken,
  ExtendedToken,
} from '@/types/tokens';

export interface DustSummaryValue {
  selectedBalances: PortfolioBalance<WalletToken>[];
  nativeToken: ExtendedToken;
  amount: string;
  amountUSD: number;
  address: string;
}
