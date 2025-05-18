export interface Token {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
  name: string;
  coinKey: string;
  logoURI: string;
  priceUSD: string;
}

export interface ToolDetails {
  key: string;
  name: string;
  logoURI: string;
  webUrl: string;
}

export interface IncludedStep {
  tool: string;
  toolDetails: ToolDetails;
  fromAmount: string;
  fromToken: Token;
  toToken: Token;
  toAmount: string;
  bridgedAmount: string | null;
}

export interface TransactionDetails {
  txHash: string;
  txLink: string;
  token: Token;
  chainId: number;
  gasPrice: string;
  gasUsed: string;
  gasToken: Token;
  gasAmount: string;
  gasAmountUSD: string;
  amountUSD: string;
  value: string;
  includedSteps?: IncludedStep[];
  amount: string;
  timestamp: number;
}

export interface Transfer {
  transactionId: string;
  sending: TransactionDetails;
  receiving: TransactionDetails;
  lifiExplorerLink: string;
  fromAddress: string;
  toAddress: string;
  tool: string;
  status: 'DONE' | 'PENDING' | 'FAILED'; // Add other statuses if needed
  substatus: 'COMPLETED' | string; // Add other substatuses if needed
  substatusMessage: string;
  metadata: {
    integrator: string;
  };
  feeCosts: any[]; // Replace with specific type if fee cost structure is known
}

export interface TransferResponse {
  transfers: Transfer[];
}
