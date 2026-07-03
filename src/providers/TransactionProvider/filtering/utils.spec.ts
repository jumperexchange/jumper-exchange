import { describe, expect, it } from 'vitest';
import { sanitizeTransactionFilterXor } from './utils';
import type { TransactionFilterUI } from './TransactionFilteringContext';

describe('sanitizeTransactionFilterXor', () => {
  it('drops chains when both chains and assets are set', () => {
    const filter: TransactionFilterUI = {
      chains: ['1', '137'],
      assets: ['1:0xabc'],
    };
    expect(sanitizeTransactionFilterXor(filter)).toEqual({
      assets: ['1:0xabc'],
    });
  });

  it('keeps chains when only chains are set', () => {
    const filter: TransactionFilterUI = { chains: ['1', '137'] };
    expect(sanitizeTransactionFilterXor(filter)).toBe(filter);
  });

  it('keeps assets when only assets are set', () => {
    const filter: TransactionFilterUI = { assets: ['1:0xabc', '137:0xdef'] };
    expect(sanitizeTransactionFilterXor(filter)).toBe(filter);
  });

  it('leaves empty arrays untouched', () => {
    const filter: TransactionFilterUI = { chains: [], assets: [] };
    expect(sanitizeTransactionFilterXor(filter)).toBe(filter);
  });

  it('preserves all other filter fields when dropping chains', () => {
    const filter: TransactionFilterUI = {
      wallet: '0x123',
      chains: ['1'],
      assets: ['137:0xdef'],
      types: ['send'],
      minDate: '2024-01-01T00:00:00.000Z',
      maxDate: '2024-12-31T00:00:00.000Z',
    };
    expect(sanitizeTransactionFilterXor(filter)).toEqual({
      wallet: '0x123',
      assets: ['137:0xdef'],
      types: ['send'],
      minDate: '2024-01-01T00:00:00.000Z',
      maxDate: '2024-12-31T00:00:00.000Z',
    });
  });
});
