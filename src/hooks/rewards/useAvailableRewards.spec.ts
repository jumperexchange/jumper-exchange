// @vitest-environment jsdom
import { useDeFiReacherRewards } from '@/hooks/rewards/useDeFiReacherRewards';
import { useMerklRewards } from '@/hooks/rewards/useMerklRewards';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import { useTokens } from '@/hooks/useTokens';
import type { DeFiReacherReward, MerklReward } from '@/types/rewards';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAvailableRewards } from './useAvailableRewards';

vi.mock('@/hooks/rewards/useMerklRewards', () => ({
  useMerklRewards: vi.fn(),
}));
vi.mock('@/hooks/rewards/useDeFiReacherRewards', () => ({
  useDeFiReacherRewards: vi.fn(),
}));
vi.mock('@/hooks/useTokens', () => ({ useTokens: vi.fn() }));
vi.mock('@/hooks/tokens/useTokenAmountInput', () => ({
  useTokenAmountInput: vi.fn(),
}));
vi.mock('@/types/tokens', () => ({ createWalletToken: vi.fn() }));
vi.mock('@/utils/rewards/rewardFilterAdapters', () => ({
  fromMerklRewardsData: vi.fn(),
}));

const makeMerklReward = (
  overrides: Partial<MerklReward> = {},
): MerklReward => ({
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

beforeEach(() => {
  vi.mocked(useMerklRewards).mockReturnValue({
    availableRewards: [],
    isSuccess: true,
    isLoading: false,
    pastCampaigns: [],
  });
  vi.mocked(useDeFiReacherRewards).mockReturnValue({
    data: [],
    isSuccess: true,
    isLoading: false,
  } as any);
  vi.mocked(useTokens).mockReturnValue({ getToken: mockGetToken } as any);
  vi.mocked(useTokenAmountInput).mockReturnValue({
    toRawAmount: vi.fn().mockReturnValue(0n),
  } as any);
  mockGetToken.mockReturnValue(undefined);
});

describe('useAvailableRewards', () => {
  it('filters out rewards below the minimum USD threshold', () => {
    vi.mocked(useMerklRewards).mockReturnValue({
      availableRewards: [makeMerklReward({ amountToClaim: 1 })],
      isSuccess: true,
      isLoading: false,
      pastCampaigns: [],
    });
    mockGetToken.mockReturnValue({ priceUSD: '0.05' });

    const { result } = renderHook(() => useAvailableRewards({}));

    expect(result.current.rewards).toHaveLength(0);
  });

  it('filters out rewards with no token price', () => {
    vi.mocked(useMerklRewards).mockReturnValue({
      availableRewards: [makeMerklReward()],
      isSuccess: true,
      isLoading: false,
      pastCampaigns: [],
    });
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
    vi.mocked(useMerklRewards).mockReturnValue({
      availableRewards: [merklReward],
      isSuccess: true,
      isLoading: false,
      pastCampaigns: [],
    });
    vi.mocked(useDeFiReacherRewards).mockReturnValue({
      data: [defiReward],
      isSuccess: true,
      isLoading: false,
    } as any);
    mockGetToken.mockImplementation((_, address) =>
      address === merklReward.address ? { priceUSD: '1' } : { priceUSD: '10' },
    );

    const { result } = renderHook(() => useAvailableRewards({}));

    expect(result.current.rewards).toHaveLength(2);
    expect(result.current.rewards[0].reward.symbol).toBe('DFI');
    expect(result.current.rewards[1].reward.symbol).toBe('MKL');
  });

  it('returns DeFi Reacher rewards when Merkl fails', () => {
    vi.mocked(useMerklRewards).mockReturnValue({
      availableRewards: [],
      isSuccess: false,
      isLoading: false,
      pastCampaigns: [],
    });
    vi.mocked(useDeFiReacherRewards).mockReturnValue({
      data: [makeDeFiReacherReward({ symbol: 'DFI', amountToClaim: 1 })],
      isSuccess: true,
      isLoading: false,
    } as any);
    mockGetToken.mockReturnValue({ priceUSD: '1' });

    const { result } = renderHook(() => useAvailableRewards({}));

    expect(result.current.rewards).toHaveLength(1);
    expect(result.current.rewards[0].reward.symbol).toBe('DFI');
    expect(result.current.isSuccess).toBe(true);
  });

  it('returns Merkl rewards when DeFi Reacher fails', () => {
    vi.mocked(useMerklRewards).mockReturnValue({
      availableRewards: [makeMerklReward({ symbol: 'MKL', amountToClaim: 1 })],
      isSuccess: true,
      isLoading: false,
      pastCampaigns: [],
    });
    vi.mocked(useDeFiReacherRewards).mockReturnValue({
      data: [],
      isSuccess: false,
      isLoading: false,
    } as any);
    mockGetToken.mockReturnValue({ priceUSD: '1' });

    const { result } = renderHook(() => useAvailableRewards({}));

    expect(result.current.rewards).toHaveLength(1);
    expect(result.current.rewards[0].reward.symbol).toBe('MKL');
    expect(result.current.isSuccess).toBe(true);
  });

  it('computes balance.amountUSD as amountToClaim × priceUSD', () => {
    vi.mocked(useMerklRewards).mockReturnValue({
      availableRewards: [makeMerklReward({ amountToClaim: 3 })],
      isSuccess: true,
      isLoading: false,
      pastCampaigns: [],
    });
    mockGetToken.mockReturnValue({ priceUSD: '4' });

    const { result } = renderHook(() => useAvailableRewards({}));

    expect(result.current.rewards[0].balance.amountUSD).toBe(12);
  });
});
