// For now this is copied and pasted from the jumper-backend's zap.interface.ts
// TODO: Eventually share the types.

import { AbiFunction } from 'viem';

export enum Chain {
  ETHEREUM = 'ethereum',
  MODE = 'mode',
  BASE = 'base',
  OPTIMISM = 'optimism',
  HYPEREVM = 'hyperevm',
}

export enum Project {
  IONIC = 'ionic',
  HYPERWAVE = 'hyperwave',
}

export interface ZapData {
  chain: Chain;
  project: Project;
  address: string;
}

interface MarketEntry {
  address: `0x${string}`; // Identifier for strapi and default contract address
  contracts?: {
    [key: string]: `0x${string}`;
  };
  depositToken: {
    address: `0x${string}`;
    symbol: string;
    name: string;
    decimals: number;
    chainId: number;
    coinKey: string;
    logoURI: string;
  };
  lpToken: {
    symbol: string;
    decimals: number;
    name: string;
  };
}

export type MarketData = MarketEntry & {
  name: string;
};

export interface ABIData {
  // Contract is used when a flow has multiple contracts.
  approve: AbiEntry;
  deposit: AbiEntry;
  transfer: AbiEntry;
  [key: string]: AbiEntry;
}

export interface AbiEntry extends AbiFunction {
  contract?: string;
}

export interface ProjectMeta {
  name: string;
  logoURI: string;
}

interface TransactionDetails {
  txHash: `0x${string}`;
  txLink: string;
  amount: string;
  token: {
    priceUSD: string;
  };
  chainId: string;
  gasPrice: string;
  gasUsed: string;
  gasToken: any; // because ExtendedChain['nativeToken'] is inconsistent
  gasAmount: string;
  gasAmountUSD: string;
  amountUSD: string;
  value: string;
  timestamp: number;
  includedSteps?: any[];
}

export interface StatusDataResponse {
  transactionId: string;
  sending: TransactionDetails;
  receiving: TransactionDetails;
  feeCosts: null;
  lifiExplorerLink: string;
  fromAddress: string;
  toAddress: string;
  tool: null;
  status: string;
  substatus: string;
  substatusMessage: string;
  metadata: {
    integrator: null;
  };
}

export interface ZapAnalytics {
  base_apy: number;
  boosted_apy: number;
  total_apy: number;
  tvl_usd: number;
  lockup_period?: number;
}

export interface ZapDataResponse {
  market: MarketData | null; // TODO: could we drop the | null and return a 404 instead?
  meta: ProjectMeta;
  analytics: ZapAnalytics;
  abi: ABIData;
}
