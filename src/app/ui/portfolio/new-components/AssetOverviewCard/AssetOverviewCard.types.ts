import type { PortfolioPositionSummary } from '@/providers/PortfolioProvider/types/positions.types';
import type { PortfolioTokenSummary } from '@/providers/PortfolioProvider/types/tokens.types';
import type { Protocol } from '@/types/jumper-backend';

export enum AssetOverviewCardView {
  Overview = 'overview',
  Tokens = 'tokens',
  DeFiPositions = 'defiPositions',
}

export interface ProtocolGroupData {
  protocol: Protocol;
  totalPriceUSD: number;
}

export interface AssetOverviewCardProps {
  tokens: PortfolioTokenSummary[];
  tokensTotalValueUSD: number;
  positions: PortfolioPositionSummary[];
  positionsTotalValueUSD: number;
  isLoading?: boolean;
  showNoContent?: boolean;
}

export interface AssetOverviewCardOverviewProps {
  tokens: PortfolioTokenSummary[];
  tokensTotalValueUSD: number;
  positions: PortfolioPositionSummary[];
  positionsTotalValueUSD: number;
}

export interface AssetOverviewCardTokensProps extends Pick<
  AssetOverviewCardProps,
  'tokens'
> {
  totalValueUSD: number;
}

export interface AssetOverviewCardDeFiPositionsProps extends Pick<
  AssetOverviewCardProps,
  'positions'
> {
  totalValueUSD: number;
}
