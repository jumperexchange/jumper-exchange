import type { Account } from '@lifi/wallet-management';
import type { PortfolioTokenGroup } from './types/tokens';
import type {
  PortfolioDefiPosition,
  PortfolioDeFiPositionsGroup,
} from './types/positions';
import type { PortfolioSummary } from './types/summary';
import type { TokensMetadata, PositionsMetadata } from './types/metadata';

export interface PortfolioTokensContextValue {
  tokens: PortfolioTokenGroup[];
  tokensByAddress: Record<string, PortfolioTokenGroup[]>;
  tokensBySymbol: PortfolioTokenGroup[];
  tokensByChain: PortfolioTokenGroup[];
  accounts: Account[];
  metadata: TokensMetadata;
  updatedAt: number | null;
  isLoading: boolean;
  isEmpty: boolean;
  error: Error | null;
  round: number;
  refetch: () => void;
}

export interface PortfolioPositionsContextValue {
  positions: PortfolioDefiPosition[];
  positionsByAddress: Record<string, PortfolioDefiPosition[]>;
  positionsByProtocolAndChain: PortfolioDeFiPositionsGroup[];
  positionsByProtocol: PortfolioDeFiPositionsGroup[];
  metadata: PositionsMetadata;
  updatedAt: number | null;
  isLoading: boolean;
  isEmpty: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface PortfolioStateContextValue {
  isLoading: boolean;
  isLoadingTokens: boolean;
  isLoadingPositions: boolean;
  isLoadingPrices: boolean;
  hasFreshPrices: boolean;
  pricesUpdatedAt: number | null;
  hasError: boolean;
  refetchAll: () => void;
}

export type PortfolioSummaryContextValue = PortfolioSummary;

export interface PortfolioContextValue {
  tokens: PortfolioTokensContextValue;
  positions: PortfolioPositionsContextValue;
  state: PortfolioStateContextValue;
  summary: PortfolioSummaryContextValue;
}
