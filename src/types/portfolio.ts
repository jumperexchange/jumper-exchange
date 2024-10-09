import type { ExtendedTokenAmount } from '@/utils/getTokens';

export interface PortfolioProps {
  lastTotalValue: number;
  totalValue: number;
  lastAddresses?: string[];
  lastDate: number;
  forceRefresh: boolean;
  cacheTokens: ExtendedTokenAmount[];
}
export interface PortfolioState extends PortfolioProps {
  setLastTotalValue: (portfolioLastValue: number) => void;
  setLastAddresses: (lastAddresses: string[]) => void;
  setLast: (portfolioLastValue: number, lastAddresses: string[]) => void;
  setForceRefresh: (state: boolean) => void;
  setCacheTokens: (state: ExtendedTokenAmount[]) => void;
}
