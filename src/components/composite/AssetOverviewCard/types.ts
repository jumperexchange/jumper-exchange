import type { SummaryData } from '@/providers/PortfolioProvider/types';
import type { Protocol } from '@/types/jumper-backend';
import type { WalletToken } from '@/types/tokens';

export enum AssetOverviewCardView {
  Overview = 'overview',
  Tokens = 'tokens',
  DeFiPositions = 'defiPositions',
}

export interface TokenSummary {
  token: WalletToken;
  totalUsd: number;
  percentage: number;
}

export interface ProtocolSummary {
  protocol: Protocol;
  totalUsd: number;
  percentage: number;
}

export interface AssetOverviewCardProps {
  summaryData: SummaryData;
  isLoading?: boolean;
  showNoContent?: boolean;
}

export interface AssetOverviewCardOverviewProps {
  tokenSummaries: TokenSummary[];
  protocolSummaries: ProtocolSummary[];
  totalBalancesUsd: number;
  totalPositionsUsd: number;
}

export interface AssetOverviewCardTokensProps {
  tokenSummaries: TokenSummary[];
}

export interface AssetOverviewCardPositionsProps {
  protocolSummaries: ProtocolSummary[];
}
