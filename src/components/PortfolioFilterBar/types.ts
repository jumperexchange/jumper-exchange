import type { SortByEnum } from '@/providers/PortfolioProvider/filtering/types';

export enum PortfolioViewBarTab {
  HOLDINGS = 'holdings',
  PERFORMANCE = 'performance',
  TRANSACTIONS = 'transactions',
}

export interface PortfolioFilterViewBaseProps {
  isDisabled: boolean;
  areTransactionsEnabled: boolean;
  value: PortfolioViewBarTab;
  onChange: (value: PortfolioViewBarTab) => void;
}

export interface HoldingsPendingFilterValues {
  wallets: string[];
  chains: string[];
  assets: string[];
  value: number[];
  sortBy: SortByEnum;
}
