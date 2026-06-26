// @vitest-environment jsdom
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import { useTokens } from '@/hooks/useTokens';
import type { DeFiReacherReward, MerklReward } from '@/types/rewards';
import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAvailableRewards } from './useAvailableRewards';

vi.mock('@tanstack/react-query', () => ({ useQuery: vi.fn() }));
vi.mock('@/hooks/useTokens', () => ({ useTokens: vi.fn() }));
vi.mock('@/hooks/tokens/useTokenAmountInput', () => ({
  useTokenAmountInput: vi.fn(),
}));
vi.mock('@/types/tokens', () => ({ createWalletToken: vi.fn() }));

const makeMerklReward = (
  overrides: Partial<MerklReward> = {},
): MerklReward => ({
  type: 'merkl',
  chainId: 1,
  address: '0x1111111111111111111111111111111111111111',
  symbol: 'TKN',
  amountToClaim: 10,
  tokenDecimals: 18,
  proof: [],
  claimingAddress: '0x0000000000000000000000000000000000000000',
  accumulatedAmountForContractBN: '10000000000000000000',
  amountAccumulated: 10,
  ...overrides,
});

const makeDeFiReacherReward = (
  overrides: Partial<DeFiReacherReward> = {},
): DeFiReacherReward => ({
  type: 'defi-reacher',
  chainId: 1,
  address: '0x2222222222222222222222222222222222222222',
  symbol: 'TKN2',
  amountToClaim: 10,
  tokenDecimals: 18,
  campaignId: 'campaign-1',
  contractAddress: '0x3333333333333333333333333333333333333333',
  ...overrides,
});

const mockGetToken = vi.fn();

const mockUseQuery = (
  rewards: (MerklReward | DeFiReacherReward)[],
  overrides = {},
) => {
  vi.mocked(useQuery).mockReturnValue({
    data: rewards,
    isSuccess: true,
    isLoading: false,
    ...overrides,
  } as any);
};

beforeEach(() => {
  mockUseQuery([]);
  vi.mocked(useTokens).mockReturnValue({ getToken: mockGetToken } as any);
  vi.mocked(useTokenAmountInput).mockReturnValue({
    toRawAmount: vi.fn().mockReturnValue(0n),
  } as any);
  mockGetToken.mockReturnValue(undefined);
});

describe('useAvailableRewards', () => {
  it('filters out rewards below the minimum USD threshold', () => {
    mockUseQuery([makeMerklReward({ amountToClaim: 1 })]);
    mockGetToken.mockReturnValue({ priceUSD: '0.05' });

    const { result } = renderHook(() => useAvailableRewards({}));

    expect(result.current.rewards).toHaveLength(0);
  });

  it('filters out rewards with no token price', () => {
    mockUseQuery([makeMerklReward()]);
    mockGetToken.mockReturnValue(undefined);

    const { result } = renderHook(() => useAvailableRewards({}));

    expect(result.current.rewards).toHaveLength(0);
  });

  it('sorts combined Merkl and DeFi Reacher rewards by amountUSD descending', () => {
    const merklReward = makeMerklReward({ symbol: 'MKL', amountToClaim: 1 });
    const defiReward = makeDeFiReacherReward({
      symbol: 'DFI',
      amountToClaim: 1,
    });
    mockUseQuery([merklReward, defiReward]);
    mockGetToken.mockImplementation((_, address) =>
      address === merklReward.address ? { priceUSD: '1' } : { priceUSD: '10' },
    );

    const { result } = renderHook(() => useAvailableRewards({}));

    expect(result.current.rewards).toHaveLength(2);
    expect(result.current.rewards[0].reward.symbol).toBe('DFI');
    expect(result.current.rewards[1].reward.symbol).toBe('MKL');
  });

  it('returns only DeFi Reacher rewards when Merkl rewards are absent', () => {
    mockUseQuery([makeDeFiReacherReward({ symbol: 'DFI', amountToClaim: 1 })]);
    mockGetToken.mockReturnValue({ priceUSD: '1' });

    const { result } = renderHook(() => useAvailableRewards({}));

    expect(result.current.rewards).toHaveLength(1);
    expect(result.current.rewards[0].reward.symbol).toBe('DFI');
    expect(result.current.isSuccess).toBe(true);
  });

  it('returns only Merkl rewards when no DeFi Reacher rewards are present', () => {
    mockUseQuery([makeMerklReward({ symbol: 'MKL', amountToClaim: 1 })]);
    mockGetToken.mockReturnValue({ priceUSD: '1' });

    const { result } = renderHook(() => useAvailableRewards({}));

    expect(result.current.rewards).toHaveLength(1);
    expect(result.current.rewards[0].reward.symbol).toBe('MKL');
    expect(result.current.isSuccess).toBe(true);
  });

  it('computes balance.amountUSD as amountToClaim × priceUSD', () => {
    mockUseQuery([makeMerklReward({ amountToClaim: 3 })]);
    mockGetToken.mockReturnValue({ priceUSD: '4' });

    const { result } = renderHook(() => useAvailableRewards({}));

    expect(result.current.rewards[0].balance.amountUSD).toBe(12);
  });
});
