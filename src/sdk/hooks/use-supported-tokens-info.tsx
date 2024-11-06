import { useRoycoClient, type RoycoClient } from '../client';
import { type SupportedToken, SupportedTokenMap } from '../constants';
import { useQuery } from '@tanstack/react-query';
import type { TypedTokenQuote } from '../queries';
import { getTokenQuotesQueryOptions } from '../queries';

export type SupportedTokenInfo = SupportedToken & TypedTokenQuote;

export const useSupportedTokensInfo = ({
  token_ids,
}: {
  token_ids: string[];
}) => {
  let data: SupportedTokenInfo[] | null = null;
  const client: RoycoClient = useRoycoClient();

  const tokenQuoteProps = useQuery(
    getTokenQuotesQueryOptions(client, token_ids),
  );

  const tokenMetadata = token_ids.map((id) =>
    SupportedTokenMap[id]
      ? SupportedTokenMap[id]
      : {
          id: id,
          chain_id: parseInt(id.split('-')[0]),
          contract_address: id.split('-')[1],
          name: 'Unknown',
          symbol: 'N/D',
          image: 'https://chainlist.org/unknown-logo.png',
          decimals: 18,
        },
  );

  if (
    tokenQuoteProps.data &&
    !(tokenQuoteProps.data instanceof Error) &&
    tokenMetadata
  ) {
    data = tokenMetadata.map((metadata, index) => {
      let matchingQuote = tokenQuoteProps.data.find(
        (quote) => quote.token_id === metadata.id,
      );

      if (!matchingQuote) {
        matchingQuote = {
          token_id: metadata.id,
          price: 0,
          volume_24h: 0,
          market_cap: 0,
          fully_diluted_market_cap: 0,
        };
      }

      return {
        ...metadata,
        ...matchingQuote,
      };
    });
  }

  return { ...tokenQuoteProps, data };
};
