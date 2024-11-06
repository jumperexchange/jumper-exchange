import { useQuery } from '@tanstack/react-query';
import { getMarketOffersRecipeQueryOptions } from '../queries';
import type { RoycoClient } from '../client';
import { useRoycoClient } from '../client';

export const useMarketOffersRecipe = ({
  chain_id,
  market_id,
  offer_side,
  quantity,
  enabled = true,
}: {
  chain_id: number;
  market_id: string;
  offer_side: number;
  quantity: number;
  enabled?: boolean;
}) => {
  const client: RoycoClient = useRoycoClient();

  return useQuery({
    ...getMarketOffersRecipeQueryOptions(
      client,
      chain_id,
      market_id,
      offer_side,
      quantity,
    ),
    enabled,
  });
};
