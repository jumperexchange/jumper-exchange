import { isAddress } from 'viem';
import type { TypedRoycoClient } from '../client';

export const getContractsQueryOptions = (
  client: TypedRoycoClient,
  contracts: Array<{ chain_id: number; contract_address: string }>,
) => ({
  queryKey: [
    'get-contracts',
    ...contracts.map(
      (contract) =>
        `chain_id=${contract.chain_id}:contract_address=${contract.contract_address}`,
    ),
  ],
  queryFn: async () => {
    for (let i = 0; i < contracts.length; i++) {
      const contract_address = contracts[i].contract_address;

      if (isAddress(contract_address) === false) {
        return new Error(`Invalid contract address: ${contract_address}`);
      }
    }

    return client
      .rpc('get_contracts', { _contracts: contracts })
      .throwOnError()
      .then((result) => result.data);
  },
  keepPreviousData: true,
  placeholderData: (previousData: any) => previousData,
  staleTime: 1000 * 60 * 60 * 24, // 24 hrs
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
