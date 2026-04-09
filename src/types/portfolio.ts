import type { Account } from '@lifi/widget-provider';
import type { PortfolioToken } from '@/types/tokens';

export interface PortfolioProps {
  lastTotalValue: Map<string, number>;
  lastDate: Map<string, number>;
  forceRefresh: Map<string, boolean>;
  cacheTokens: Map<string, PortfolioToken[]>;
}

export interface PortfolioState extends PortfolioProps {
  getFormattedCacheTokens(accounts?: Account[]): {
    totalValue: number;
    cache: PortfolioToken[];
  };
  getLast: (address: string) => { value: number; date: number };
  setLast: (address: string, value: number, date: number) => void;
  setForceRefresh: (address: string, state: boolean) => void;
  setCacheTokens: (account: string, tokens: PortfolioToken[]) => void;
  deleteCacheTokenAddress: (account: string) => void;
}
