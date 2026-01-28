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

export type WithPercentage<T> = T & {
  percentage: number;
};

export interface BalancesByAddressSummary {
  balances: WithPercentage<WalletPortfolioBalance>[];
  totalUsd: number;
  percentage: number;
}

export interface PositionsByProtocolSummary {
  positions: WithPercentage<PortfolioPosition>[];
  totalUsd: number;
  percentage: number;
}

export interface SummaryData {
  totalBalancesUsd: number;
  totalPositionsUsd: number;
  totalPortfolioUsd: number;
  balancesBySymbol: Record<string, BalancesByAddressSummary>;
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

/**
 * Loading/freshness state for a single data source.
 */
export interface SourceState {
  isEmpty: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  isStale: boolean;
  updatedAt: number | null;
}

/**
 * Unified orchestration state for the portfolio.
 * Single source of truth for all loading/error/refresh states.
 */
export interface OrchestrationState {
  /** No data at all (balances + positions) */
  isEmpty: boolean;
  /** First load, no data yet */
  isInitialLoading: boolean;
  /** Has data, fetching updates in background */
  isRefreshing: boolean;
  /** Showing cached/placeholder data */
  isStale: boolean;
  /** Oldest timestamp across sources */
  updatedAt: number | null;
  /** First error encountered from any source */
  error: Error | null;
  /** Granular per-source states */
  sources: {
    balances: SourceState;
    positions: SourceState;
    prices: SourceState;
  };
  /** Refresh all data sources */
  refresh: () => void;
}
