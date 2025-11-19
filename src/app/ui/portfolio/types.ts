import type { CacheToken } from 'src/types/portfolio';
import type { Chain, Protocol, Token } from 'src/types/jumper-backend';
import type { Account } from '@lifi/wallet-management';

export type PortfolioFilterBarTab = 'tokens' | 'defi-protocols';

export interface PortfolioTokensFilteringParams {
  allWallets: (Omit<Account, 'address'> & { address: string })[];
  allChains: Chain[];
  allAssets: CacheToken[];
  allValueRange: { min: number; max: number };
}

export interface PortfolioTokensFilter {
  tokensWallets?: string[];
  tokensChains?: number[];
  tokensAssets?: string[];
  tokensMinValue?: number;
  tokensMaxValue?: number;
}

export interface PortfolioTokensFilterUI extends PortfolioTokensFilter {}

export interface PortfolioDeFiPositionsFilteringParams {
  allChains: Chain[];
  allProtocols: Protocol[];
  allTypes: string[];
  allAssets: Token[];
  allAPYRange: { min: number; max: number };
  allValueRange: { min: number; max: number };
}

export interface PortfolioDeFiPositionsFilter {
  defiChains?: number[];
  defiProtocols?: string[];
  defiTypes?: string[];
  defiAssets?: string[];
  defiMinAPY?: number;
  defiMaxAPY?: number;
  defiMinValue?: number;
  defiMaxValue?: number;
}

export interface PortfolioDeFiPositionsFilterUI
  extends PortfolioDeFiPositionsFilter {}
