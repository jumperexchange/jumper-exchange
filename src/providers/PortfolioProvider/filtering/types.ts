import type { Chain, Protocol, Token } from '@/types/jumper-backend';
import type { PortfolioAccount } from '../types/common';

export enum PortfolioFilterBarTab {
  TOKENS = 'tokens',
  DEFI_PROTOCOLS = 'defi-protocols',
}

export type SortByType = 'value' | 'chain' | 'asset';

export const SortByOptions = {
  VALUE: 'value',
  CHAIN: 'chain',
  ASSET: 'asset',
} as const satisfies Record<string, SortByType>;

type OrderType = 'asc' | 'desc';

export const OrderOptions = {
  ASC: 'asc',
  DESC: 'desc',
} as const satisfies Record<string, OrderType>;

export type OrderEnum = (typeof OrderOptions)[keyof typeof OrderOptions];

export type SortByEnum = (typeof SortByOptions)[keyof typeof SortByOptions];

export interface PortfolioTokensFilteringParams {
  allWallets: PortfolioAccount[];
  allChains: Chain[];
  allAssets: Token[];
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
  allValueRange: { min: number; max: number };
}

export interface PortfolioDeFiPositionsFilter {
  defiChains?: number[];
  defiProtocols?: string[];
  defiTypes?: string[];
  defiAssets?: string[];
  defiMinValue?: number;
  defiMaxValue?: number;
}

export interface PortfolioDeFiPositionsFilterUI extends PortfolioDeFiPositionsFilter {}
