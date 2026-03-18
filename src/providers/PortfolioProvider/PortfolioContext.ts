import { createContext, useContext } from 'react';
import type {
  PortfolioPosition,
  SummaryData,
  BalancesMetadata,
  PositionsMetadata,
  OrchestrationState,
  SourceState,
} from './types';
import type {
  PortfolioBalance,
  PositionToken,
  WalletToken,
} from '@/types/tokens';

export interface BalancesState {
  balances: Record<string, PortfolioBalance<WalletToken>[]>;
  balancesByAddress: Record<
    string,
    Record<string, PortfolioBalance<WalletToken>[]>
  >;
  metadata: BalancesMetadata;
}

export interface PositionsState {
  positions: PortfolioPosition[];
  positionsByAddress: Record<string, PortfolioPosition[]>;
  positionsByProtocolAndChain: Record<string, PortfolioPosition[]>;
  positionsByProtocol: Record<string, PortfolioPosition[]>;
  metadata: PositionsMetadata;
  lpTokens: (PortfolioBalance<PositionToken> | undefined)[];
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
  balancesBySymbol: {},
  positionsByProtocol: {},
};

const defaultSourceState: SourceState = {
  isEmpty: true,
  isLoading: false,
  isSuccess: true,
  isRefreshing: false,
  isStale: false,
  updatedAt: null,
  error: null,
};

const defaultOrchestrationState: OrchestrationState = {
  isEmpty: true,
  isInitialLoading: false,
  isRefreshing: false,
  isStale: false,
  isSuccess: true,
  updatedAt: null,
  error: null,
  sources: {
    balances: defaultSourceState,
    balancesByAddress: {},
    positions: defaultSourceState,
    prices: defaultSourceState,
  },
  refresh: () => {},
  refreshByAddress: () => {},
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
