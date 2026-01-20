import type { PortfolioToken } from '@/types/tokens';
import type { TokensMetadata, PositionsMetadata } from './pipeline/metadata';
import type { useTokensData } from './hooks/useTokensData';
import type { usePositionsData } from './hooks/usePositionsData';
import type {
  PortfolioAccount,
  PortfolioTokenSummary,
} from './types/tokens.types';
import type {
  PortfolioPosition,
  PositionsByProtocol,
  PositionsByProtocolChain,
  PortfolioPositionSummary,
} from './types/positions.types';

export interface PortfolioTokensContextValue {
  /** Display-ready tokens (grouped by symbol with relatedTokens) */
  tokens: PortfolioToken[];
  /** Raw tokens by wallet address */
  tokensByAddress: Record<string, PortfolioToken[]>;
  /** Connected accounts */
  accounts: PortfolioAccount[];
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
  /** Display-ready positions (grouped by protocol and chain) */
  positions: PortfolioPosition[];
  /** Positions by wallet address */
  positionsByAddress: Record<string, PortfolioPosition[]>;
  /** Positions grouped by protocol and chain (for filtering) */
  positionsByProtocolAndChain: PositionsByProtocolChain;
  /** Positions grouped by protocol (for summary) */
  positionsByProtocol: PositionsByProtocol;
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
  totalValueUSD: number;
  formattedTotalValueUSD: string;
  positionsValueUSD: number;
  formattedPositionsValueUSD: string;
  tokensValueUSD: number;
  formattedTokensValueUSD: string;
  positionsByProtocol: PortfolioPositionSummary[];
  tokensBySymbol: PortfolioTokenSummary[];
}

export interface PortfolioContextValue {
  tokens: PortfolioTokensContextValue;
  positions: PortfolioPositionsContextValue;
  state: PortfolioStateContextValue;
  processors: PortfolioProcessors;
  summary: PortfolioSummaryContextValue;
}
