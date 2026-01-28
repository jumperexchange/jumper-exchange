import { createContext, useContext } from 'react';
import type {
  PortfolioPosition,
  PositionBalance,
  WalletPortfolioBalance,
  SummaryData,
  BalancesMetadata,
  PositionsMetadata,
  OrchestrationState,
  SourceState,
} from './types';

export type {
  SummaryData,
  BalanceWithPercentage,
  PositionWithPercentage,
  BalancesByAddressSummary,
  PositionsByProtocolSummary,
  BalancesMetadata,
  PositionsMetadata,
  OrchestrationState,
  SourceState,
} from './types';

export interface BalancesState {
  balances: Record<string, WalletPortfolioBalance[]>;
  balancesByAddress: Record<string, Record<string, WalletPortfolioBalance[]>>;
  metadata: BalancesMetadata;
}

export interface PositionsState {
  positions: PortfolioPosition[];
  positionsByAddress: Record<string, PortfolioPosition[]>;
  positionsByProtocolAndChain: Record<string, PortfolioPosition[]>;
  positionsByProtocol: Record<string, PortfolioPosition[]>;
  metadata: PositionsMetadata;
  lpTokens: (PositionBalance | undefined)[];
}

export interface PortfolioContextValue {
  balances: BalancesState;
  positions: PositionsState;
  summary: SummaryData;
  state: OrchestrationState;
}

const defaultBalancesState: BalancesState = {
  balances: {},
  balancesByAddress: {},
  metadata: {
    wallets: [],
    chains: [],
    assets: [],
    valueRange: { min: 0, max: 0 },
  },
};

const defaultPositionsState: PositionsState = {
  positions: [],
  positionsByAddress: {},
  positionsByProtocolAndChain: {},
  positionsByProtocol: {},
  metadata: {
    chains: [],
    protocols: [],
    types: [],
    assets: [],
    valueRange: { min: 0, max: 0 },
  },
  lpTokens: [],
};

const defaultSummaryState: SummaryData = {
  totalBalancesUsd: 0,
  totalPositionsUsd: 0,
  totalPortfolioUsd: 0,
  balancesByAddress: {},
  positionsByProtocol: {},
};

const defaultSourceState: SourceState = {
  isEmpty: true,
  isLoading: false,
  isRefreshing: false,
  isStale: false,
  updatedAt: null,
};

const defaultOrchestrationState: OrchestrationState = {
  isEmpty: true,
  isInitialLoading: false,
  isRefreshing: false,
  isStale: false,
  updatedAt: null,
  error: null,
  sources: {
    balances: defaultSourceState,
    positions: defaultSourceState,
    prices: defaultSourceState,
  },
  refresh: () => {},
};

export const PortfolioContext = createContext<PortfolioContextValue>({
  balances: defaultBalancesState,
  positions: defaultPositionsState,
  summary: defaultSummaryState,
  state: defaultOrchestrationState,
});

export const usePortfolio = () => useContext(PortfolioContext);

export const usePortfolioBalances = () => {
  const { balances } = usePortfolio();
  return balances;
};

export const usePortfolioPositions = () => {
  const { positions } = usePortfolio();
  return positions;
};

export const usePortfolioSummary = () => {
  const { summary } = usePortfolio();
  return summary;
};

export const usePortfolioState = () => {
  const { state } = usePortfolio();
  return state;
};
