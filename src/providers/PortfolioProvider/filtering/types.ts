import type { PositionToken, WalletToken } from '@/types/tokens';

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

export interface HoldingsFilteringParams {
  allWallets: string[];
  allChains: number[];
  allAssets: (WalletToken | PositionToken)[];
  allValueRange: { min: number; max: number };
}

export interface HoldingsFilter {
  wallets?: string[];
  chains?: number[];
  assets?: string[];
  minValue?: number;
  maxValue?: number;
}

export interface HoldingsFilterUI extends HoldingsFilter {}
