import type { PortfolioPositionsQuery } from '@/app/lib/getPositionsForAddress';
import type { Chain, DefiPosition, Protocol } from '@/types/jumper-backend';

/** Position augmented with fresh prices */
export interface AugmentedPosition extends DefiPosition {
  hasFreshPrices: boolean;
}

/**
 * Portfolio position - the final display type for DeFi positions.
 * Alias for AugmentedPosition since no further transformation is needed.
 */
export type PortfolioPosition = AugmentedPosition;

/**
 * A group of positions sharing the same protocol and chain.
 * Used for display in the portfolio UI.
 */
export interface PositionGroup {
  /** Unique key for the group: "${protocol.name}-${chain.chainKey}" */
  key: string;
  /** The protocol these positions belong to */
  protocol: Protocol;
  /** The chain these positions are on */
  chain: Chain;
  /** Positions within this group */
  positions: PortfolioPosition[];
  /** Total net USD value of all positions in the group */
  totalNetUsd: number;
}

/**
 * Summary data for a position group (e.g., grouped by protocol).
 */
export interface PortfolioPositionSummary extends Omit<
  DefiPosition,
  | 'supplyTokens'
  | 'borrowTokens'
  | 'assetTokens'
  | 'collateralTokens'
  | 'rewardTokens'
> {
  totalValueUSD: number;
  formattedTotalValueUSD: string;
  percentageOfTotalValueUSD: number;
}

export type PortfolioPositionsQueryWithoutEvm = Omit<
  PortfolioPositionsQuery,
  'evm'
>;
