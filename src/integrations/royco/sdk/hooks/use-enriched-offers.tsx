import { useQuery } from '@tanstack/react-query';
import {
  getTokenQuotesQueryOptions,
  getHighestOffersRecipeQueryOptions,
  getEnrichedOffersQueryOptions,
} from '../queries';
import type { RoycoClient } from '../client';
import { useRoycoClient } from '../client';
import { getSupportedToken, SupportedToken } from '../constants';
import type {
  BaseQueryFilter,
  BaseSortingFilter,
  CustomTokenData,
} from '../types';

export const useEnrichedOffers = ({
  chain_id,
  market_type,
  market_id,
  creator,
  can_be_filled,
  page_index = 0,
  filters = [],
  sorting = [],
  custom_token_data = undefined,
  enabled = true,
}: {
  chain_id: number;
  market_type?: number;
  market_id?: string;
  creator?: string;
  can_be_filled?: boolean;
  page_index?: number;
  filters?: Array<BaseQueryFilter>;
  sorting?: Array<BaseSortingFilter>;
  custom_token_data?: CustomTokenData;
  enabled?: boolean;
}) => {
  const client: RoycoClient = useRoycoClient();

  return useQuery({
    ...getEnrichedOffersQueryOptions(
      client,
      chain_id,
      market_type,
      market_id,
      creator,
      can_be_filled,
      page_index,
      filters,
      sorting,
      custom_token_data,
    ),
    enabled,
  });
};
