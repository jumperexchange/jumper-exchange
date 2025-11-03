import { MinimalDeFiPosition } from 'src/types/defi';
import { MinimalToken } from 'src/types/tokens';

export enum AssetOverviewCardView {
  Overview = 'overview',
  Tokens = 'tokens',
  DeFiPositions = 'defiPositions',
}

export interface AssetOverviewCardProps {
  tokens: MinimalToken[];
  defiPositions: MinimalDeFiPosition[];
  isLoading?: boolean;
}

export interface AssetOverviewCardOverviewProps
  extends AssetOverviewCardProps {}

export interface AssetOverviewCardTokensProps
  extends Pick<AssetOverviewCardProps, 'tokens'> {}

export interface AssetOverviewCardDeFiPositionsProps
  extends Pick<AssetOverviewCardProps, 'defiPositions'> {}
