import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import type { ComposeResponseData } from '@/app/lib/lifi-composer-client';
import {
  DUST_COMPOSER_QUOTE_QUERY_KEY,
  DUST_COMPOSER_QUOTE_STALE_MS,
  fetchDustComposerQuote,
  type DustComposerQuoteParams,
  serializeDustComposerQuoteParams,
} from '../dustComposerQuoteApi';
import type { DustSummaryValue } from '../types';

export const useDustComposerQuote = () => {
  const queryClient = useQueryClient();
  const [requestParams, setRequestParams] =
    useState<DustComposerQuoteParams | null>(null);

  const fetchComposerQuoteAsync = useCallback(
    (
      dustSummary: DustSummaryValue,
      slippage: number,
    ): Promise<ComposeResponseData> => {
      const params: DustComposerQuoteParams = { dustSummary, slippage };
      setRequestParams(params);
      const key = [
        ...DUST_COMPOSER_QUOTE_QUERY_KEY,
        serializeDustComposerQuoteParams(params),
      ] as const;
      return queryClient.fetchQuery({
        queryKey: key,
        queryFn: () => fetchDustComposerQuote(params),
        staleTime: DUST_COMPOSER_QUOTE_STALE_MS,
      });
    },
    [queryClient],
  );

  const queryKey = [
    ...DUST_COMPOSER_QUOTE_QUERY_KEY,
    requestParams ? serializeDustComposerQuoteParams(requestParams) : null,
  ] as const;

  const {
    data: composerQuote,
    isFetching,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => fetchDustComposerQuote(requestParams!),
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
