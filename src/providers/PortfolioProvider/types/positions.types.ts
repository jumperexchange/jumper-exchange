import type { PortfolioPositionsQuery } from '@/app/lib/getPositionsForAddress';
import type { Chain, DefiPosition, Protocol } from '@/types/jumper-backend';

/**
 * Position enriched with fresh price calculations.
 * Used internally during pipeline processing and inside PortfolioPosition groups.
 */
export interface EnrichedPosition extends DefiPosition {
  hasFreshPrices: boolean;
}

/**
 * Positions organized by protocol-chain key.
 * Key format: "${protocol.name}-${chain.chainKey}"
 */
export type PositionsByProtocolChain = Record<string, EnrichedPosition[]>;

/**
 * Positions organized by protocol name.
 */
export type PositionsByProtocol = Record<string, EnrichedPosition[]>;

/**
 * Final display entity: A group of positions for the Portfolio UI.
 * Groups positions by protocol and chain for display.
 */
export interface PortfolioPosition {
  key: string;
  protocol: Protocol;
  chain: Chain;
  positions: EnrichedPosition[];
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
  amountUSD: number;
  percentageOfTotalAmountUSD: number;
}

export type PortfolioPositionsQueryWithoutEvm = Omit<
  PortfolioPositionsQuery,
  'evm'
>;
