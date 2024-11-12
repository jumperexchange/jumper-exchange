import { type Chain, type Address } from 'viem';
import { createPublicClient, http, erc20Abi } from 'viem';
import { getChain } from '../utils';
import { RPC_API_KEYS } from '../constants';

export const getTokenBalance = async (
  chain_id: number,
  contract_address: Address,
  account: Address,
  spender?: Address,
) => {
  const chain: Chain = getChain(chain_id);

  const publicClient = createPublicClient({
    chain,
    transport: http(RPC_API_KEYS[chain_id]),
  });

  const contracts = [
    {
      address: contract_address,
      abi: erc20Abi,
      functionName: 'symbol',
    },
    {
      address: contract_address,
      abi: erc20Abi,
      functionName: 'decimals',
    },
    {
      address: contract_address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [account],
    },
  ];

  if (spender) {
    contracts.push({
      address: contract_address,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [account, spender],
    });
  }

  const query = publicClient.multicall({ contracts });

  return query;
};

export const getTokenBalanceQueryOptions = (
  chain_id: number,
  token_address: Address,
  user_address: Address,
) => ({
  queryKey: [
    'token-balance',
    `chain-id=${chain_id}`,
    `token-address=${token_address}`,
    `user-address=${user_address}`,
  ],
  queryFn: async () => {
    const result = await getTokenBalance(chain_id, token_address, user_address);

    return result;
  },
  keepPreviousData: true,
  placeholderData: (previousData: any) => previousData,
  staleTime: 1000 * 60 * 1, // 1 min
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
