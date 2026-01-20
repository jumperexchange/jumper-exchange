import type { PortfolioPositionsQuery } from '@/app/lib/getPositionsForAddress';
import type { DefiPosition } from '@/types/jumper-backend';
import type { PortfolioExtendedToken } from '../classes/PortfolioExtendedToken';
import type { PortfolioDeFiPositionsGroup } from '../classes/PortfolioDeFiPositionsGroup';

export interface PortfolioDefiPosition extends Omit<
  DefiPosition,
  | 'lpToken'
  | 'supplyTokens'
  | 'borrowTokens'
  | 'assetTokens'
  | 'collateralTokens'
  | 'rewardTokens'
> {
  lpToken?: PortfolioExtendedToken;
  supplyTokens: PortfolioExtendedToken[];
  borrowTokens: PortfolioExtendedToken[];
  assetTokens: PortfolioExtendedToken[];
  collateralTokens: PortfolioExtendedToken[];
  rewardTokens: PortfolioExtendedToken[];
}

export type { PortfolioDeFiPositionsGroup };

export type PortfolioPositionsQueryWithoutEvm = Omit<
  PortfolioPositionsQuery,
  'evm'
>;
