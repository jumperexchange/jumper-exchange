// Constants
import type {
  ExtendedChain,
  Token,
  TokenAmount,
  TokensResponse,
} from '@lifi/sdk';
import { getTokenBalances as LifiGetTokenBalances } from '@lifi/sdk';
import type {
  ExtendedTokenAmount,
  ExtendedTokenAmountWithChain,
} from '@/utils/getTokens/index';
import { getBalance } from '@/utils/getTokens/utils';

const MAX_CROSS_CHAIN_FETCH = 10000; // Maximum tokens per fetch round across all chains
const MAX_TOKENS_PER_CHAIN = 300; // Maximum tokens to fetch per chain per round
const FETCH_DELAY = 3000;
const MAX_TOKENS_FIRST_ROUND = 7; // Maximum tokens to fetch on the first load

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
export function fetchAllTokensBalanceByChain(
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

      // for first round, load only the top 10 tokens to load faster. Then load more tokens each round.
      const tokensToFetchThisRound =
        round === 1
          ? MAX_TOKENS_FIRST_ROUND
          : MAX_CROSS_CHAIN_FETCH - tokensFetchedThisRound;
      const tokensToFetch = Math.min(
        MAX_TOKENS_PER_CHAIN,
        tokens.length,
        tokensToFetchThisRound,
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

        existingToken.chains = existingToken.chains.sort(
          (a, b) => (b.totalPriceUSD ?? 0) - (a.totalPriceUSD ?? 0),
        );
        existingToken.cumulatedBalance = existingToken.chains.reduce(
          (sum, chain) => sum + (chain.cumulatedBalance ?? 0),
          0,
        );
        existingToken.cumulatedTotalUSD = existingToken.chains.reduce(
          (sum, chain) => sum + (chain.totalPriceUSD ?? 0),
          0,
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
    const combinedBalances = Object.values(symbolMap).sort((a, b) => {
      return (b.cumulatedTotalUSD ?? 0) - (a.cumulatedTotalUSD ?? 0);
    });

    onProgress(account, round, totalPriceUSD, combinedBalances);

    round += 1;
    if (Object.values(tokensByChain).every((tokens) => tokens.length === 0)) {
      // If all tokens are fetched, clear the interval and stop
      clearInterval(intervalId!);
      handleComplete(combinedBalances);
    }
  };

  // Function to clear intervals, making this process cancellable
  const intervalId = setInterval(fetchTokens, FETCH_DELAY);

  // First fetch
  fetchTokens();

  return intervalId;
}
