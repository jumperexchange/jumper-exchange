import { describe, expect, it, vi } from 'vitest';
import { parsePnlShareParams, pnlShareSchema } from './pnlShareSchema';

const BASE_URL = 'http://localhost:3000/api/share-pnl';

function buildUrl(params: Record<string, string>): string {
  const search = new URLSearchParams(params).toString();
  return `${BASE_URL}?${search}`;
}

describe('pnlShareSchema', () => {
  it('parses a valid set of params', () => {
    const result = parsePnlShareParams(
      buildUrl({
        amountWon: '980',
        swapSize: '120000',
        fromToken: 'USDC',
        toToken: 'ETH',
        referralCode: 'ABC123',
      }),
    );

    expect(result).toEqual({
      amountWon: 980,
      swapSize: 120000,
      fromToken: 'USDC',
      toToken: 'ETH',
      referralCode: 'ABC123',
    });
  });

  it('strips currency formatting from amounts', () => {
    const result = parsePnlShareParams(
      buildUrl({
        amountWon: '$1,250.50',
        swapSize: '$120,000',
        fromToken: 'USDC',
        toToken: 'ETH',
      }),
    );

    expect(result.amountWon).toBe(1250.5);
    expect(result.swapSize).toBe(120000);
    expect(result.referralCode).toBeUndefined();
  });

  it('accepts token symbols with dots and digits', () => {
    const result = pnlShareSchema.safeParse({
      amountWon: '10',
      swapSize: '100',
      fromToken: 'USDC.e',
      toToken: '1INCH',
    });

    expect(result.success).toBe(true);
  });

  it('throws when a required param is missing', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() =>
      parsePnlShareParams(
        buildUrl({
          swapSize: '120000',
          fromToken: 'USDC',
          toToken: 'ETH',
        }),
      ),
    ).toThrow('Invalid parameters for the social share card');

    errorSpy.mockRestore();
  });

  it('rejects an invalid token symbol', () => {
    const result = pnlShareSchema.safeParse({
      amountWon: '10',
      swapSize: '100',
      fromToken: 'US DC',
      toToken: 'ETH',
    });

    expect(result.success).toBe(false);
  });
});
