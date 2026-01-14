import { createContext, useContext } from 'react';
import type {
  PortfolioContextValue,
  PortfolioPositionsContextValue,
  PortfolioTokensContextValue,
} from './PortfolioContext.types';

const noop = () => {};

const defaultPositionsContextValue: PortfolioPositionsContextValue = {
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
  updatedAt: null,
  isLoading: false,
  isEmpty: true,
  error: null,
  refetch: noop,
};

const defaultTokensContextValue: PortfolioTokensContextValue = {
  tokens: [],
  tokensByAddress: {},
  accounts: [],
  metadata: {
    wallets: [],
    chains: [],
    assets: [],
    valueRange: { min: 0, max: 0 },
  },
  updatedAt: null,
  isLoading: false,
  isEmpty: true,
  error: null,
  round: 0,
  refetch: noop,
};

const defaultContextValue: PortfolioContextValue = {
  summary: {
    totalValueUSD: 0,
    formattedTotalValueUSD: '0',
    positionsValueUSD: 0,
    formattedPositionsValueUSD: '0',
    tokensValueUSD: 0,
    formattedTokensValueUSD: '0',
    positionsByProtocol: [],
    tokensBySymbol: [],
  },
  tokens: {
    ...defaultTokensContextValue,
  },
  positions: {
    ...defaultPositionsContextValue,
  },
  state: {
    isLoading: false,
    isLoadingTokens: false,
    isLoadingPositions: false,
    hasError: false,
    refetchAll: noop,
  },
  processors: {
    positions: () => defaultPositionsContextValue,
    tokens: () => defaultTokensContextValue,
  },
};

export const PortfolioContext =
  createContext<PortfolioContextValue>(defaultContextValue);

PortfolioContext.displayName = 'PortfolioContext';

export const usePortfolio = (): PortfolioContextValue => {
  return useContext(PortfolioContext);
};

export const usePortfolioTokens = () => {
  return useContext(PortfolioContext).tokens;
};

export const usePortfolioPositions = () => {
  return useContext(PortfolioContext).positions;
};

export const usePortfolioState = () => {
  return useContext(PortfolioContext).state;
};

export const usePortfolioSummary = () => {
  return useContext(PortfolioContext).summary;
};
