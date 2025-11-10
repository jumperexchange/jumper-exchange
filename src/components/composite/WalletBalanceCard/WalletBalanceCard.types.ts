import { CacheToken } from 'src/types/portfolio';
import { ExtendedTokenAmount } from 'src/utils/getTokens';

export interface WalletBalanceCardProps {
  walletAddress: string;
  refetch: () => void;
  isFetching: boolean;
  isSuccess: boolean;
  data: (ExtendedTokenAmount | CacheToken)[];
}
