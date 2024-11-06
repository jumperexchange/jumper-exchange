import { type Address } from 'viem';
import { createPublicClient, http, erc20Abi } from 'viem';
import { getChain } from '../utils';
import { RPC_API_KEYS } from '../constants';

export const getAccountAllowance = async ({
  chain_id,
  account,
  spender,
  tokens,
}: {
  chain_id: number;
  account: Address;
  spender: Address;
  tokens: Address[];
}) => {
  const chain = getChain(chain_id);

  const publicClient = createPublicClient({
    batch: {
      multicall: true,
    },
    chain,
    transport: http(RPC_API_KEYS[chain_id]),
  });

  const contractsBalance = tokens.map((token_address) => ({
    address: token_address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [account, spender],
  }));

  const query = publicClient.multicall({ contracts: contractsBalance });

  return query;
};

export const getAccountAllowanceQueryOptions = (
  chain_id: number,
  account: Address,
  spender: Address,
  tokens: Address[],
) => ({
  queryKey: [
    'token-allowance',
    `chain-id=${chain_id}`,
    `account=${account}`,
    `tokens=${tokens.join(':')}`,
  ],
  queryFn: async () => {
    const result = await getAccountAllowance({
      chain_id,
      account,
      spender,
      tokens,
    });

    return result;
  },
  keepPreviousData: true,
  placeholderData: (previousData: any) => previousData,
  refetchInterval: 1000 * 60 * 1, // 1 min
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
