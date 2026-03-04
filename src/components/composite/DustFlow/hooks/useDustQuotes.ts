import {
  fetchOdosQuote,
  type OdosQuoteRequest,
  type OdosQuoteResponse,
} from '../api/odos';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import type { DustSummaryValue } from './useDustFormFields';
import { stringify } from 'superjson';
import { ONE_MINUTE_MS } from '@/const/time';

const DUST_QUOTES_QUERY_KEY = ['dustQuotes', 'odos'] as const;
export const SLIPPAGE_LIMIT_PERCENT = 0.3;

/** Build Odos quote request from dust form summary. */
export const buildOdosQuoteRequest = (
  dustSummary: DustSummaryValue,
): OdosQuoteRequest => ({
  chainId: dustSummary.nativeToken.chainId,
  inputTokens: dustSummary.selectedBalances.map((b) => ({
    tokenAddress: b.token.address,
    amount: b.amount.toString(),
  })),
  outputTokens: [
    {
      tokenAddress: dustSummary.nativeToken.address,
      proportion: 1,
    },
  ],
  userAddr: dustSummary.address,
  slippageLimitPercent: SLIPPAGE_LIMIT_PERCENT,
  pathVizImage: true,
  simple: true,
  compact: true,
});

/** Build quote params from dust form summary for use with useDustQuotes. */
export const buildDustQuoteParams = (
  dustSummary: DustSummaryValue,
): OdosQuoteRequest => buildOdosQuoteRequest(dustSummary);

async function fetchDustQuote(
  request: OdosQuoteRequest,
): Promise<OdosQuoteResponse> {
  return fetchOdosQuote(request);
}

export const useDustQuotes = () => {
  const queryClient = useQueryClient();
  const [requestParams, setRequestParams] = useState<OdosQuoteRequest | null>(
    null,
  );

  const fetchQuotesAsync = useCallback(
    (params: OdosQuoteRequest): Promise<OdosQuoteResponse> => {
      if (params.inputTokens.length === 0) {
        return Promise.reject(new Error('No input tokens'));
      }
      setRequestParams(params);
      const key = [...DUST_QUOTES_QUERY_KEY, stringify(params)] as const;
      return queryClient.fetchQuery({
        queryKey: key,
        queryFn: () => fetchDustQuote(params),
        staleTime: ONE_MINUTE_MS, // Odos quotes valid for 60s
      });
    },
    [queryClient],
  );

  const queryKey = [
    ...DUST_QUOTES_QUERY_KEY,
    requestParams ? stringify(requestParams) : null,
  ] as const;
  const enabled = !!requestParams && requestParams.inputTokens.length > 0;

  const {
    data: quote,
    isFetching,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => fetchDustQuote(requestParams!),
    enabled,
    staleTime: ONE_MINUTE_MS,
  });

  return {
    quote,
    fetchQuotesAsync,
    isFetching,
    error: error
      ? error instanceof Error
        ? error
        : new Error(String(error))
      : null,
  };
};
