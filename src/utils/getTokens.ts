import type { TokenAmount, ExtendedChain } from '@lifi/sdk';
import {
  getChains,
  getTokenBalances as LifiGetTokenBalances,
  getTokens as LifiGetTokens,
} from '@lifi/sdk';
import { formatUnits } from 'viem';
import type { Token, TokensResponse } from '@lifi/widget';
import type { Account } from '@/hooks/useAccounts';
import { sumBy } from 'lodash';

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

// Define the ResultTokenBalance interface as per your specifications
export interface ResultTokenBalance {
  symbol: string;
  decimals: number;
  name: string;
  coinKey?: string; // Assuming CoinKey is a string; adjust as needed
  logoURI?: string;
  address: string;
  priceUSD: string;
  amount?: bigint;
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
  handleComplete: () => void,
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

        existingToken.chains.sort((a, b) => (b.totalPriceUSD || 0) - (a.totalPriceUSD || 0));

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
    const combinedBalances = Object.values(symbolMap);

    onProgress(account, round, totalPriceUSD, combinedBalances);

    console.log(
      `Round ${round} on ${account} completed. Fetched ${tokensFetchedThisRound} tokens.`,
    );

    round += 1;
    if (Object.values(tokensByChain).every((tokens) => tokens.length === 0)) {
      // If all tokens are fetched, clear the interval and stop
      clearInterval(intervalId!);
      handleComplete();
      console.log('\nAll tokens have been successfully fetched!');
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
  onComplete: () => void;
  onInit: () => void;
}

async function getTokens(
  account: Pick<Account, 'chainType' | 'address'>,
  events: Events,
): Promise<NodeJS.Timeout | undefined> {
  try {
    events.onInit();
    const chains = await getChains({
      chainTypes: [account.chainType],
    });
    const { tokens } = await LifiGetTokens({
      chainTypes: [account.chainType],
    });

    return fetchAllTokensBalanceByChain(
      account.address!,
      chains,
      tokens,
      events.onProgress,
      events.onComplete,
    );
  } catch (error) {
    console.error('An error occurred during the fetching process:', error);
  }
}

export default getTokens;
