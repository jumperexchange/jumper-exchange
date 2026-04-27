import SuperJSON from 'superjson';
import { makeLifiComposerClient } from '@/app/lib/lifi-composer-client';
import type { ComposeResponseData } from '@/app/lib/lifi-composer-client';
import type { DustSummaryValue } from './types';

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
  const client = makeLifiComposerClient();
  const { dustSummary, slippage } = params;
  const chainId = dustSummary.nativeToken.chainId;
  const signer = dustSummary.address;
  const balances = dustSummary.selectedBalances;
  const inputNames = balances.map((b) => b.token.symbol.toLowerCase());

  const { data, success, error } = await client.compose({
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
  });

  if (!success) {
    throw new Error(error?.message || 'Failed to fetch composer quote');
  }

  return data;
}
