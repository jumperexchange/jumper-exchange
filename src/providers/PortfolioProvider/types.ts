import type {
  PortfolioBalance as GenericPortfolioBalance,
  PositionToken,
  TokenBalance,
} from '@/types/tokens';
import type { App, Chain } from '@/types/jumper-backend';
import type { DefiPosition } from '@/utils/positions/type-guards';

/**
 * Balance for wallet tokens (from LiFi) with USD value.
 */
export interface WalletPortfolioBalance extends TokenBalance {
  amountUSD: number;
}

/**
 * Balance for position tokens (from backend) with USD value.
 * Uses PositionToken which preserves chain/app info.
 */
export type PositionBalance = GenericPortfolioBalance<PositionToken>;

/**
 * Position with all token arrays converted to PositionBalance format.
 */
export type PortfolioPosition = Omit<
  DefiPosition,
  | 'lpToken'
  | 'assetTokens'
  | 'borrowTokens'
  | 'collateralTokens'
  | 'rewardTokens'
  | 'supplyTokens'
> & {
  lpToken?: PositionBalance;
  supplyTokens: PositionBalance[];
  borrowTokens: PositionBalance[];
  assetTokens: PositionBalance[];
  collateralTokens: PositionBalance[];
  rewardTokens: PositionBalance[];
};

/**
 * Narrowed PortfolioPosition types for type guards.
 * These restore the discriminated union behavior lost by Omit.
 */
export type ChainPortfolioPosition = PortfolioPosition & {
  source: 'chain';
  chain: Chain;
};

export type AppPortfolioPosition = PortfolioPosition & {
  source: 'app';
  app: App;
};

export interface BalanceWithPercentage extends WalletPortfolioBalance {
  percentage: number;
}

export interface PositionWithPercentage extends PortfolioPosition {
  percentage: number;
}

export interface BalancesByAddressSummary {
  balances: BalanceWithPercentage[];
  totalUsd: number;
  percentage: number;
}

export interface PositionsByProtocolSummary {
  positions: PositionWithPercentage[];
  totalUsd: number;
  percentage: number;
}

export interface SummaryData {
  totalBalancesUsd: number;
  totalPositionsUsd: number;
  totalPortfolioUsd: number;
  balancesByAddress: Record<string, BalancesByAddressSummary>;
  positionsByProtocol: Record<string, PositionsByProtocolSummary>;
}

export interface BalancesMetadata {
  wallets: string[];
  chains: number[];
  assets: string[];
  valueRange: { min: number; max: number };
}

export interface PositionsMetadata {
  chains: number[];
  protocols: string[];
  types: string[];
  assets: string[];
  valueRange: { min: number; max: number };
}
