import type { Route } from '@lifi/sdk';
import { describe, expect, it } from 'vitest';
import {
  deriveExtraOutputCard,
  isEligibleQuote,
  type QuoteSelection,
} from './deriveExtraOutputCard';

interface QuoteOverrides {
  id?: string;
  toAmountUSD?: string;
  fromAmountUSD?: string;
  fromSymbol?: string;
  toSymbol?: string;
  tags?: string[];
  tool?: string;
  toolName?: string;
}

function buildQuote({
  id = 'quote',
  toAmountUSD = '100000',
  fromAmountUSD = '120000',
  fromSymbol = 'USDC',
  toSymbol = 'ETH',
  tags = ['SIMULATED_BY_EVM'],
  tool = 'lifidexaggregator',
  toolName = 'LI.FI DEX Aggregator',
}: QuoteOverrides): Route {
  return {
    id,
    fromAmountUSD,
    toAmountUSD,
    fromToken: { symbol: fromSymbol },
    toToken: { symbol: toSymbol },
    tags,
    steps: [{ tool, toolDetails: { key: tool, name: toolName } }],
  } as unknown as Route;
}

function selectionOf(selected: Route, others: Route[]): QuoteSelection {
  return { route: selected, routes: [selected, ...others] };
}

describe('isEligibleQuote', () => {
  it('accepts simulated quotes', () => {
    expect(isEligibleQuote(buildQuote({ tags: ['SIMULATED_BY_EVM'] }))).toBe(
      true,
    );
    expect(
      isEligibleQuote(buildQuote({ tags: ['SIMULATED_BY_COMPOSER'] })),
    ).toBe(true);
  });

  it('accepts CowSwap and 1inch Fusion regardless of simulation', () => {
    expect(
      isEligibleQuote(
        buildQuote({ tags: [], tool: 'cow', toolName: 'CoW Swap' }),
      ),
    ).toBe(true);
    expect(
      isEligibleQuote(
        buildQuote({
          tags: [],
          tool: '1inch-fusion',
          toolName: '1inch Fusion',
        }),
      ),
    ).toBe(true);
  });

  it('rejects non-simulated quotes from other providers', () => {
    expect(
      isEligibleQuote(
        buildQuote({
          tags: ['RECOMMENDED'],
          tool: 'uniswap',
          toolName: 'Uniswap',
        }),
      ),
    ).toBe(false);
  });
});

describe('deriveExtraOutputCard', () => {
  it('surfaces the delta vs the median of eligible quotes', () => {
    const selected = buildQuote({ id: 'sel', toAmountUSD: '100980' });
    const others = [
      buildQuote({ id: 'a', toAmountUSD: '100000' }),
      buildQuote({ id: 'b', toAmountUSD: '99000' }),
    ];

    // median([99000, 100000, 100980]) = 100000; 100980 - 100000 = 980
    expect(deriveExtraOutputCard(selectionOf(selected, others))).toEqual({
      amountWon: 980,
      swapSize: 120000,
      fromToken: 'USDC',
      toToken: 'ETH',
    });
  });

  it('ignores ineligible quotes when computing the median', () => {
    const selected = buildQuote({ id: 'sel', toAmountUSD: '100980' });
    const others = [
      buildQuote({ id: 'a', toAmountUSD: '100000' }),
      buildQuote({ id: 'b', toAmountUSD: '99000' }),
      // Would drag the median down, but is not an eligible provider.
      buildQuote({
        id: 'junk',
        toAmountUSD: '1',
        tags: [],
        tool: 'uniswap',
        toolName: 'Uniswap',
      }),
    ];

    expect(
      deriveExtraOutputCard(selectionOf(selected, others))?.amountWon,
    ).toBe(980);
  });

  it('returns null when there are fewer than 3 eligible quotes', () => {
    const selected = buildQuote({ id: 'sel', toAmountUSD: '100980' });
    const others = [buildQuote({ id: 'a', toAmountUSD: '100000' })];

    expect(deriveExtraOutputCard(selectionOf(selected, others))).toBeNull();
  });

  it('returns null when the delta is below the $10 threshold', () => {
    const selected = buildQuote({ id: 'sel', toAmountUSD: '100005' });
    const others = [
      buildQuote({ id: 'a', toAmountUSD: '100000' }),
      buildQuote({ id: 'b', toAmountUSD: '99995' }),
    ];

    // 100005 - median(100000) = 5, below the $10 minimum
    expect(deriveExtraOutputCard(selectionOf(selected, others))).toBeNull();
  });

  it('shows the card when the delta is exactly the $10 threshold', () => {
    const selected = buildQuote({ id: 'sel', toAmountUSD: '100010' });
    const others = [
      buildQuote({ id: 'a', toAmountUSD: '100000' }),
      buildQuote({ id: 'b', toAmountUSD: '99995' }),
    ];

    // 100010 - median(100000) = 10, meets the "$10 or more" rule
    expect(
      deriveExtraOutputCard(selectionOf(selected, others))?.amountWon,
    ).toBe(10);
  });

  it('returns null for same-symbol routes (e.g. a bridge)', () => {
    const selected = buildQuote({
      id: 'sel',
      toAmountUSD: '100980',
      fromSymbol: 'USDC',
      toSymbol: 'USDC',
    });
    const others = [
      buildQuote({
        id: 'a',
        toAmountUSD: '100000',
        fromSymbol: 'USDC',
        toSymbol: 'USDC',
      }),
      buildQuote({
        id: 'b',
        toAmountUSD: '99000',
        fromSymbol: 'USDC',
        toSymbol: 'USDC',
      }),
    ];

    expect(deriveExtraOutputCard(selectionOf(selected, others))).toBeNull();
  });
});
