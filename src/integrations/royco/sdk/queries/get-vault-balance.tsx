import { type Address } from 'viem';
import { createPublicClient, http, erc4626Abi } from 'viem';
import { getChain } from '../utils';
import { NULL_ADDRESS, RPC_API_KEYS } from '../constants';
export const getVaultBalance = async ({
  chain_id,
  account,
  vault_address,
}: {
  chain_id: number;
  account: string;
  vault_address: string;
}) => {
  const chain = getChain(chain_id);

  const publicClient = createPublicClient({
    chain,
    transport: http(RPC_API_KEYS[chain_id]),
  });

  const contracts = [
    {
      address: vault_address as Address,
      abi: erc4626Abi,
      functionName: 'asset',
    },
    {
      address: vault_address as Address,
      abi: erc4626Abi,
      functionName: 'balanceOf',
      args: [account],
    },
  ];

  const query = publicClient.multicall({ contracts });

  return query;
};

export const getVaultBalanceQueryOptions = (
  chain_id: number,
  account: string,
  vault_address: string,
) => ({
  queryKey: [
    'vault-balance',
    `chain-id=${chain_id}`,
    `account=${account}`,
    `vault_address=${vault_address}`,
  ],
  queryFn: async () => {
    try {
      const result = await getVaultBalance({
        chain_id,
        account,
        vault_address,
      });

      // Extract balance and asset address from multicall result
      const [assetResult, balanceResult] = result;

      // Handle invalid asset address
      const assetAddress =
        assetResult.status === 'success'
          ? (assetResult.result as string).toLowerCase()
          : NULL_ADDRESS; // NULL address

      // Create token_id by concatenating chain_id and asset address
      const token_id = `${chain_id}-${assetAddress}`.toLowerCase();

      // Handle invalid balance
      const raw_amount =
        balanceResult.status === 'success'
          ? (balanceResult.result?.toString() ?? '0')
          : '0';

      return {
        token_id,
        raw_amount,
      };
    } catch (error) {
      // If any error occurs, return default values
      return {
        token_id: `${chain_id}-${NULL_ADDRESS}`.toLowerCase(),
        raw_amount: '0',
      };
    }
  },
  keepPreviousData: true,
  placeholderData: (previousData: any) => previousData,
  refetchInterval: 1000 * 60 * 1, // 1 min
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
