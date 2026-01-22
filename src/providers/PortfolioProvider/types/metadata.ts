import type { Chain, Protocol, Token } from '@/types/jumper-backend';
import type { PortfolioAccount } from './common';

export interface TokensMetadata {
  wallets: PortfolioAccount[];
  chains: Chain[];
  assets: Token[];
  valueRange: { min: number; max: number };
}

export interface PositionsMetadata {
  chains: Chain[];
  protocols: Protocol[];
  types: string[];
  assets: Token[];
  valueRange: { min: number; max: number };
}
