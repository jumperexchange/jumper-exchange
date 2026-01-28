import type { PortfolioFilterBarTab } from '../PortfolioAssetsSection';

export interface PortfolioFilterViewBaseProps {
  isDisabled: boolean;
  value: PortfolioFilterBarTab;
  onChange: (value: PortfolioFilterBarTab) => void;
}
