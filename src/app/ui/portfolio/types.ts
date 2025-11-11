import { CacheToken } from 'src/types/portfolio';
import { Chain } from 'src/types/jumper-backend';

export type PortfolioFilterBarTab = 'tokens' | 'defi-protocols';

export interface WalletInfo {
  address: string;
  connectorName: string; // e.g., "MetaMask", "Coinbase Wallet", etc.
  connector: any; // The connector object itself
}

export interface PortfolioFilteringParams {
  allWallets: WalletInfo[]; // Array of wallet info
  allChains: Chain[]; // Array of chains
  allAssets: CacheToken[]; // Array of unique tokens
  allValueRange: { min: number; max: number }; // Min and max values in USD
}

export interface PortfolioTokensFilter {
  wallets?: string[]; // Filter by wallet addresses (multiple selection)
  chains?: number[]; // Filter by chainIds
  assets?: string[]; // Filter by token addresses
  minValue?: number; // Minimum value in USD
  maxValue?: number; // Maximum value in USD
}

export interface PortfolioTokensFilterUI extends PortfolioTokensFilter {}
