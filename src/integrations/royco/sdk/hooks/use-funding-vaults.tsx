import { useQuery } from '@tanstack/react-query';
import { type RoycoClient, useRoycoClient } from '../client';
import { getContractsQueryOptions } from '../queries';

export const BaseFundingVault = {
  address: '0x0000000000000000000000000000000000000000',
  label: 'Wallet',
};

export const useFundingVaults = () => {
  const client: RoycoClient = useRoycoClient();

  const isLoading = false;

  const data = [BaseFundingVault];

  return {
    isLoading,
    data,
  };
};
