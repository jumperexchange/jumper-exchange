import {
  ChainType,
  getChains,
  getTokenBalances,
  getTokens as LifiGetTokens,
} from '@lifi/sdk';
import { formatUnits } from 'viem';
import coins from './coins';
import type { ExtendedChain, TokenAmount } from '@lifi/sdk';

export interface Chain extends ExtendedChain, Price {}

interface Price {
  amount?: bigint;
  decimals: number;
  address: string;
  totalPriceUSD: number;
  formattedBalance: number;
}

// @ts-ignore
export interface ExtendedTokenAmount extends TokenAmount, Partial<Price> {
  chains: Chain[];
}

function getBalance(tb: Partial<TokenAmount>): number {
  return tb?.amount && tb?.decimals
    ? Number(formatUnits(tb.amount, tb.decimals))
    : 0;
}

function sum(token: ExtendedTokenAmount): number {
  return token.chains
    .filter((t) => !!t.amount)
    .reduce((acc, t) => acc + Number(formatUnits(t.amount!, t.decimals)), 0);
}

function transform(
  tokenBalances: TokenAmount[],
  chains: ExtendedChain[],
): ExtendedTokenAmount[] {
  const tokenMap: Record<string, ExtendedTokenAmount> = {};

  tokenBalances.forEach((tb) => {
    if (!tokenMap[tb.symbol]) {
      tokenMap[tb.symbol] = { ...tb, chains: [] };
    }

    const chain = chains.find((c) => c.id === tb.chainId);
    if (chain) {
      const balance = getBalance(tb);
      tokenMap[tb.symbol].chains.push({
        ...chain,
        address: tb.address,
        decimals: tb.decimals,
        formattedBalance: balance,
        amount: tb.amount,
        totalPriceUSD: balance * Number(tb.priceUSD || 1),
      });
    }
  });

  return Object.values(tokenMap)
    .map((tb) => {
      const balance = sum(tb);
      return {
        ...tb,
        formattedBalance: balance,
        totalPriceUSD: balance * Number(tb.priceUSD || 1),
      };
    })
    .sort((a, b) => (b.totalPriceUSD || 0) - (a.totalPriceUSD || 0));
}

async function getTokens(
  account: string,
  isFull = false,
): Promise<ExtendedTokenAmount[] | undefined> {
  try {
    const chains = await getChains({
      chainTypes: [ChainType.EVM, ChainType.SVM],
    });
    const tokens = await LifiGetTokens({
      chainTypes: [ChainType.EVM, ChainType.SVM],
    });

    const filteredArray = isFull
      ? Object.values(tokens.tokens).flat()
      : Object.values(tokens.tokens)
          .flat()
          .filter((item) =>
            new Set(coins.map((coin) => `${coin.chainId}-${coin.address}`)).has(
              `${item.chainId}-${item.address}`,
            ),
          );

    const tokenBalances = await getTokenBalances(account, filteredArray);

    return transform(
      tokenBalances.filter((s) => s?.amount && s.amount > 0),
      chains,
    ).filter((tb) => Math.round(tb.totalPriceUSD || 0) > 0);
  } catch (error) {
    console.error(error);
  }
}

export default getTokens;
