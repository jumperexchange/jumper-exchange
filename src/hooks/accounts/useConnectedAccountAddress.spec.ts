// @vitest-environment jsdom
import { ChainType } from '@lifi/sdk';
import { useAccount } from '@jumperexchange/wallet-management';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useConnectedAccountAddress } from './useConnectedAccountAddress';

vi.mock('@jumperexchange/wallet-management', () => ({
  useAccount: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(useAccount).mockReturnValue({
    account: {
      chainType: ChainType.EVM,
      isConnected: false,
      isConnecting: false,
      isReconnecting: false,
      isDisconnected: true,
      status: 'disconnected',
    },
    accounts: [],
  });
});

describe('useConnectedAccountAddress', () => {
  it('returns the selected account address when present', () => {
    vi.mocked(useAccount).mockReturnValue({
      account: {
        address: 'So11111111111111111111111111111111111111112',
        chainType: ChainType.SVM,
        isConnected: true,
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: false,
        status: 'connected',
      },
      accounts: [],
    });

    const { result } = renderHook(() => useConnectedAccountAddress());

    expect(result.current).toBe('So11111111111111111111111111111111111111112');
  });

  it('falls back to the first connected account address', () => {
    vi.mocked(useAccount).mockReturnValue({
      account: {
        chainType: ChainType.EVM,
        isConnected: false,
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: true,
        status: 'disconnected',
      },
      accounts: [
        {
          address: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
          chainType: ChainType.MVM,
          isConnected: true,
          isConnecting: false,
          isReconnecting: false,
          isDisconnected: false,
          status: 'connected',
        },
      ],
    });

    const { result } = renderHook(() => useConnectedAccountAddress());

    expect(result.current).toBe('TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf');
  });

  it('returns undefined when no wallet is connected', () => {
    const { result } = renderHook(() => useConnectedAccountAddress());

    expect(result.current).toBeUndefined();
  });
});
