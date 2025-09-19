// Types for sweep functionality matching backend DTOs

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
  };
}

export interface SweepExecuteRequest {
  walletAddress: string;
  chainId?: number;
  signedQuote: any; // The signed quote from the frontend
}

export interface SweepExecuteResponse {
  transactionHash: string;
  smartAccountAddress: string;
  chainId: number;
  tokensSwept: number;
}
