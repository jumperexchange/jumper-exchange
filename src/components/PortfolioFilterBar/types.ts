import type { SortByEnum } from '@/providers/PortfolioProvider/filtering/types';
import type { PortfolioViewBarTab } from '../../app/ui/portfolio/PortfolioContentSection';

export interface PortfolioFilterViewBaseProps {
  isDisabled: boolean;
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
