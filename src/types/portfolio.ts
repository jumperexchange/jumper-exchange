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
  lastTotalValue: number | null;
  lastAddresses?: string[];
  lastDate: number | null;
  forceRefresh: boolean;
  cacheTokens: Map<string, CacheToken[]>;
}
export interface PortfolioState extends PortfolioProps {
  getFormattedCacheTokens(accounts?: Account[]): {
    totalValue: number;
    cache: CacheToken[];
  };
  setLastTotalValue: (portfolioLastValue: number) => void;
  setLastAddresses: (lastAddresses: string[]) => void;
  setLast: (portfolioLastValue: number, lastAddresses: string[]) => void;
  setForceRefresh: (state: boolean) => void;
  setCacheTokens: (account: string, state: ExtendedTokenAmount[]) => void;
  deleteCacheTokenAddress: (account: string) => void;
}
