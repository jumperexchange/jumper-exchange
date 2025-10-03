// Types for sweep functionality matching backend DTOs

import { Hex } from 'viem';

export interface SweepableToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  amount: string;
  logoURI?: string;
}

export interface CheckSweepableTokensRequest {
  walletAddress: string;
  chainId?: number;
}

export interface CheckSweepableTokensResponse {
  data: {
    hasTokensToSweep: boolean;
    sweepableTokens: SweepableToken[];
    smartAccountAddress: string;
    targetChainId: number;
  };
}

export interface SweepQuoteRequest {
  walletAddress: string;
  chainId?: number;
}

export interface SweepQuoteResponse {
  data: {
    hasTokensToSweep: boolean;
    sweepableTokens: SweepableToken[];
    smartAccountAddress: string;
    targetChainId: number;
    quote: any; // Generated quote for frontend to execute
    transactionData: {
      message: {
        raw: Hex;
      };
    };
  };
}

export interface SweepExecuteRequest {
  walletAddress: Hex;
  chainId?: number;
  signedMessage: Hex; // The signed transaction message from the frontend
}

export interface SweepExecuteResponse {
  data: {
    transactionHash: string;
    smartAccountAddress: string;
    chainId: number;
    tokensSwept: number;
  };
}
