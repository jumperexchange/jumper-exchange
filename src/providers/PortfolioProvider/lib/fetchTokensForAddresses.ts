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

export interface FetchTokensParams {
  address: string;
  chainType: ChainType;
  onProgress?: (round: number, tokens: TokenBalance[]) => void;
  onComplete?: (tokens: TokenBalance[]) => void;
}

/** Fetch tokens for EVM wallet (no batching needed) */
export const fetchTokensForAddressEVM = async (address: string) => {
  const walletBalances = await getWalletBalances(address);
  return createTokenBalancesFromPlainArray(flatMap(walletBalances));
};

/** Fetch tokens for a wallet address */
export const fetchTokensForAddress = async ({
  address,
  chainType,
  onProgress,
  onComplete,
}: FetchTokensParams) => {
  // EVM: use getWalletBalances (no batching needed)
  if (chainType === ChainType.EVM) {
    const tokens = await fetchTokensForAddressEVM(address);
    onProgress?.(1, tokens);
    onComplete?.(tokens);
    return { tokens, address, control: null };
  }

  // Non-EVM: use batched fetching with getTokenBalances
  const tokensResponse = await getTokens({ chainTypes: [chainType] });

  let finalTokens: TokenBalance[] = [];

  const batchFetcherControl = createBatchFetcher<Token, TokenAmount>(
    tokensResponse.tokens,
    async (_chainId, tokenBatch) => {
      const balances = await getTokenBalances(address, tokenBatch);
      return balances.filter((t) => t.amount && t.amount > BigInt(0));
    },
    {
      onProgress: (round, results) => {
        finalTokens = createTokenBalancesFromPlainArray(results);

        onProgress?.(round, finalTokens);
      },
      onComplete: (results) => {
        finalTokens = createTokenBalancesFromPlainArray(results);
        onComplete?.(finalTokens);
      },
    },
  );

  return { tokens: finalTokens, address, control: batchFetcherControl };
};

/** Fetch tokens for multiple addresses */
export const fetchTokensForAddresses = async (params: FetchTokensParams[]) => {
  return Promise.all(params.map(fetchTokensForAddress));
};
