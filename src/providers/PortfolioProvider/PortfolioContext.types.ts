import type { TokensMetadata, PositionsMetadata } from './pipeline/metadata';
import type { useTokensData } from './hooks/useTokensData';
import type { usePositionsData } from './hooks/usePositionsData';
import type { Account } from '@lifi/wallet-management';
import type { PortfolioTokenGroup } from './types/tokens.types';
import type {
  PortfolioDefiPosition,
  PortfolioDeFiPositionsGroup,
} from './types/positions.types';

export interface PortfolioTokensContextValue {
  /** Tokens grouped by symbol */
  tokens: PortfolioTokenGroup[];
  /** Tokens by wallet address, grouped by symbol */
  tokensByAddress: Record<string, PortfolioTokenGroup[]>;
  /** Tokens grouped by symbol (alias for tokens) */
  tokensBySymbol: PortfolioTokenGroup[];
  /** Tokens grouped by chain */
  tokensByChain: PortfolioTokenGroup[];
  /** Connected accounts */
  accounts: Account[];
  /** Metadata for filtering */
  metadata: TokensMetadata;
  /** Last update timestamp */
  updatedAt: number | null;
  /** Loading state */
  isLoading: boolean;
  /** Whether no tokens exist */
  isEmpty: boolean;
  /** Error if any */
  error: Error | null;
  /** Current fetch round */
  round: number;
  /** Refetch tokens */
  refetch: () => void;
}

export interface PortfolioPositionsContextValue {
  /** Normalized positions */
  positions: PortfolioDefiPosition[];
  /** Positions by wallet address */
  positionsByAddress: Record<string, PortfolioDefiPosition[]>;
  /** Positions grouped by protocol and chain */
  positionsByProtocolAndChain: PortfolioDeFiPositionsGroup[];
  /** Positions grouped by protocol */
  positionsByProtocol: PortfolioDeFiPositionsGroup[];
  /** Metadata for filtering */
  metadata: PositionsMetadata;
  /** Last update timestamp */
  updatedAt: number | null;
  /** Loading state */
  isLoading: boolean;
  /** Whether no positions exist */
  isEmpty: boolean;
  /** Error if any */
  error: Error | null;
  /** Refetch positions */
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

export interface PortfolioProcessors {
  positions: (
    rawData: ReturnType<typeof usePositionsData>,
  ) => PortfolioPositionsContextValue;
  tokens: (
    rawData: ReturnType<typeof useTokensData>,
  ) => PortfolioTokensContextValue;
}

export interface PortfolioSummaryContextValue {
  totalAmountUSD: number;
  positionsAmountUSD: number;
  tokensAmountUSD: number;
  positionsByProtocol: PortfolioDeFiPositionsGroup[];
  tokensBySymbol: PortfolioTokenGroup[];
}

export interface PortfolioContextValue {
  tokens: PortfolioTokensContextValue;
  positions: PortfolioPositionsContextValue;
  state: PortfolioStateContextValue;
  processors: PortfolioProcessors;
  summary: PortfolioSummaryContextValue;
}
