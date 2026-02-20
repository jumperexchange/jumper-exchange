import type { PortfolioFilterBarTab } from '../../app/ui/portfolio/PortfolioAssetsSection';

export interface PortfolioFilterViewBaseProps {
  isDisabled: boolean;
  value: PortfolioFilterBarTab;
  onChange: (value: PortfolioFilterBarTab) => void;
}
