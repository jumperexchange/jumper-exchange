import type { DefiPosition, Protocol } from 'src/types/jumper-backend';
import type { PortfolioToken } from 'src/types/tokens';

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
  tokens: PortfolioToken[];
  defiPositionGroups: DefiPosition[][];
  isLoading?: boolean;
  showNoContent?: boolean;
}

export interface AssetOverviewCardOverviewProps {
  tokens: PortfolioToken[];
  protocolGroups: ProtocolGroupData[];
}

export interface AssetOverviewCardTokensProps extends Pick<
  AssetOverviewCardProps,
  'tokens'
> {}

export interface AssetOverviewCardDeFiPositionsProps {
  protocolGroups: ProtocolGroupData[];
}
