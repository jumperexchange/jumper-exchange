import { useQuery } from '@tanstack/react-query';
import { getMarketOffersQueryOptions } from '../queries';
import type { RoycoClient } from '../client';
import { useRoycoClient } from '../client';
import type { CustomTokenData } from '../types';

export const useMarketOffers = ({
  chain_id,
  market_type,
  market_id,
  offer_side,
  quantity,
  custom_token_data,
  incentive_ids,
  incentive_amounts,
  enabled = true,
}: {
  chain_id: number;
  market_type: number;
  market_id: string;
  offer_side: number;
  quantity: string;
  enabled?: boolean;
  custom_token_data?: CustomTokenData;
  incentive_ids?: string[];
  incentive_amounts?: string[];
}) => {
  const client: RoycoClient = useRoycoClient();

  return useQuery({
    ...getMarketOffersQueryOptions(
      client,
      chain_id,
      market_type,
      market_id,
      offer_side,
      quantity,
      custom_token_data,
      incentive_ids && incentive_ids.length > 0 ? incentive_ids : undefined,
      incentive_amounts && incentive_amounts.length > 0
        ? incentive_amounts
        : undefined,
    ),
    enabled,
  });
};
