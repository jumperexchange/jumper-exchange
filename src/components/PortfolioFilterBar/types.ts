import type { SortByEnum } from '@/providers/PortfolioProvider/filtering/types';
import type { PortfolioFilterBarTab } from '../../app/ui/portfolio/PortfolioAssetsSection';

export interface PortfolioFilterViewBaseProps {
  isDisabled: boolean;
  value: PortfolioFilterBarTab;
  onChange: (value: PortfolioFilterBarTab) => void;
}

export interface BalancesPendingFilterValues {
  wallets: string[];
  chains: string[];
  assets: string[];
  value: number[];
  sortBy: SortByEnum;
}

export interface PositionsPendingFilterValues {
  chains: string[];
  protocols: string[];
  types: string[];
  assets: string[];
  value: number[];
  sortBy: SortByEnum;
}
