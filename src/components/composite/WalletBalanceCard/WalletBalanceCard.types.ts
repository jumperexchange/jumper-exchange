import type { CacheToken } from 'src/types/portfolio';
import type { ExtendedTokenAmount } from 'src/utils/getTokens';

export interface WalletBalanceCardProps {
  walletAddress: string;
  refetch: () => void;
  isFetching: boolean;
  isSuccess: boolean;
  data: (ExtendedTokenAmount | CacheToken)[];
  ['data-testid']?: string;
}
