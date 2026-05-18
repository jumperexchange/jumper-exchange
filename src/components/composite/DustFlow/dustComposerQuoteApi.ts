import SuperJSON from 'superjson';
import type {
  ComposeResponseData,
  FailedOp,
} from '@/app/lib/lifi-composer-client';
import type { DustSummaryValue } from './types';

export class DustChainValidationError extends Error {
  chainId: number;
  constructor(message: string, chainId: number) {
    super(message);
    this.name = 'DustChainValidationError';
    this.chainId = chainId;
  }
}

export class DustPreparationError extends Error {
  failedOps: FailedOp[];
  succeededOps: string[];

  constructor(message: string, failedOps: FailedOp[], succeededOps: string[]) {
    super(message);
    this.name = 'DustPreparationError';
    this.failedOps = failedOps;
    this.succeededOps = succeededOps;
  }
}

export function extractFailedTokenAddresses(
  failedOps: FailedOp[],
): Set<string> {
  const addressRe = /0x[0-9a-fA-F]{40}/g;
  const addresses = new Set<string>();
  for (const op of failedOps) {
    const matches = op.message.match(addressRe);
    if (matches?.[0]) {
      addresses.add(matches[0].toLowerCase());
    }
  }
  return addresses;
}

export const DUST_COMPOSER_QUOTE_STALE_MS = 2 * 60 * 1000; // 2 minutes

export const DUST_COMPOSER_QUOTE_QUERY_KEY = ['dustComposerQuote'] as const;

export interface DustComposerQuoteParams {
  dustSummary: DustSummaryValue;
  slippage: number;
}

export function serializeDustComposerQuoteParams(
  params: DustComposerQuoteParams,
): string {
  return SuperJSON.stringify({
    chainId: params.dustSummary.nativeToken.chainId,
    address: params.dustSummary.address,
    slippage: params.slippage,
    balances: params.dustSummary.selectedBalances.map((b) => ({
      token: b.token.address,
      amount: b.amount,
    })),
  });
}

/** Single flow: dust ERC-20 positions on one chain to native on that chain. */
export async function fetchDustComposerQuote(
  params: DustComposerQuoteParams,
): Promise<ComposeResponseData> {
  const { dustSummary, slippage } = params;
  const chainId = dustSummary.nativeToken.chainId;
  const signer = dustSummary.address;
  const balances = dustSummary.selectedBalances;
  const inputNames = balances.map((b) => b.token.symbol.toLowerCase());

  const response = await fetch('/api/dust-quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      flow: {
        version: 1,
        id: 'dust-to-eth',
        chainId,
        inputs: balances.map((balance, i) => ({
          name: inputNames[i],
          resource: {
            kind: 'erc20' as const,
            token: balance.token.address,
            chainId,
          },
        })),
        nodes: balances.map((_balance, i) => ({
          id: `swap_${inputNames[i]}`,
          op: 'lifi.swap' as const,
          bind: { amountIn: { $ref: `input.${inputNames[i]}` } },
          config: {
            resourceOut: { kind: 'native' as const, chainId },
            slippage,
          },
        })),
      },
      run: {
        inputs: Object.fromEntries(
          balances.map((balance, i) => [
            inputNames[i],
            {
              kind: 'directDeposit' as const,
              amount: balance.amount.toString(),
            },
          ]),
        ),
        signer,
        sweepTo: signer,
        simulationPolicy: 'allow-revert',
        checkOnChainAllowances: true,
        maxPriceImpactBps: 1200,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Composer quote failed: ${response.status} ${response.statusText}`,
    );
  }

  const { data, success, error } = await response.json();

  if (!success) {
    if (error?.kind === 'chain_validation_error') {
      throw new DustChainValidationError(
        error.message ?? 'Chain not supported',
        chainId,
      );
    }
    if (
      error?.kind === 'preparation_error' &&
      error.failedOps?.length &&
      error.succeededOps?.length
    ) {
      throw new DustPreparationError(
        error.message ?? 'Partial preparation failure',
        error.failedOps,
        error.succeededOps,
      );
    }
    throw new Error(error?.message || 'Failed to fetch composer quote');
  }

  return data;
}
