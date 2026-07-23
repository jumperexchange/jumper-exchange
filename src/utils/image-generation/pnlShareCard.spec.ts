import { describe, expect, it } from 'vitest';
import {
  buildPnlShareImageUrl,
  buildPnlShareLandingUrl,
  buildPnlShareLink,
  formatAmountWon,
  formatSwapSize,
  formatUsdCompact,
  type PnlShareCardInput,
} from './pnlShareCard';

const CARD: PnlShareCardInput = {
  amountWon: 980,
  swapSize: 120000,
  fromToken: 'USDC',
  toToken: 'ETH',
  referralCode: 'ABC123',
};

describe('buildPnlShareImageUrl', () => {
  it('serializes card inputs into the share-pnl query string', () => {
    const url = new URL(buildPnlShareImageUrl(CARD, 'https://example.com'));

    expect(url.pathname).toBe('/api/share-pnl');
    expect(url.searchParams.get('amountWon')).toBe('980');
    expect(url.searchParams.get('swapSize')).toBe('120000');
    expect(url.searchParams.get('fromToken')).toBe('USDC');
    expect(url.searchParams.get('toToken')).toBe('ETH');
    expect(url.searchParams.get('referralCode')).toBe('ABC123');
  });

  it('omits the referral code when not provided', () => {
    const url = new URL(
      buildPnlShareImageUrl(
        { amountWon: 5, swapSize: 100, fromToken: 'ETH', toToken: 'USDC' },
        'https://example.com',
      ),
    );

    expect(url.searchParams.has('referralCode')).toBe(false);
  });
});

describe('buildPnlShareLandingUrl', () => {
  it('serializes card inputs into the share landing query string', () => {
    const url = new URL(buildPnlShareLandingUrl(CARD, 'https://example.com'));

    expect(url.pathname).toBe('/share/pnl');
    expect(url.searchParams.get('amountWon')).toBe('980');
    expect(url.searchParams.get('fromToken')).toBe('USDC');
    expect(url.searchParams.get('toToken')).toBe('ETH');
    expect(url.searchParams.get('referralCode')).toBe('ABC123');
  });
});

describe('formatUsdCompact', () => {
  it('keeps 2 decimals for fractional amounts (regression: +$0.24 must not round to 0)', () => {
    expect(formatUsdCompact(0.24)).toBe('0.24');
    expect(formatUsdCompact(0.2)).toBe('0.20');
    expect(formatUsdCompact(100.5)).toBe('100.50');
  });

  it('drops decimals for whole numbers', () => {
    expect(formatUsdCompact(980)).toBe('980');
    expect(formatUsdCompact(120000)).toBe('120K');
  });

  it('abbreviates large values with KMB notation', () => {
    expect(formatUsdCompact(1200)).toBe('1.2K');
    expect(formatUsdCompact(1250000)).toBe('1.25M');
  });

  it('prefixes amount won with +$ and swap size with $', () => {
    expect(formatAmountWon(0.24)).toBe('+$0.24');
    expect(formatSwapSize(100.29)).toBe('$100.29');
  });
});

describe('buildPnlShareLink', () => {
  it('appends the referral code when provided', () => {
    expect(buildPnlShareLink('ABC123')).toBe('https://jumper.xyz/?ref=ABC123');
  });

  it('returns the base link without a referral code', () => {
    expect(buildPnlShareLink()).toBe('https://jumper.xyz');
  });
});
