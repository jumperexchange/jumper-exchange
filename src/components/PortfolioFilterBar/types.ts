import type { PortfolioFilterBarTab } from '@/app/ui/portfolio/types';

export interface PortfolioFilterViewBaseProps {
  isDisabled: boolean;
  value: PortfolioFilterBarTab;
  onChange: (value: PortfolioFilterBarTab) => void;
}
