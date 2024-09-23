export interface PortfolioProps {
  lastTotalValue: number;
  lastAddresses?: string[];
  lastDate: number;
  forceRefresh: boolean;
}
export interface PortfolioState extends PortfolioProps {
  setLastTotalValue: (portfolioLastValue: number) => void;
  setLastAddresses: (lastAddresses: string[]) => void;
  setLast: (portfolioLastValue: number, lastAddresses: string[]) => void;
  setForceRefresh: (state: boolean) => void;
}
