import { type TypedRoycoClient } from '../client';

import { getSupportedToken } from '../constants';

export const getHighestOffersRecipeQueryOptions = (
  client: TypedRoycoClient,
  chain_id: number,
  market_id: string,
) => ({
  queryKey: ['highest-offers-recipe', chain_id, market_id],
  queryFn: async () => {
    const result = await client.rpc('get_highest_offers_recipe', {
      in_chain_id: chain_id,
      in_market_id: market_id,
    });

    if (result.data) {
      const rows = result.data;

      const new_rows = rows.map((row) => {
        const tokens_data = row.token_ids.map(
          (token_id: string, tokenIndex) => {
            const token_info = getSupportedToken(token_id);
            const amount =
              tokenIndex < row.token_amounts.length
                ? row.token_amounts[tokenIndex]
                : 0;

            return {
              ...token_info,
              amount,
            };
          },
        );

        const ratio = row.quantity_remaining / row.quantity;

        // const ratio = (row.quantity_remaining / row.quantity) * Math.random();

        return {
          ...row,
          tokens_data,
          ratio,
        };
      });

      const ap_offers = new_rows
        .filter((row) => row.offer_side === 0)
        .sort((a, b) => a.rank - b.rank);

      const ip_offers = new_rows
        .filter((row) => row.offer_side === 1)
        .sort((a, b) => a.rank - b.rank);

      return {
        ap_offers,
        ip_offers,
      };
    }

    return null;
  },
  keepPreviousData: true,
  placeholderData: (previousData: any) => previousData,
  refetchInterval: 1000 * 60 * 1, // 1 min
  // refetchInterval: 1000 * 60 * 1, // 1 min
  // refetchInterval: 1000 * 10 * 1, // 10 seconds
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
