import {
  ChainType,
  createConfig,
  EVM,
  getChains,
  getTokenBalances,
  getTokens as LifiGetTokens,
  Solana,
} from '@lifi/sdk';
import { formatUnits } from 'viem';
import coins from './coins';
import type { ExtendedChain, TokenAmount } from '@lifi/types';
import { Token } from '@lifi/widget';

interface Chain extends ExtendedChain, Price {}

interface Price {
  amount?: bigint;
  totalPriceUSD: number;
  formattedBalance: number;
}

export interface ExtendedTokenAmount extends TokenAmount, Partial<Price> {
  chains: Chain[];
}

function getBalance(tb: Partial<TokenAmount>) {
  return (
    (tb?.amount &&
      tb?.decimals &&
      Number(formatUnits(tb.amount, tb.decimals))) ||
    0
  );
}

function transform(
  tokenBalances: TokenAmount[],
  chains: ExtendedChain[],
): ExtendedTokenAmount[] {
  const tokenMap: Record<string, ExtendedTokenAmount> = {};

  tokenBalances.forEach((tb) => {
    if (tokenMap[tb.symbol]) {
      // Merge balances
      tokenMap[tb.symbol].amount =
        BigInt(tokenMap[tb.symbol].amount || 0) + BigInt(tb.amount || 0);
    } else {
      tokenMap[tb.symbol] = {
        ...tb,
        chains: [],
      };
    }

    const chain = chains.find((c) => c.id === tb.chainId);
    if (chain) {
      const balance = getBalance(tb);
      tokenMap[tb.symbol].chains?.push({
        ...chain,
        formattedBalance: balance,
        amount: tb.amount,
        totalPriceUSD: balance * Number(tb.priceUSD || 1) ?? 0,
      });
    }
  });

  let mergedTokenBalances = Object.values(tokenMap);

  mergedTokenBalances = mergedTokenBalances.map((tb) => {
    const balance = getBalance(tb);

    return {
      ...tb,
      formattedBalance: balance,
      totalPriceUSD: balance * Number(tb.priceUSD || 1) ?? 0,
    };
  });

  return mergedTokenBalances.sort(
    (a, b) => (b.totalPriceUSD || 0) - (a.totalPriceUSD || 0),
  );
}

async function index(account: string) {
  try {
    createConfig({
      providers: [EVM(), Solana()],
      integrator: process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR,
      preloadChains: true,
    });

    // Can be server side call
    const chains = await getChains({
      chainTypes: [ChainType.EVM, ChainType.SVM],
    });

    const tokens = await LifiGetTokens({
      chainTypes: [ChainType.EVM, ChainType.SVM],
    });

    const filterSet = new Set(
      coins.map(item => `${item.chainId}-${item.address}`)
    );

    let filteredArray: Token[]= [];

    for (const [, tks] of Object.entries(tokens.tokens)) {
      filteredArray = filteredArray.concat(tks.filter(item =>
        filterSet.has(`${item.chainId}-${item.address}`)
      ));
    }

    const tokenBalances = await getTokenBalances(
      account,
      filteredArray,
    );

    const transformedTokenBalances = transform(
      tokenBalances.filter((s) => s?.amount && s.amount > 0),
      chains,
    ).filter((tb) => Math.round(tb.totalPriceUSD || 0) > 0);

    return transformedTokenBalances;
  } catch (error) {
    console.error(error);
  }
}

export default index;
