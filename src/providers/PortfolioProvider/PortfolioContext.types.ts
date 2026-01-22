import type {
  TokensMetadata,
  PositionsMetadata,
} from './utils/extractMetadata';
import type { Account } from '@lifi/wallet-management';
import type { PortfolioTokenGroup } from './types/PortfolioTokenGroup';
import type { PortfolioDefiPosition } from './types/PortfolioDefiPosition';
import type { PortfolioDeFiPositionsGroup } from './types/PortfolioDeFiPositionsGroup';
import type { PortfolioSummary } from './types/PortfolioSummary';

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
