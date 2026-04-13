import {
  ChainType,
  getTokens,
  getTokenBalances,
  getWalletBalances,
} from '@lifi/sdk';
import type { Token, TokenAmount } from '@lifi/sdk';
import { flatMap } from 'lodash';
import { createBatchFetcher } from '@/utils/batches/fetcher';
import { sdkClient } from '@/utils/instrumentation/lifiSdkConfig';
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
  signal?: AbortSignal;
  onProgress?: (
    completedBatches: number,
    totalBatches: number,
    tokens: TokenBalance[],
  ) => void;
  onComplete?: (tokens: TokenBalance[]) => void;
}

/** Fetch tokens for EVM wallet (no batching needed) */
export const fetchBalancesForEVMAddress = async (address: string) => {
  const walletBalances = await getWalletBalances(sdkClient, address);
  return createTokenBalancesFromPlainArray(flatMap(walletBalances));
};

/** Fetch tokens for a wallet address */
export const fetchBalancesForAddress = async ({
  address,
  chainType,
  signal,
  onProgress,
  onComplete,
}: FetchBalancesParams) => {
  // Check if cancelled before starting
  if (signal?.aborted) {
    throw new Error('Aborted');
  }

  if (chainType === ChainType.EVM) {
    const balances = await fetchBalancesForEVMAddress(address);
    onProgress?.(1, 1, balances);
    onComplete?.(balances);
    return { balances, address };
  }

  const tokensResponse = await getTokens(sdkClient, {
    chainTypes: [chainType],
  });

  let balances: TokenBalance[] = [];

  const { results } = createBatchFetcher<Token, TokenAmount>(
    tokensResponse.tokens,
    async (_chainId, tokenBatch) => {
      // Check signal before each batch
      if (signal?.aborted) {
        throw new Error('Aborted');
      }
      const balances = await getTokenBalances(sdkClient, address, tokenBatch);
      return balances.filter((t) => t.amount && t.amount > BigInt(0));
    },
    {
      onProgress: (completedBatches, totalBatches, results) => {
        balances = createTokenBalancesFromPlainArray(results);
        onProgress?.(completedBatches, totalBatches, balances);
      },
      onComplete: (results) => {
        balances = createTokenBalancesFromPlainArray(results);
        onComplete?.(balances);
      },
    },
    {},
    signal,
  );

  await results;
  return { balances, address };
};
