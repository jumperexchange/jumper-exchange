import { useRoycoClient, type RoycoClient } from '../client';
import { getEnrichedRoycoStatsQueryOptions } from '../queries';
import { useQuery } from '@tanstack/react-query';
import type { CustomTokenData } from '../types';

export const useEnrichedRoycoStats = ({
  testnet = false,
  custom_token_data,
}: {
  testnet?: boolean;
  custom_token_data?: CustomTokenData;
} = {}) => {
  const client: RoycoClient = useRoycoClient();

  return useQuery({
    ...getEnrichedRoycoStatsQueryOptions(client, custom_token_data, testnet),
  });
};
