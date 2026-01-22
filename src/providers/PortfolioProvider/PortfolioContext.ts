import { createContext, useContext } from 'react';
import type {
  PortfolioContextValue,
  PortfolioPositionsContextValue,
  PortfolioTokensContextValue,
} from './PortfolioContext.types';
import { PortfolioSummary } from './types/summary';

const noop = () => {};

const defaultSummary = new PortfolioSummary(0, 0, 0, [], []);

const defaultPositionsContextValue: PortfolioPositionsContextValue = {
  positions: [],
  positionsByAddress: {},
  positionsByProtocolAndChain: [],
  positionsByProtocol: [],
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
  tokensBySymbol: [],
  tokensByChain: [],
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
  summary: defaultSummary,
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
    isLoadingPrices: false,
    hasFreshPrices: false,
    pricesUpdatedAt: null,
    hasError: false,
    refetchAll: noop,
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
