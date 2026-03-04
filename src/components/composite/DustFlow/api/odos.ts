export interface OdosRouterResponse {
  deprecated?: string;
  traceId?: string;
  address: string;
}

export async function fetchOdosRouter(
  chainId: number,
): Promise<OdosRouterResponse> {
  const res = await fetch(`/api/odos/router/v3/${chainId}`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { error?: string }).error ??
        `Odos router fetch failed: ${res.status}`,
    );
  }
  return res.json() as Promise<OdosRouterResponse>;
}

export interface OdosQuoteInputToken {
  tokenAddress: string;
  amount: string;
}

export interface OdosQuoteOutputToken {
  tokenAddress: string;
  proportion: number;
}

export interface OdosQuoteRequest {
  chainId: number;
  inputTokens: OdosQuoteInputToken[];
  outputTokens: OdosQuoteOutputToken[];
  userAddr: string;
  slippageLimitPercent?: number;
  pathVizImage?: boolean;
  simple?: boolean;
  compact?: boolean;
}

export interface OdosQuoteResponse {
  pathId: string;
  gasEstimate?: number;
  gasEstimateValue?: number;
  priceImpact?: number;
  percentDiff?: number;
  outAmounts?: string[];
  outValues?: number[];
  netOutValue?: number;
  inTokens?: string[];
  inAmounts?: string[];
  inValues?: number[];
}

export async function fetchOdosQuote(
  body: OdosQuoteRequest,
): Promise<OdosQuoteResponse> {
  const res = await fetch('/api/odos/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { error?: string }).error ?? `Odos quote failed: ${res.status}`,
    );
  }
  return res.json() as Promise<OdosQuoteResponse>;
}

export interface OdosAssembleRequest {
  pathId: string;
  userAddr: string;
  simulate?: boolean;
  receiver?: string;
}

export interface OdosAssembleTransaction {
  chainId: number;
  to: string;
  from: string;
  data: string;
  value: string;
  gas?: number;
  gasPrice?: string;
  nonce?: number;
}

export interface OdosAssembleResponse {
  transaction: OdosAssembleTransaction;
  blockNumber?: number;
  gasEstimate?: number;
  simulation?: {
    isSuccess: boolean;
    simulationError: { type: 'string'; errorMessage: 'string' };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export async function fetchOdosAssemble(
  body: OdosAssembleRequest,
): Promise<OdosAssembleResponse> {
  const res = await fetch('/api/odos/assemble', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { error?: string }).error ??
        `Odos assemble failed: ${res.status}`,
    );
  }
  return res.json() as Promise<OdosAssembleResponse>;
}
