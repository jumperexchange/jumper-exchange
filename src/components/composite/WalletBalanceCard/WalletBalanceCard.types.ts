import type { PortfolioToken } from 'src/types/tokens';

export interface WalletBalanceCardProps {
  walletAddress: string;
  refetch: () => void;
  isFetching: boolean;
  isSuccess: boolean;
  data: PortfolioToken[];
  ['data-testid']?: string;
}
