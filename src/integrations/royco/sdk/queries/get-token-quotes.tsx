import { type TypedRoycoClient } from '../client';
import { getSupportedToken } from '../constants';

export type TypedTokenQuote = {
  token_id: string;
  price: number;
  total_supply: number;
  fdv: number;
};

export const getTokenQuotesQueryOptions = (
  client: TypedRoycoClient,
  token_ids: string[],
  custom_token_data?: Array<{
    token_id: string;
    price?: string;
    fdv?: string;
    total_supply?: string;
  }>,
) => ({
  queryKey: [
    'tokens-quote',
    token_ids.map((id) => `${id}`).join(':'),
    custom_token_data
      ?.map(
        (token) =>
          `${token.token_id}:${token.price}:${token.fdv}:${token.total_supply}`,
      )
      .join(':'),
  ],
  queryFn: async () => {
    const result = await client.rpc('get_token_quotes', {
      token_ids,
      custom_token_data,
    });

    if (result.data) {
      const rows = result.data as TypedTokenQuote[];

      const new_rows = token_ids.map((token_id) => {
        const token_data = getSupportedToken(token_id);
        let quote_data = rows.find(
          (r) => r.token_id.toLowerCase() === token_id,
        );

        if (!quote_data) {
          quote_data = {
            token_id,
            price: 0,
            total_supply: 0,
            fdv: 0,
          };
        }

        return {
          ...token_data,
          ...quote_data,
        };
      });

      return new_rows;
    }

    return null;
  },
  keepPreviousData: true,
  placeholderData: (previousData: any) => previousData,
  refetchInterval: 1000 * 60 * 1, // 1 min
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
