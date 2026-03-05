import type { PortfolioBalance, WalletToken } from 'src/types/tokens';

export interface WalletBalanceCardProps {
  walletAddress: string;
  refetch: () => void;
  isFetching: boolean;
  isSuccess: boolean;
  updatedAt: number;
  data: Record<string, PortfolioBalance<WalletToken>[]>;
  error: Error | null;
  ['data-testid']?: string;
}
