import { useQuery } from '@tanstack/react-query';
import type { RoycoClient } from '../client';
import { useRoycoClient } from '../client';
import { getEnrichedPositionsRecipeQueryOptions } from '../queries/get-enriched-positions-recipe';
import type {
  BaseQueryFilter,
  BaseSortingFilter,
  CustomTokenData,
} from '../types';

export const useEnrichedPositionsRecipe = ({
  account_address,
  chain_id,
  market_id,
  custom_token_data,
  page_index = 0,
  filters = [],
  sorting,
  enabled = true,
}: {
  account_address: string;
  chain_id: number;
  market_id: string;
  custom_token_data?: CustomTokenData;
  page_index?: number;
  filters?: Array<BaseQueryFilter>;
  sorting?: Array<BaseSortingFilter>;
  enabled?: boolean;
}) => {
  const client: RoycoClient = useRoycoClient();

  return useQuery({
    ...getEnrichedPositionsRecipeQueryOptions(
      client,
      account_address,
      chain_id,
      market_id,
      custom_token_data,
      page_index,
      filters,
      sorting,
    ),
    enabled,
  });
};
