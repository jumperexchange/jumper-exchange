import { useQuery } from '@tanstack/react-query';
import { getTokenQuotesQueryOptions } from '../queries';
import type { RoycoClient } from '../client';
import { useRoycoClient } from '../client';
import { getSupportedToken, SupportedToken } from '../constants';
import { useCustomTokenQuotes } from './use-custom-token-quotes';

export const useTokenQuotes = ({
  token_ids,
  custom_token_data,
  enabled = true,
}: {
  token_ids: string[];
  custom_token_data?: Array<{
    token_id: string;
    price?: string;
    fdv?: string;
    total_supply?: string;
  }>;
  enabled?: boolean;
}) => {
  const client: RoycoClient = useRoycoClient();

  return useQuery({
    ...getTokenQuotesQueryOptions(client, token_ids, custom_token_data),
    enabled,
  });
};

export const DEFAULT_TOKEN_QUOTE = {
  price: 0,
  total_supply: 0,
  fdv: 0,
};

export const getTokenQuote = ({
  token_id,
  token_quotes,
}: {
  token_id: string;
  token_quotes: ReturnType<typeof useTokenQuotes>;
}) => {
  const available_token_quotes = token_quotes.data ?? [];

  const available_token_quote = available_token_quotes.find(
    (quote) => quote.token_id === token_id,
  );

  let token_quote = available_token_quote;

  if (!token_quote) {
    token_quote = {
      ...getSupportedToken(token_id),
      token_id,
      ...DEFAULT_TOKEN_QUOTE,
    };
  }

  return token_quote;
};
