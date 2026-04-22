// Same-chain LI.FI quote for the loan-token → collateral-token leg of the
// flash-loan bundle. Both `fromAddress` and `toAddress` are set to our
// `LoopoorSwapAdapter` — the adapter will be the caller of LI.FI (so its
// `transferFrom(msg.sender, …)` path works) and will receive the output,
// which it then sweeps to GeneralAdapter1.

import type { Address, Hex } from 'viem';
import { LIFI_BASE_URL, LOOPOOR_INTEGRATOR } from './constants';

export type LifiQuoteTransactionRequest = {
  from: Address;
  to: Address;
  chainId: number;
  data: Hex;
  value: Hex;
  gasPrice?: Hex;
  gasLimit?: Hex;
};

export type LifiQuote = {
  transactionRequest: LifiQuoteTransactionRequest;
  estimate: {
    fromAmount: string;
    toAmount: string;
    toAmountMin: string;
    approvalAddress: Address;
    executionDuration?: number;
  };
  action: {
    fromChainId: number;
    toChainId: number;
    slippage: number;
    fromToken: { address: Address };
    toToken: { address: Address };
  };
  tool: string;
};

export type FetchLoopoorLifiQuoteInput = {
  chainId: number;
  loanToken: Address;
  collateralToken: Address;
  flashLoanAmount: bigint;
  adapter: Address;
  slippage: number;
  integrator?: string;
  apiKey?: string;
};

export async function fetchLoopoorLifiQuote(
  input: FetchLoopoorLifiQuoteInput,
  fetchImpl: typeof fetch = fetch,
): Promise<LifiQuote> {
  const {
    chainId,
    loanToken,
    collateralToken,
    flashLoanAmount,
    adapter,
    slippage,
    integrator = LOOPOOR_INTEGRATOR,
    apiKey,
  } = input;

  const qs = new URLSearchParams({
    fromChain: chainId.toString(),
    toChain: chainId.toString(),
    fromToken: loanToken,
    toToken: collateralToken,
    fromAmount: flashLoanAmount.toString(),
    fromAddress: adapter,
    toAddress: adapter,
    slippage: slippage.toString(),
    integrator,
    denyBridges: 'all',
    order: 'CHEAPEST',
  });

  const url = `${LIFI_BASE_URL}/v1/quote?${qs.toString()}`;
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers['x-lifi-api-key'] = apiKey;
  }

  const res = await fetchImpl(url, { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Loopoor: LI.FI quote failed ${res.status}: ${text}`);
  }
  const quote = (await res.json()) as LifiQuote;
  assertLoopoorQuote(quote, { chainId, loanToken, collateralToken });
  return quote;
}

export function assertLoopoorQuote(
  quote: LifiQuote,
  expected: { chainId: number; loanToken: Address; collateralToken: Address },
): void {
  const { chainId, loanToken, collateralToken } = expected;
  const problems: string[] = [];

  if (quote.action?.fromChainId !== chainId) {
    problems.push(`fromChainId=${quote.action?.fromChainId} want ${chainId}`);
  }
  if (quote.action?.toChainId !== chainId) {
    problems.push(`toChainId=${quote.action?.toChainId} want ${chainId}`);
  }
  if (
    quote.action?.fromToken?.address?.toLowerCase() !== loanToken.toLowerCase()
  ) {
    problems.push(
      `fromToken=${quote.action?.fromToken?.address} want ${loanToken}`,
    );
  }
  if (
    quote.action?.toToken?.address?.toLowerCase() !==
    collateralToken.toLowerCase()
  ) {
    problems.push(
      `toToken=${quote.action?.toToken?.address} want ${collateralToken}`,
    );
  }
  if (!quote.transactionRequest?.to || !quote.transactionRequest?.data) {
    problems.push('missing transactionRequest.{to,data}');
  }
  if (!quote.estimate?.approvalAddress) {
    problems.push('missing estimate.approvalAddress');
  }

  if (problems.length > 0) {
    throw new Error(
      `Loopoor: LI.FI returned an unexpected quote: ${problems.join('; ')}`,
    );
  }
}
