import { getQuote, type LiFiStep } from '@lifi/sdk';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import type { DustSummaryValue } from './useDustFormFields';

const DUST_QUOTES_STALE_MS = 2 * 60 * 1000; // 2 minutes
const DUST_QUOTES_QUERY_KEY = ['dustQuotes'] as const;

/** Params for a single dust conversion quote (one selected balance → native token). */
export interface DustQuoteParams {
  fromToken: string;
  fromChain: number;
  fromAmount: string;
  toToken: string;
  toChain: number;
  fromAddress: string;
}

function serializeParams(params: DustQuoteParams[]): string {
  return JSON.stringify(params);
}

/** Build quote params from dust form summary for use with useDustQuotes. */
export const buildDustQuoteParams = (
  dustSummary: DustSummaryValue,
): DustQuoteParams[] =>
  dustSummary.selectedBalances.map((balance) => ({
    fromToken: balance.token.address,
    fromChain: balance.token.chainId,
    fromAmount: balance.amount.toString(),
    toToken: dustSummary.nativeToken.address,
    toChain: dustSummary.nativeToken.chainId,
    fromAddress: dustSummary.address,
  }));

async function fetchDustQuotes(params: DustQuoteParams[]): Promise<LiFiStep[]> {
  return Promise.all(params.map((p) => getQuote(p)));
}

export const useDustQuotes = () => {
  const queryClient = useQueryClient();
  const [requestParams, setRequestParams] = useState<DustQuoteParams[] | null>(
    null,
  );

  const fetchQuotesAsync = useCallback(
    (params: DustQuoteParams[]): Promise<LiFiStep[]> => {
      if (params.length === 0) {
        return Promise.resolve([]);
      }
      setRequestParams(params);
      const key = [...DUST_QUOTES_QUERY_KEY, serializeParams(params)] as const;
      return queryClient.fetchQuery({
        queryKey: key,
        queryFn: () => fetchDustQuotes(params),
        staleTime: DUST_QUOTES_STALE_MS,
      });
    },
    [queryClient],
  );

  const queryKey = [
    ...DUST_QUOTES_QUERY_KEY,
    requestParams ? serializeParams(requestParams) : null,
  ] as const;
  const enabled = !!requestParams && requestParams.length > 0;

  const {
    data: quotes,
    isFetching,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => fetchDustQuotes(requestParams!),
    enabled,
    staleTime: DUST_QUOTES_STALE_MS,
  });

  return {
    quotes,
    fetchQuotesAsync,
    isFetching,
    error: error
      ? error instanceof Error
        ? error
        : new Error(String(error))
      : null,
  };
};
