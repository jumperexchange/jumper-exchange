import type { CacheToken } from 'src/types/portfolio';
import type { Chain } from 'src/types/jumper-backend';
import type { Account } from '@lifi/wallet-management';

export type PortfolioFilterBarTab = 'tokens' | 'defi-protocols';

export interface PortfolioFilteringParams {
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
