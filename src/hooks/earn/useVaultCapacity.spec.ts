// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useToken } from '@/hooks/useToken';
import type { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { useVaultCapacity } from './useVaultCapacity';

vi.mock('@/hooks/useToken', () => ({ useToken: vi.fn() }));

const mockUseToken = (priceUSD: string | undefined) => {
  vi.mocked(useToken).mockReturnValue({
    token: priceUSD
      ? ({
          priceUSD,
          hasPriceUSD: () => parseFloat(priceUSD) > 0,
        } as any)
      : undefined,
    error: null,
    isError: false,
    isLoading: false,
    isSuccess: true,
    updatedAt: 0,
  });
};

const makeOpportunity = (
  overrides: Partial<EarnOpportunityWithLatestAnalytics> = {},
): EarnOpportunityWithLatestAnalytics =>
  ({
    asset: {
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000001',
      chain: { chainId: 1, chainKey: 'ETH' },
    },
    ...overrides,
  }) as EarnOpportunityWithLatestAnalytics;

describe('useVaultCapacity', () => {
  it('returns unknown when there is no capacity and no capInDollar', () => {
    mockUseToken(undefined);
    const { result } = renderHook(() =>
      useVaultCapacity(makeOpportunity(), { enabled: true }),
    );
    expect(result.current).toEqual({ state: 'unknown' });
  });

  it('returns unlimited when capacity.unlimited is true', () => {
    mockUseToken(undefined);
    const { result } = renderHook(() =>
      useVaultCapacity(makeOpportunity({ capacity: { unlimited: true } }), {
        enabled: true,
      }),
    );
    expect(result.current).toEqual({ state: 'unlimited' });
  });

  it('converts native amounts to USD using the token price', () => {
    mockUseToken('4700');
    const { result } = renderHook(() =>
      useVaultCapacity(
        makeOpportunity({
          capacity: {
            // 2,700,000 WETH remaining/max at 18 decimals
            remaining: '2700000000000000000000000',
            max: '2700000000000000000000000',
          },
        }),
        { enabled: true },
      ),
    );
    expect(result.current).toEqual({
      state: 'capped',
      maxUsd: 2_700_000 * 4700,
      remainingUsd: 2_700_000 * 4700,
    });
  });

  it('falls back to native units + symbol while the price is unavailable', () => {
    mockUseToken(undefined);
    const { result } = renderHook(() =>
      useVaultCapacity(
        makeOpportunity({
          capacity: {
            remaining: '500000000000000000000',
            max: '600000000000000000000',
          },
        }),
        { enabled: true },
      ),
    );
    expect(result.current).toEqual({
      state: 'capped-native',
      max: 600,
      remaining: 500,
      symbol: 'WETH',
    });
  });

  it('falls back to the deprecated capInDollar field when capacity is absent', () => {
    mockUseToken(undefined);
    const { result } = renderHook(() =>
      useVaultCapacity(
        makeOpportunity({ capacity: undefined, capInDollar: '1000000' }),
        { enabled: true },
      ),
    );
    expect(result.current).toEqual({ state: 'capped', maxUsd: 1000000 });
  });

  it('ignores a zero or non-numeric capInDollar fallback', () => {
    mockUseToken(undefined);
    const { result } = renderHook(() =>
      useVaultCapacity(
        makeOpportunity({ capacity: undefined, capInDollar: '0' }),
        { enabled: true },
      ),
    );
    expect(result.current).toEqual({ state: 'unknown' });
  });

  it('treats an upstream max of 0 as unknown (JUM-972 QA finding #4)', () => {
    mockUseToken('4700');
    const { result } = renderHook(() =>
      useVaultCapacity(
        makeOpportunity({ capacity: { remaining: '0', max: '0' } }),
        { enabled: true },
      ),
    );
    expect(result.current).toEqual({ state: 'unknown' });
  });

  it('treats a malformed uint256 string as unknown instead of throwing (JUM-972 QA finding #5)', () => {
    mockUseToken('4700');
    const { result } = renderHook(() =>
      useVaultCapacity(
        makeOpportunity({
          capacity: { remaining: 'not-a-number', max: '600000000000000000000' },
        }),
        { enabled: true },
      ),
    );
    expect(result.current).toEqual({ state: 'unknown' });
  });

  it('does not request the token price when disabled', () => {
    mockUseToken(undefined);
    renderHook(() =>
      useVaultCapacity(
        makeOpportunity({
          capacity: {
            remaining: '500000000000000000000',
            max: '600000000000000000000',
          },
        }),
        { enabled: false },
      ),
    );
    expect(vi.mocked(useToken).mock.calls[0][2]).toMatchObject({
      enabled: false,
    });
  });
});
