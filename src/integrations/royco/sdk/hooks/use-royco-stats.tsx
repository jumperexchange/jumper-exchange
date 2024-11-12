import { useRoycoClient, type RoycoClient } from '../client';
import { getRoycoStatsQueryOptions } from '../queries';
import { useQuery } from '@tanstack/react-query';

export const useRoycoStats = () => {
  const client: RoycoClient = useRoycoClient();

  return useQuery(getRoycoStatsQueryOptions(client));
};
