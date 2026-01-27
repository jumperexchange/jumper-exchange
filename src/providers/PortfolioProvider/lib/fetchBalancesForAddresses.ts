import {
  ChainType,
  getTokens,
  getTokenBalances,
  getWalletBalances,
} from '@lifi/sdk';
import type { Token, TokenAmount } from '@lifi/sdk';
import { flatMap } from 'lodash';
import { createBatchFetcher } from '@/utils/batches/fetcher';
import {
  createExtendedToken,
  createTokenBalance,
  type TokenBalance,
} from '@/types/tokens';

const createTokensBalanceFromPlain = <
  T extends Omit<TokenAmount, 'amount'> & { amount: string | bigint },
>(
  token: T,
): TokenBalance => {
  return createTokenBalance(createExtendedToken(token), token.amount);
};

const createTokenBalancesFromPlainArray = <
  T extends Omit<TokenAmount, 'amount'> & {
    amount?: string | bigint | undefined;
  },
>(
  tokens: T[],
): TokenBalance[] => {
  return tokens
    .filter((token): token is T & { amount: string | bigint } => !!token.amount)
    .map((token) => createTokensBalanceFromPlain(token));
};

export interface FetchBalancesParams {
  address: string;
  chainType: ChainType;
  onProgress?: (round: number, tokens: TokenBalance[]) => void;
  onComplete?: (tokens: TokenBalance[]) => void;
}

/** Fetch tokens for EVM wallet (no batching needed) */
export const fetchBalancesForEVMAddress = async (address: string) => {
  const walletBalances = await getWalletBalances(address);
  return createTokenBalancesFromPlainArray(flatMap(walletBalances));
};

/** Fetch tokens for a wallet address */
export const fetchBalancesForAddress = async ({
  address,
  chainType,
  onProgress,
  onComplete,
}: FetchBalancesParams) => {
  // EVM: use getWalletBalances (no batching needed)
  if (chainType === ChainType.EVM) {
    const balances = await fetchBalancesForEVMAddress(address);
    onProgress?.(1, balances);
    onComplete?.(balances);
    return { balances, address, control: null };
  }

  // Non-EVM: use batched fetching with getTokenBalances
  const tokensResponse = await getTokens({ chainTypes: [chainType] });

  let balances: TokenBalance[] = [];

  const batchFetcherControl = createBatchFetcher<Token, TokenAmount>(
    tokensResponse.tokens,
    async (_chainId, tokenBatch) => {
      const balances = await getTokenBalances(address, tokenBatch);
      return balances.filter((t) => t.amount && t.amount > BigInt(0));
    },
    {
      onProgress: (round, results) => {
        balances = createTokenBalancesFromPlainArray(results);

        onProgress?.(round, balances);
      },
      onComplete: (results) => {
        balances = createTokenBalancesFromPlainArray(results);
        onComplete?.(balances);
      },
    },
  );

  return { balances, address, control: batchFetcherControl };
};

/** Fetch balances for multiple addresses */
export const fetchBalancesForAddresses = async (
  params: FetchBalancesParams[],
) => {
  return Promise.all(params.map(fetchBalancesForAddress));
};
