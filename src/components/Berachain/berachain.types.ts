import type { ChainId } from '@lifi/sdk';
import type { FaqProps } from 'src/components/AccordionFAQ';
import type { Quest } from 'src/types/loyaltyPass';

export interface BerachainQuest extends Quest {
  protocolInfos?: BerachainProtocolInfo;
}

export interface BerachainProtocolSocials {
  twitter: string;
  telegram: string;
  website?: string;
}
// Define interfaces for the nested structures
export interface BerachainMarketInfo {
  type: string;
  socials: BerachainProtocolSocials;
  faqItems: FaqProps[];
}

export interface BerachainApyToken {
  tokenAddress: string[];
  value: number;
}

export interface BerachainApys {
  total: number | string;
  tokens: BerachainApyToken[];
}

// Define the main interface for each market
export interface BerachainProtocolInfo {
  slug: string;
  chain: ChainId;
  tokens: string[];
  tvl: string;
  apys: BerachainApys;
}

export type BerachainProtocolType = 'Vault' | 'DEX' | 'Lending' | 'Staking';
