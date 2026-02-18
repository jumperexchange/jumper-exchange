// ─── PNL Data ────────────────────────────────────────────────────────────────

export interface PnLDataPoint {
  date: string;
  valueUsd: number;
  pnlUsd: number;
  pnlPercent: number;
}

export interface PnLSummary {
  currentValueUsd: number;
  costBasisUsd: number;
  totalPnlUsd: number;
  totalPnlPercent: number;
  realizedPnlUsd: number;
  unrealizedPnlUsd: number;
}

// ─── Timeframe ───────────────────────────────────────────────────────────────

export type PnLTimeframe = '24h' | '7d' | '30d' | '90d' | '1y' | 'all';

export interface PnLTimeframeSummary extends PnLSummary {
  timeframe: PnLTimeframe;
  startDate: string;
  endDate: string;
  highUsd: number;
  lowUsd: number;
}

// ─── Account Information ─────────────────────────────────────────────────────

export interface ChainBalance {
  chainId: number;
  chainKey: string;
  chainName: string;
  chainLogo?: string;
  balanceUsd: number;
  percentage: number;
  tokenCount: number;
}

export interface ProtocolSummary {
  name: string;
  logo?: string;
  valueUsd: number;
  percentage: number;
}

export interface DefiPositionsSummary {
  totalValueUsd: number;
  totalDebtUsd: number;
  netValueUsd: number;
  positionCount: number;
  protocolCount: number;
  topProtocols: ProtocolSummary[];
}

export interface PerformanceMetrics {
  bestDay: { date: string; pnlUsd: number; pnlPercent: number };
  worstDay: { date: string; pnlUsd: number; pnlPercent: number };
  winRate: number;
  maxDrawdown: number;
  sharpeRatio?: number;
  volatility?: number;
}

export interface AccountSummary {
  address: string;
  ensName?: string;
  totalBalanceUsd: number;
  chainBreakdown: ChainBalance[];
  defiPositionsSummary: DefiPositionsSummary;
  performance: PerformanceMetrics;
}

// ─── Combined State ──────────────────────────────────────────────────────────

export interface ProPortfolioData {
  accounts: AccountSummary[];
  aggregatedPnL: PnLTimeframeSummary;
  pnlHistory: PnLDataPoint[];
  selectedTimeframe: PnLTimeframe;
}
