import type {
  ExtendedTokenAmount,
  ExtendedTokenAmountWithChain,
} from '@/utils/getTokens';
import type { Account } from '@lifi/wallet-management';

export type CacheToken = Pick<
  ExtendedTokenAmountWithChain,
  | 'address'
  | 'chainId'
  | 'chainLogoURI'
  | 'chainName'
  | 'cumulatedBalance'
  | 'cumulatedTotalUSD'
  | 'logoURI'
  | 'name'
  | 'priceUSD'
  | 'symbol'
  | 'totalPriceUSD'
> & {
  chains: CacheToken[];
};

export interface PortfolioProps {
  lastTotalValue: Map<string, number>;
  lastDate: Map<string, number>;
  forceRefresh: Map<string, boolean>;
  cacheTokens: Map<string, CacheToken[]>;
}
export interface PortfolioState extends PortfolioProps {
  getFormattedCacheTokens(accounts?: Account[]): {
    totalValue: number;
    cache: CacheToken[];
  };
  getLast: (address: string) => { value: number; date: number };
  setLast: (address: string, value: number, date: number) => void;
  setForceRefresh: (address: string, state: boolean) => void;
  setCacheTokens: (account: string, state: ExtendedTokenAmount[]) => void;
  deleteCacheTokenAddress: (account: string) => void;
}
