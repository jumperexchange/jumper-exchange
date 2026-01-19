import type { PortfolioToken } from 'src/types/tokens';

export enum TokenListCardTokenSize {
  SM = 'sm',
  MD = 'md',
}

export interface TokenListCardProps {
  token: PortfolioToken;
  size?: TokenListCardTokenSize;
  onSelect?: (token: PortfolioToken) => void;
  shouldShowExpandedEndDivider?: boolean;
}
