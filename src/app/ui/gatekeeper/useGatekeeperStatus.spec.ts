// @vitest-environment jsdom
import { useConnectedAccountAddress } from '@/hooks/accounts/useConnectedAccountAddress';
import { useIsWalletResolving } from '@/hooks/accounts/useIsWalletResolving';
import { useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GatekeeperStatus, useGatekeeperStatus } from './useGatekeeperStatus';

vi.mock('@/hooks/accounts/useConnectedAccountAddress', () => ({
  useConnectedAccountAddress: vi.fn(),
}));
vi.mock('@/hooks/accounts/useIsWalletResolving', () => ({
  useIsWalletResolving: vi.fn(),
}));
vi.mock('@tanstack/react-query', () => ({ useQuery: vi.fn() }));
vi.mock('@/utils/isProduction', () => ({ isProduction: true }));

const EVM_ADDRESS = '0x1111111111111111111111111111111111111111';
const SOLANA_ADDRESS = 'So11111111111111111111111111111111111111112';

const mockAddress = (address: string | undefined) => {
  vi.mocked(useConnectedAccountAddress).mockReturnValue(address);
};

const mockResolving = (resolving: boolean) => {
  vi.mocked(useIsWalletResolving).mockReturnValue(resolving);
};

const mockFlagsQuery = ({
  data,
  isLoading = false,
  error = null,
}: {
  data?: Record<string, boolean>;
  isLoading?: boolean;
  error?: unknown;
}) => {
  vi.mocked(useQuery).mockReturnValue({
    data,
    isLoading,
    error,
  } as ReturnType<typeof useQuery>);
};

beforeEach(() => {
  mockAddress(undefined);
  mockResolving(false);
  mockFlagsQuery({});
});

describe('useGatekeeperStatus', () => {
  it('returns LOADING_ACCESS while the wallet is still resolving with no address', () => {
    mockResolving(true);

    const { result } = renderHook(() => useGatekeeperStatus('hasAdvanced'));

    expect(result.current.status).toBe(GatekeeperStatus.LOADING_ACCESS);
  });

  it('returns REQUIRES_CONNECT when settled disconnected', () => {
    mockResolving(false);

    const { result } = renderHook(() => useGatekeeperStatus('hasAdvanced'));

    expect(result.current.status).toBe(GatekeeperStatus.REQUIRES_CONNECT);
  });

  it('returns LOADING_ACCESS while wallet flags are fetching', () => {
    mockAddress(EVM_ADDRESS);
    mockFlagsQuery({ isLoading: true });

    const { result } = renderHook(() => useGatekeeperStatus('hasAdvanced'));

    expect(result.current.status).toBe(GatekeeperStatus.LOADING_ACCESS);
  });

  it('returns SUCCESS when an EVM wallet has the requested flag', () => {
    mockAddress(EVM_ADDRESS);
    mockFlagsQuery({ data: { hasAdvanced: true } });

    const { result } = renderHook(() => useGatekeeperStatus('hasAdvanced'));

    expect(result.current.status).toBe(GatekeeperStatus.SUCCESS);
  });

  it('returns SUCCESS when a non-EVM wallet has the requested flag', () => {
    mockAddress(SOLANA_ADDRESS);
    mockFlagsQuery({ data: { hasAdvanced: true } });

    const { result } = renderHook(() => useGatekeeperStatus('hasAdvanced'));

    expect(result.current.status).toBe(GatekeeperStatus.SUCCESS);
  });

  it('returns NOT_ALLOWED when the wallet lacks the requested flag', () => {
    mockAddress(EVM_ADDRESS);
    mockFlagsQuery({ data: { hasAdvanced: false } });

    const { result } = renderHook(() => useGatekeeperStatus('hasAdvanced'));

    expect(result.current.status).toBe(GatekeeperStatus.NOT_ALLOWED);
  });

  it('returns ERROR when the flags request fails', () => {
    mockAddress(EVM_ADDRESS);
    mockFlagsQuery({ error: new Error('network') });

    const { result } = renderHook(() => useGatekeeperStatus('hasAdvanced'));

    expect(result.current).toEqual({
      status: GatekeeperStatus.ERROR,
      error: expect.any(Error),
    });
  });
});
