import {
  ChainType,
  getTokens,
  getTokenBalances,
  getWalletBalances,
} from '@lifi/sdk';
import type { Token, TokenAmount, WalletTokenExtended } from '@lifi/sdk';
import { flatMap } from 'lodash';
import { createBatchFetcher } from '@/utils/batches/fetcher';

/** Common token type with amount as string */
export interface LiFiCommonToken {
  chainId: number;
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoURI?: string;
  priceUSD: string;
  amount: string;
}

export interface FetchTokensParams {
  address: string;
  chainType: ChainType;
  onProgress?: (round: number, tokens: LiFiCommonToken[]) => void;
  onComplete?: (tokens: LiFiCommonToken[]) => void;
}

export interface FetchTokensResult {
  tokens: LiFiCommonToken[];
  address: string;
  intervalId: NodeJS.Timeout | null;
}

/** Convert TokenAmount to LiFiCommonToken */
const fromTokenAmount = (token: TokenAmount): LiFiCommonToken => ({
  chainId: token.chainId,
  address: token.address,
  symbol: token.symbol,
  decimals: token.decimals,
  name: token.name,
  logoURI: token.logoURI,
  priceUSD: token.priceUSD,
  amount: token.amount?.toString() ?? '0',
});

/** Convert WalletTokenExtended to LiFiCommonToken */
const fromWalletToken = (token: WalletTokenExtended): LiFiCommonToken => ({
  chainId: token.chainId,
  address: token.address,
  symbol: token.symbol,
  decimals: token.decimals,
  name: token.name,
  logoURI: token.logoURI,
  priceUSD: token.priceUSD,
  amount: token.amount,
});

/** Fetch tokens for EVM wallet (no batching needed) */
export const fetchTokensForAddressEVM = async (
  address: string,
): Promise<LiFiCommonToken[]> => {
  const walletBalances = await getWalletBalances(address);
  return flatMap(walletBalances).map(fromWalletToken);
};

/** Fetch tokens for a wallet address */
export const fetchTokensForAddress = async ({
  address,
  chainType,
  onProgress,
  onComplete,
}: FetchTokensParams): Promise<FetchTokensResult> => {
  // EVM: use getWalletBalances (no batching needed)
  if (chainType === ChainType.EVM) {
    const tokens = await fetchTokensForAddressEVM(address);
    onProgress?.(1, tokens);
    onComplete?.(tokens);
    return { tokens, address, intervalId: null };
  }

  // Non-EVM: use batched fetching with getTokenBalances
  const tokensResponse = await getTokens({ chainTypes: [chainType] });

  let finalTokens: LiFiCommonToken[] = [];

  const intervalId = createBatchFetcher<Token, TokenAmount>(
    tokensResponse.tokens as unknown as Record<string, Token[]>,
    async (_chainId, tokenBatch) => {
      const balances = await getTokenBalances(address, tokenBatch);
      return balances.filter((t) => t.amount && t.amount > BigInt(0));
    },
    {
      onProgress: (round, results) => {
        finalTokens = results.map(fromTokenAmount);
        onProgress?.(round, finalTokens);
      },
      onComplete: (results) => {
        finalTokens = results.map(fromTokenAmount);
        onComplete?.(finalTokens);
      },
    },
  );

  return { tokens: finalTokens, address, intervalId };
};

/** Fetch tokens for multiple addresses */
export const fetchTokensForAddresses = async (
  params: FetchTokensParams[],
): Promise<FetchTokensResult[]> => {
  return Promise.all(params.map(fetchTokensForAddress));
};
