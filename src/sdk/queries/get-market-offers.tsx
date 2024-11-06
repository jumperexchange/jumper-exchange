import { type TypedRoycoClient } from '../client';
import type { CustomTokenData } from '../types';

export const getMarketOffersQueryOptions = (
  client: TypedRoycoClient,
  chain_id: number,
  market_type: number,
  market_id: string,
  offer_side: number,
  quantity: string,
  custom_token_data?: CustomTokenData,
  incentive_ids?: string[],
  incentive_amounts?: string[],
) => ({
  queryKey: [
    'get-market-offers',
    chain_id,
    market_type,
    market_id,
    offer_side,
    quantity,
    ...(custom_token_data || []).map(
      (token) =>
        `${token.token_id}-${token.price}-${token.fdv}-${token.total_supply}`,
    ),
    incentive_ids?.join(','),
    incentive_amounts?.join(','),
  ],
  queryFn: async () => {
    const result = await client.rpc('get_market_offers', {
      in_chain_id: chain_id,
      in_market_type: market_type,
      in_market_id: market_id,
      in_offer_side: offer_side,
      in_quantity: quantity,
      custom_token_data: custom_token_data,
      in_incentive_ids: incentive_ids,
      in_incentive_amounts: incentive_amounts,
    });

    return result.data;
  },
  keepPreviousData: true,
  placeholderData: (previousData: any) => previousData,
  refetchInterval: 1000 * 60 * 1, // 1 min
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
