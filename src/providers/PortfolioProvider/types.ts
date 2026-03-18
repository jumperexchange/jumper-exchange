import type {
  PortfolioBalance,
  PositionToken,
  WalletToken,
} from '@/types/tokens';
import type { App, Chain, Protocol } from '@/types/jumper-backend';
import type { DefiPosition } from '@/utils/positions/type-guards';

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
  lpToken?: PortfolioBalance<PositionToken>;
  supplyTokens: PortfolioBalance<PositionToken>[];
  borrowTokens: PortfolioBalance<PositionToken>[];
  assetTokens: PortfolioBalance<PositionToken>[];
  collateralTokens: PortfolioBalance<PositionToken>[];
  rewardTokens: PortfolioBalance<PositionToken>[];
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
  balances: WithPercentage<PortfolioBalance<WalletToken>>[];
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
  assets: WalletToken[];
  valueRange: { min: number; max: number };
}

export interface PositionsMetadata {
  chains: number[];
  protocols: Protocol[];
  types: string[];
  assets: PositionToken[];
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
  isSuccess: boolean;
  updatedAt: number | null;
  error: Error | null;
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
  /** Query has been executed successfully */
  isSuccess: boolean;
  /** Oldest timestamp across sources */
  updatedAt: number | null;
  /** First error encountered from any source */
  error: Error | null;
  /** Granular per-source states */
  sources: {
    balances: SourceState;
    balancesByAddress: Record<string, SourceState>;
    positions: SourceState;
    prices: SourceState;
  };
  /** Refresh all data sources */
  refresh: () => void;

  /** Refresh data source by address */
  refreshByAddress: (address: string) => void;
}
