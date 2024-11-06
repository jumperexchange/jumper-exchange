import { useQuery } from '@tanstack/react-query';
import type { EnrichedMarketDataType, MarketFilter } from '../queries';
import { getEnrichedMarketsQueryOptions } from '../queries';
import type { RoycoClient } from '../client';
import { useRoycoClient } from '../client';
import type { BaseSortingFilter, CustomTokenData } from '../types';

export const useEnrichedMarkets = ({
  chain_id,
  market_type,
  market_id,
  page_index = 0,
  filters = [],
  sorting = [],
  search_key,
  is_verified,
  custom_token_data,
  enabled = true,
}: {
  chain_id?: number;
  market_type?: number;
  market_id?: string;
  creator?: string;
  page_index?: number;
  filters?: Array<MarketFilter>;
  sorting?: Array<BaseSortingFilter>;
  search_key?: string;
  is_verified?: boolean;
  custom_token_data?: CustomTokenData;
  enabled?: boolean;
}) => {
  const client: RoycoClient = useRoycoClient();

  const props = useQuery({
    ...getEnrichedMarketsQueryOptions(
      client,
      chain_id,
      market_type,
      market_id,
      page_index,
      filters,
      sorting,
      search_key,
      is_verified,
      custom_token_data,
    ),
    enabled,
  });

  const data = !!props.data
    ? // @ts-ignore
      (props.data.data as Array<EnrichedMarketDataType>)
    : null;
  const count = !!props.data ? (props.data.count ?? 0) : 0;

  return {
    ...props,
    data,
    count,
  };
};
