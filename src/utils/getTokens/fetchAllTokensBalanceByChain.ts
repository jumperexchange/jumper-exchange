import type {
  ExtendedChain,
  Token,
  TokenAmount,
  TokensResponse,
} from '@lifi/sdk';
import { getTokenBalances as LifiGetTokenBalances } from '@lifi/sdk';
import type { PortfolioToken } from '@/types/tokens';
import { getBalance } from '@/utils/getTokens/utils';

type PortfolioTokenWithRelated = PortfolioToken & {
  relatedTokens: Omit<PortfolioToken, 'relatedTokens'>[];
};

const MAX_CROSS_CHAIN_FETCH = 10000; // Maximum tokens per fetch round across all chains
const MAX_TOKENS_PER_CHAIN = 300; // Maximum tokens to fetch per chain per round
const FETCH_DELAY = 3000;
const MAX_TOKENS_FIRST_ROUND = 7; // Maximum tokens to fetch on the first load

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
export function fetchAllTokensBalanceByChain(
  account: string,
  chains: ExtendedChain[],
  tokens: TokensResponse['tokens'],
  onProgress: (
    account: string,
    round: number,
    cumulativePriceUSD: number,
    fetchedBalances: PortfolioToken[],
  ) => void,
  handleComplete: (combinedWallet: PortfolioToken[]) => void,
): NodeJS.Timeout {
  let totalPriceUSD: number = 0;
  let round = 1;

  const symbolMap: Record<string, PortfolioTokenWithRelated> = {};

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

    const detailedBalances = fetchResults
      .flat()
      .filter((t) => t.amount && t.amount > BigInt(0))
      .map((tokenBalance) => {
        const humanReadableBalance = getBalance(tokenBalance);
        const priceUSD = parseFloat(tokenBalance.priceUSD);
        const totalPriceUSD = isNaN(priceUSD)
          ? 0
          : humanReadableBalance * priceUSD;
        const chain = chains.find((c) => c.id === tokenBalance.chainId);

        return {
          address: tokenBalance.address,
          name: tokenBalance.name,
          symbol: tokenBalance.symbol,
          decimals: tokenBalance.decimals,
          logo: tokenBalance.logoURI,
          chain: {
            chainId: tokenBalance.chainId,
            chainKey: chain?.key ?? chain?.name ?? '',
          },
          balance: humanReadableBalance,
          totalPriceUSD,
        };
      });

    const roundPriceUSD = detailedBalances.reduce(
      (sum, token) => sum + token.totalPriceUSD,
      0,
    );

    totalPriceUSD += roundPriceUSD;

    for (const token of detailedBalances) {
      const existingToken = symbolMap[token.symbol];

      if (existingToken) {
        const updatedRelatedTokens = [...existingToken.relatedTokens, token];
        updatedRelatedTokens.sort(
          (a, b) => (b.totalPriceUSD ?? 0) - (a.totalPriceUSD ?? 0),
        );

        const cumulatedBalance = updatedRelatedTokens.reduce(
          (sum, t) => sum + t.balance,
          0,
        );
        const cumulatedTotalUSD = updatedRelatedTokens.reduce(
          (sum, t) => sum + t.totalPriceUSD,
          0,
        );

        symbolMap[token.symbol] = {
          ...existingToken,
          balance: cumulatedBalance,
          totalPriceUSD: cumulatedTotalUSD,
          relatedTokens: updatedRelatedTokens,
        };
      } else {
        symbolMap[token.symbol] = {
          ...token,
          relatedTokens: [token],
        };
      }
    }

    const combinedBalances = Object.values(symbolMap).sort((a, b) => {
      return (b.totalPriceUSD ?? 0) - (a.totalPriceUSD ?? 0);
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
