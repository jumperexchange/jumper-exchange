import { useQuery } from '@tanstack/react-query';

interface Token {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
  name: string;
  coinKey: string;
  logoURI: string;
  priceUSD: string;
}

interface ToolDetails {
  key: string;
  name: string;
  logoURI: string;
  webUrl: string;
}

interface IncludedStep {
  tool: string;
  toolDetails: ToolDetails;
  fromAmount: string;
  fromToken: Token;
  toToken: Token;
  toAmount: string;
  bridgedAmount: string | null;
}

interface TransactionDetails {
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
  status: string;
  substatus: string;
  substatusMessage: string;
  metadata: {
    integrator: string;
  };
  feeCosts: any[];
}

interface TransferResponse {
  transfers: Transfer[];
}

export interface TxHistoryProps {
  data: TransferResponse | null;
  total: number;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export async function getTxHistoryQuery(walletAddress?: string) {
  if (!walletAddress) {
    return;
  }

  const toTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const fromTimestamp = toTimestamp - 30 * 24 * 60 * 60; // 30 days ago in seconds

  const integrator = 'dev.jumper.exchange';

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_LIFI_API_URL}/analytics/transfers?integrator=${integrator}&wallet=${walletAddress}&fromTimestamp=${fromTimestamp}&toTimestamp=${toTimestamp}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch transfers');
  }

  return response.json();
}

export const useTxHistory = (
  walletAddress?: string,
  completedRouteId?: string,
): TxHistoryProps => {
  const {
    data: transfers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['transfers', walletAddress, completedRouteId],
    queryFn: () => getTxHistoryQuery(walletAddress),
    enabled: !!walletAddress,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes
  });

  return {
    data: transfers || null,
    total: transfers?.transfers.length || 0,
    isLoading,
    isError,
    error,
  };
};
