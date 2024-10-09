import type {
  ExtendedChain,
  TokenAmount,
  Token,
  TokensResponse,
} from '@lifi/sdk';
import {
  getChains,
  getTokenBalances as LifiGetTokenBalances,
  getTokens as LifiGetTokens,
} from '@lifi/sdk';
import { formatUnits } from 'viem';
import { isEqual, sortBy, sumBy } from 'lodash';
import { useQueries } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getOrCreateMap, usePortfolioStore } from '@/stores/portfolio';
import type { Account } from '@lifi/wallet-management';
import { useAccount } from '@lifi/wallet-management';

export interface ExtendedTokenAmountWithChain extends ExtendedTokenAmount {
  chainLogoURI?: string;
  chainName?: string;
}

interface Price {
  amount?: bigint;
  totalPriceUSD: number;
  formattedBalance: number;
}

export interface ExtendedTokenAmount extends TokenAmount, Partial<Price> {
  chains: ExtendedTokenAmountWithChain[];
  cumulatedBalance?: number; // Cumulated balance across chains
  cumulatedTotalUSD?: number; // Cumulated total USD across chains
}

function getBalance(tb: Partial<TokenAmount>): number {
  return tb?.amount && tb?.decimals
    ? Number(formatUnits(tb.amount, tb.decimals))
    : 0;
}

// Constants
const MAX_CROSS_CHAIN_FETCH = 10000; // Maximum tokens per fetch round across all chains
const MAX_TOKENS_PER_CHAIN = 500; // Maximum tokens to fetch per chain per round
const FETCH_DELAY = 3000;

// Main function to fetch all tokens in batches
/**
 * Fetches token balances across multiple chains with specified constraints.
 *
 * @param account - The account address to fetch token balances for.
 * @param chains
 * @param tokens
 * @param onProgress - A callback invoked after each fetch round with cumulative data.
 * @param handleComplete
 * @returns A Promise that resolves to the final cumulative sum, total USD value, and all fetched balances.
 */

// Main function to fetch all tokens in batches
function fetchAllTokensBalanceByChain(
  account: string,
  chains: ExtendedChain[],
  tokens: TokensResponse['tokens'],
  onProgress: (
    account: string,
    round: number,
    cumulativePriceUSD: number,
    fetchedBalances: ExtendedTokenAmount[],
  ) => void,
  handleComplete: (combinedWallet: ExtendedTokenAmountWithChain[]) => void,
): NodeJS.Timeout {
  let totalPriceUSD: number = 0;
  let round = 1;

  // This will store all fetched tokens indexed by their symbol
  const symbolMap: Record<string, ExtendedTokenAmount> = {};

  const tokensByChain: Record<string, Token[]> = Object.keys(tokens).reduce(
    (acc, chainId) => {
      acc[chainId] = [...tokens[Number(chainId)]];
      return acc;
    },
    {} as Record<string, Token[]>,
  );

  const fetchTokens = async () => {
    console.log(`\n--- Fetch Round ${round} of ${account} ---`);

    let tokensFetchedThisRound = 0;
    const fetchPromises: Promise<TokenAmount[]>[] = [];
    const chainsFetchedThisRound: string[] = [];

    for (const chainId of Object.keys(tokensByChain)) {
      if (tokensFetchedThisRound >= MAX_CROSS_CHAIN_FETCH) {
        break;
      }

      const tokens = tokensByChain[chainId];
      if (!tokens || tokens.length === 0) {
        continue;
      }

      const tokensToFetch = Math.min(
        MAX_TOKENS_PER_CHAIN,
        tokens.length,
        MAX_CROSS_CHAIN_FETCH - tokensFetchedThisRound,
      );

      if (tokensToFetch <= 0) {
        continue;
      }

      const tokenBatch = tokens.splice(0, tokensToFetch);
      tokensFetchedThisRound += tokensToFetch;
      chainsFetchedThisRound.push(chainId);

      fetchPromises.push(LifiGetTokenBalances(account, tokenBatch));
    }

    if (fetchPromises.length === 0) {
      console.log('No more tokens to fetch.');
      clearInterval(intervalId!);
      return;
    }

    const fetchResults = await Promise.all(fetchPromises);

    const detailedBalances: ExtendedTokenAmount[] = fetchResults
      .flat()
      .filter((t) => t.amount && t.amount > BigInt(0))
      .map((balance) => {
        const humanReadableBalance = getBalance(balance);
        const chain = chains.find((c) => c.id === balance.chainId);

        return {
          ...balance,
          chains: [],
          chainName: chain?.name,
          chainLogoURI: chain?.logoURI,
          totalPriceUSD: humanReadableBalance * parseFloat(balance.priceUSD),
        };
      });

    const roundPriceUSD = detailedBalances.reduce(
      (sum, balance) => sum + balance.totalPriceUSD!,
      0,
    );

    totalPriceUSD += roundPriceUSD;

    // Update symbolMap with fetched tokens and compute cumulated totals
    for (const balance of detailedBalances) {
      let existingToken = symbolMap[balance.symbol];

      if (existingToken) {
        // If this symbol already exists, add this balance as a "chain" entry
        existingToken.chains = existingToken.chains || [];
        const chain = chains.find((c) => c.id === balance.chainId);
        const humanReadableBalance = getBalance(balance);

        existingToken = {
          ...existingToken,
          chains: [
            ...existingToken.chains,
            {
              ...balance,
              chainLogoURI: chain?.logoURI,
              chainName: chain?.name,
              cumulatedBalance: humanReadableBalance,
              totalPriceUSD:
                humanReadableBalance * parseFloat(balance.priceUSD),
            },
          ],
        };

        existingToken.chains = sortBy(
          existingToken.chains,
          'totalPriceUSD',
        ).reverse();

        existingToken.cumulatedBalance = sumBy(
          existingToken.chains,
          'cumulatedBalance',
        );
        existingToken.cumulatedTotalUSD = sumBy(
          existingToken.chains,
          'totalPriceUSD',
        );
        symbolMap[balance.symbol] = existingToken;
      } else {
        balance.cumulatedBalance = getBalance(balance);

        // If this symbol is new, store it in the symbol map
        symbolMap[balance.symbol] = {
          ...balance,
          chains: [balance],
          cumulatedTotalUSD: balance.totalPriceUSD!,
        };
      }
    }

    // Pass the cumulative sum, cumulative price, and current state of the symbolMap to onProgress
    const combinedBalances = sortBy(
      Object.values(symbolMap),
      'cumulatedTotalUSD',
    ).reverse();

    onProgress(account, round, totalPriceUSD, combinedBalances);

    console.log(
      `Round ${round} on ${account} completed. Fetched ${tokensFetchedThisRound} tokens.`,
    );

    round += 1;
    if (Object.values(tokensByChain).every((tokens) => tokens.length === 0)) {
      // If all tokens are fetched, clear the interval and stop
      clearInterval(intervalId!);
      handleComplete(combinedBalances);
      console.log(`
All tokens have been successfully fetched for the account ${account}!`);
    }
  };

  // Function to clear intervals, making this process cancellable
  const intervalId = setInterval(fetchTokens, FETCH_DELAY);

  // First fetch
  fetchTokens();

  return intervalId;
}

//------------------------------
//------------------------------

interface Events {
  onProgress: (
    account: string,
    round: number,
    cumulativePriceUSD: number,
    fetchedBalances: ExtendedTokenAmount[],
  ) => void;
}

async function getTokens(
  account: Pick<Account, 'chainType' | 'address'>,
  events: Events,
): Promise<undefined | ExtendedTokenAmountWithChain[]> {
  try {
    const chains = await getChains({
      chainTypes: [account.chainType],
    });
    const { tokens } = await LifiGetTokens({
      chainTypes: [account.chainType],
    });

    return new Promise((resolve, reject) => {
      try {
        fetchAllTokensBalanceByChain(
          account.address!,
          chains,
          tokens,
          events.onProgress,
          (combinedBalance) => {
            resolve(combinedBalance);
          },
        );
      } catch (error) {
        reject(error);
      }
    });
  } catch (error) {
    console.error('An error occurred during the fetching process:', error);
  }
}

export function arraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = sortBy(arr1);
  const sortedArr2 = sortBy(arr2);

  return isEqual(sortedArr1, sortedArr2);
}

export function useTokens() {
  const { accounts } = useAccount();
  const { getFormattedCacheTokens, setCacheTokens, lastAddresses } =
    usePortfolioStore((state) => state);

  const handleProgress = (
    account: string,
    round: number,
    totalPriceUSD: number,
    fetchedBalances: ExtendedTokenAmount[],
  ) => {
    console.log(`\n** Round ${round} Account: ${account} **`);
    console.log(`Cumulative Price USD: $${totalPriceUSD.toFixed(2)}`);
    console.log(`Fetched Balances this Round:`, fetchedBalances);

    setCacheTokens(account, fetchedBalances);
  };

  const queries = useQueries({
    queries: accounts
      .filter((account) => account.isConnected && !!account?.address)
      .map((account) => ({
        queryKey: ['tokens', account.chainType, account.address],
        queryFn: () => getTokens(account, { onProgress: handleProgress }),
        // refetchInterval: 100000 * 60 * 60,
      })),
  });

  const isSuccess = queries.every(
    (query) => !query.isFetching && query.isSuccess,
  );
  const isFetching = queries.every((query) => query.isFetching);
  const refetch = () => queries.map((query) => query.refetch());

  useEffect(() => {
    if (!accounts) {
      return;
    }

    if (
      arraysEqual(
        accounts
          .filter((account) => account.isConnected && account?.address)
          .map((account) => account.address!),
        lastAddresses ?? [],
      )
    ) {
      return;
    }
    console.log('refetching coz changes address', accounts);

    refetch();
  }, [accounts]);

  return {
    queries,
    isSuccess,
    isFetching,
    refetch,
    data:
      getFormattedCacheTokens().cache.length === 0
        ? queries.map((query) => query.data ?? []).flat()
        : getFormattedCacheTokens().cache,
  };
}

export default getTokens;
