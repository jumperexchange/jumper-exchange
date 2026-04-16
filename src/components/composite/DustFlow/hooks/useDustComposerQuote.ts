import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import SuperJSON from 'superjson';
import { makeLifiComposerClient } from '@/app/lib/lifi-composer-client';
import type { ComposeResponseData } from '@/app/lib/lifi-composer-client';
import type { DustSummaryValue } from './useDustFormFields';

const DUST_COMPOSER_QUOTE_STALE_MS = 2 * 60 * 1000; // 2 minutes
const DUST_COMPOSER_QUOTE_QUERY_KEY = ['dustComposerQuote'] as const;

interface ComposerQuoteParams {
  dustSummary: DustSummaryValue;
  slippage: number;
}

function serializeParams(params: ComposerQuoteParams): string {
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

async function fetchComposerQuote(
  params: ComposerQuoteParams,
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

export const useDustComposerQuote = () => {
  const queryClient = useQueryClient();
  const [requestParams, setRequestParams] =
    useState<ComposerQuoteParams | null>(null);

  const fetchComposerQuoteAsync = useCallback(
    (
      dustSummary: DustSummaryValue,
      slippage: number,
    ): Promise<ComposeResponseData> => {
      const params = { dustSummary, slippage };
      setRequestParams(params);
      const key = [
        ...DUST_COMPOSER_QUOTE_QUERY_KEY,
        serializeParams(params),
      ] as const;
      return queryClient.fetchQuery({
        queryKey: key,
        queryFn: () => fetchComposerQuote(params),
        staleTime: DUST_COMPOSER_QUOTE_STALE_MS,
      });
    },
    [queryClient],
  );

  const queryKey = [
    ...DUST_COMPOSER_QUOTE_QUERY_KEY,
    requestParams ? serializeParams(requestParams) : null,
  ] as const;

  const {
    data: composerQuote,
    isFetching,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => fetchComposerQuote(requestParams!),
    enabled: !!requestParams,
    staleTime: DUST_COMPOSER_QUOTE_STALE_MS,
  });

  return {
    composerQuote,
    fetchComposerQuoteAsync,
    isFetching,
    error: error
      ? error instanceof Error
        ? error
        : new Error(String(error))
      : null,
  };
};
