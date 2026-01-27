import { createContext, useContext } from 'react';
import type {
  PortfolioPosition,
  PositionBalance,
  WalletPortfolioBalance,
  SummaryData,
  BalancesMetadata,
  PositionsMetadata,
} from './types';

export type {
  SummaryData,
  BalanceWithPercentage,
  PositionWithPercentage,
  BalancesByAddressSummary,
  PositionsByProtocolSummary,
  BalancesMetadata,
  PositionsMetadata,
} from './types';

export interface BalancesState {
  balances: Record<string, WalletPortfolioBalance[]>;
  balancesByAddress: Record<string, Record<string, WalletPortfolioBalance[]>>;
  metadata: BalancesMetadata;
  isLoading: boolean;
  error: Error | null;
  updatedAt: number | null;
  refetch: () => void;
  isEmpty: boolean;
}

export interface PositionsState {
  positions: PortfolioPosition[];
  positionsByAddress: Record<string, PortfolioPosition[]>;
  positionsByProtocolAndChain: Record<string, PortfolioPosition[]>;
  positionsByProtocol: Record<string, PortfolioPosition[]>;
  metadata: PositionsMetadata;
  lpTokens: (PositionBalance | undefined)[];
  isLoading: boolean;
  error: Error | null;
  updatedAt: number | null;
  refetch: () => void;
  isEmpty: boolean;
}

export interface PortfolioContextValue {
  balances: BalancesState;
  positions: PositionsState;
  summary: SummaryData;
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
  isLoading: false,
  error: null,
  updatedAt: null,
  refetch: () => {},
  isEmpty: true,
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
  isLoading: false,
  error: null,
  updatedAt: null,
  refetch: () => {},
  isEmpty: true,
};

const defaultSummaryState: SummaryData = {
  totalBalancesUsd: 0,
  totalPositionsUsd: 0,
  totalPortfolioUsd: 0,
  balancesByAddress: {},
  positionsByProtocol: {},
};

export const PortfolioContext = createContext<PortfolioContextValue>({
  balances: defaultBalancesState,
  positions: defaultPositionsState,
  summary: defaultSummaryState,
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
