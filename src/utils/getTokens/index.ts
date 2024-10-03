import {
  ChainType,
  getChains,
  getTokenBalances as LifiGetTokenBalances,
  getTokens as LifiGetTokens,
} from '@lifi/sdk';
import { formatUnits } from 'viem';
import type { TokenAmount } from '@lifi/sdk';
import { Token } from '@lifi/widget';

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
  cumulatedBalance?: number;             // Cumulated balance across chains
  cumulatedTotalUSD?: number;            // Cumulated total USD across chains
  totalUSD?: number;                     // Total USD for this token (chain-specific)
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
const MAX_CROSS_CHAIN_FETCH = 1000; // Maximum tokens per fetch round across all chains
const MAX_TOKENS_PER_CHAIN = 2; // Maximum tokens to fetch per chain per round
const FETCH_DELAY = 5000;

// Custom setTimeout function returning a Promise
const customSetTimeout = (delay: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, delay));

// Main function to fetch all tokens in batches
/**
 * Fetches token balances across multiple chains with specified constraints.
 *
 * @param account - The account address to fetch token balances for.
 * @param onProgress - A callback invoked after each fetch round with cumulative data.
 * @returns A Promise that resolves to the final cumulative sum, total USD value, and all fetched balances.
 */

// Main function to fetch all tokens in batches
async function fetchAllTokensByChain(
  account: string,
  onProgress: (
    round: number,
    cumulativePriceUSD: number,
    fetchedBalances: ExtendedTokenAmount[]
  ) => void,
  handleComplete: () => void
): Promise<{
  totalPriceUSD: number;
  allBalances: ExtendedTokenAmount[];
}> {
  const chains = await getChains({
    chainTypes: [ChainType.EVM, ChainType.SVM],
  });
  const { tokens } = await LifiGetTokens({
    chainTypes: [ChainType.EVM, ChainType.SVM],
  });

  let totalPriceUSD: number = 0;
  let round = 1;

  // This will store all fetched tokens indexed by their symbol
  const symbolMap: Record<string, ExtendedTokenAmount> = {};

  const tokensByChain: Record<string, Token[]> = Object.keys(tokens).reduce(
    (acc, chainId) => {
      // @ts-expect-error
      acc[chainId] = [...tokens[Number(chainId)]];
      return acc;
    },
    {} as Record<string, Token[]>
  );

  while (true) {
    console.log(`\n--- Fetch Round ${round} ---`);

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
        MAX_CROSS_CHAIN_FETCH - tokensFetchedThisRound
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
      console.log("No more tokens to fetch.");
      break;
    }

    const fetchResults = await Promise.all(fetchPromises);

    const detailedBalances: ExtendedTokenAmount[] = fetchResults.flat()
      .filter((t) => t.amount && t.amount > BigInt(0))
      .map(
      (balance) => {
        const humanReadableBalance = getBalance(balance);
        const chain = chains.find((c) => c.id === balance.chainId);

        return {
          ...balance,
          chains: [],
          chainName: chain?.name,
          chainLogoURI: chain?.logoURI,
          totalUSD: humanReadableBalance * parseFloat(balance.priceUSD),
          totalPriceUSD: humanReadableBalance * parseFloat(balance.priceUSD),
        };
      }
    );

    const roundPriceUSD = detailedBalances.reduce(
      (sum, balance) => sum + balance.totalUSD!,
      0
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
              totalPriceUSD: humanReadableBalance * parseFloat(balance.priceUSD),
            },
          ]
        };
        console.log('will push balance', balance, existingToken)

        // Update cumulated balance and cumulated total USD for the existing token
        const cumulatedBalance = getBalance(existingToken) + getBalance(balance);
        const cumulatedTotalUSD =
          (existingToken.cumulatedTotalUSD || 0) + balance.totalUSD!;

        existingToken.cumulatedBalance = cumulatedBalance;
        existingToken.cumulatedTotalUSD = cumulatedTotalUSD;
        symbolMap[balance.symbol] = existingToken;
      } else {
        balance.cumulatedBalance = getBalance(balance);

        // If this symbol is new, store it in the symbol map
        symbolMap[balance.symbol] = { ...balance, chains: [balance], cumulatedTotalUSD: balance.totalUSD! };
      }
    }

    // Pass the cumulative sum, cumulative price, and current state of the symbolMap to onProgress
    const combinedBalances = Object.values(symbolMap)
      .sort((a, b) => (b.totalPriceUSD || 0) - (a.totalPriceUSD || 0));

    onProgress(round, totalPriceUSD, combinedBalances);

    console.log(
      `Round ${round} completed. Fetched ${tokensFetchedThisRound} tokens.`
    );

    round += 1;
    await customSetTimeout(FETCH_DELAY);
  }

  handleComplete();
  console.log("\nAll tokens have been successfully fetched!");

  // Flatten symbolMap into an array of tokens, each with its "chains"
  const allBalances = Object.values(symbolMap);

  return { totalPriceUSD, allBalances };
}
//------------------------------
//------------------------------

async function getTokens(
  account: string,
  handleProgress: (round: number, cumulativePriceUSD: number, fetchedBalances: ExtendedTokenAmount[]) => void,
  handleComplete: () => void,
): Promise<void> {
  try {
    fetchAllTokensByChain(account, handleProgress, handleComplete).catch(error => {
      console.error("An error occurred during the fetching process:", error);
    });
  } catch (error) {
    console.error(error);
  }
}

export default getTokens;
