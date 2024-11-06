import { type Address } from 'viem';
import { createPublicClient, http, erc20Abi, erc4626Abi } from 'viem';
import { getChain } from '../utils';
import { RoycoMarketFundingType } from '../market';
import { RPC_API_KEYS } from '../constants';

export const getAccountBalance = async ({
  chain_id,
  account,
  tokens,
}: {
  chain_id: number;
  account: string;
  tokens: string[];
}) => {
  const chain = getChain(chain_id);

  const publicClient = createPublicClient({
    chain,
    transport: http(RPC_API_KEYS[chain_id]),
  });

  const contractsBalance = tokens.map((token_address) => ({
    address: token_address as Address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [account],
  }));

  const query = publicClient.multicall({ contracts: contractsBalance });

  return query;
};

export const getAccountBalanceQueryOptions = (
  chain_id: number,
  account: string,
  tokens: string[],
) => ({
  queryKey: [
    'token-balance',
    `chain-id=${chain_id}`,
    `account=${account}`,
    `tokens=${tokens.join(':')}`,
  ],
  queryFn: async () => {
    const result = await getAccountBalance({ chain_id, account, tokens });

    return result;
  },
  keepPreviousData: true,
  placeholderData: (previousData: any) => previousData,
  refetchInterval: 1000 * 60 * 1, // 1 min
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
