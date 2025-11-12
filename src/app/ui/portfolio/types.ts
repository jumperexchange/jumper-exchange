import { CacheToken } from 'src/types/portfolio';
import { Chain } from 'src/types/jumper-backend';

export type PortfolioFilterBarTab = 'tokens' | 'defi-protocols';

export interface WalletInfo {
  address: string;
  connectorName: string;
  connector: any;
}

export interface PortfolioFilteringParams {
  allWallets: WalletInfo[];
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
