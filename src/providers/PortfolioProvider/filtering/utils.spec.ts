import { describe, expect, it } from 'vitest';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';
import type { PortfolioPosition } from '../types';
import { OrderOptions, SortByOptions } from './types';
import type { BalancesFilter, PositionsFilter } from './types';
import {
  filterSortBalancesData,
  filterSortPositionsData,
  sanitizeValue,
} from './utils';

const makePosition = (
  protocol: string,
  chainId: number,
  netUsd: number,
): PortfolioPosition =>
  ({
    source: 'chain',
    protocol: { name: protocol },
    chain: { chainId },
    netUsd,
  }) as unknown as PortfolioPosition;

const makeBalance = (
  symbol: string,
  chainId: number,
  amountUSD: number,
): PortfolioBalance<WalletToken> =>
  ({
    amountUSD,
    token: { symbol, chainId, chainKey: `chain-${chainId}` },
  }) as unknown as PortfolioBalance<WalletToken>;

const positionValues = (
  grouped: Record<string, PortfolioPosition[]>,
): number[] =>
  Object.values(grouped)
    .flat()
    .map((p) => p.netUsd)
    .sort((a, b) => a - b);

const balanceValues = (
  grouped: Record<string, PortfolioBalance<WalletToken>[]>,
): number[] =>
  Object.values(grouped)
    .flat()
    .map((b) => b.amountUSD)
    .sort((a, b) => a - b);

describe('sanitizeValue', () => {
  it('rounds to two decimals and passes non-finite through', () => {
    expect(sanitizeValue(0.099)).toBe(0.1);
    expect(sanitizeValue(Infinity)).toBe(Infinity);
    expect(sanitizeValue(NaN)).toBeNaN();
  });
});

describe('filterSortPositionsData $0.10 hard floor', () => {
  it('hides positions that round below $0.10 with no slider filter', () => {
    const positions = [
      makePosition('aave', 1, 0.05),
      makePosition('compound', 1, 0.099),
      makePosition('yearn', 1, 0.1),
      makePosition('morpho', 1, 5),
    ];
    const filter: PositionsFilter = {};

    const result = filterSortPositionsData(
      positions,
      filter,
      SortByOptions.VALUE,
      OrderOptions.DESC,
    );

    expect(positionValues(result)).toEqual([0.099, 0.1, 5]);
  });

  it('applies the floor beneath a $0 slider minimum', () => {
    const positions = [
      makePosition('aave', 1, 0.05),
      makePosition('yearn', 1, 2),
    ];
    const filter: PositionsFilter = { minValue: 0 };

    const result = filterSortPositionsData(
      positions,
      filter,
      SortByOptions.VALUE,
      OrderOptions.DESC,
    );

    expect(positionValues(result)).toEqual([2]);
  });
});

describe('filterSortBalancesData $0.10 hard floor', () => {
  it('hides balances that round below $0.10 with no slider filter', () => {
    const balancesByAddress = {
      '0xabc': {
        ETH: [makeBalance('ETH', 1, 0.05)],
        USDC: [makeBalance('USDC', 1, 0.099)],
        DAI: [makeBalance('DAI', 1, 0.1)],
        WBTC: [makeBalance('WBTC', 1, 100)],
      },
    };
    const filter: BalancesFilter = {};

    const result = filterSortBalancesData(
      balancesByAddress,
      filter,
      SortByOptions.VALUE,
      OrderOptions.DESC,
    );

    expect(balanceValues(result)).toEqual([0.099, 0.1, 100]);
  });

  it('applies the floor beneath a $0 slider minimum', () => {
    const balancesByAddress = {
      '0xabc': {
        ETH: [makeBalance('ETH', 1, 0.05)],
        WBTC: [makeBalance('WBTC', 1, 100)],
      },
    };
    const filter: BalancesFilter = { minValue: 0 };

    const result = filterSortBalancesData(
      balancesByAddress,
      filter,
      SortByOptions.VALUE,
      OrderOptions.DESC,
    );

    expect(balanceValues(result)).toEqual([100]);
  });
});
