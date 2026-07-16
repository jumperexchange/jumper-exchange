// @vitest-environment jsdom
import {
  GatekeeperStatus,
  useGatekeeperStatus,
} from '@/app/ui/gatekeeper/useGatekeeperStatus';
import { useABTest } from '@/hooks/useABTest';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAdvancedAccess } from './useAdvancedAccess';

vi.mock('@/hooks/useABTest', () => ({ useABTest: vi.fn() }));
vi.mock('@/app/ui/gatekeeper/useGatekeeperStatus', () => ({
  GatekeeperStatus: {
    REQUIRES_CONNECT: 'requires_wallet',
    LOADING_ACCESS: 'loading_access',
    SUCCESS: 'success',
    ERROR: 'error',
    NOT_ALLOWED: 'not_allowed',
  },
  useGatekeeperStatus: vi.fn(),
}));

const mockFlag = (value: string | boolean | undefined, isLoading = false) => {
  vi.mocked(useABTest).mockReturnValue({
    isEnabled: !!value,
    isLoading,
    value,
  });
};

const mockGatekeeper = (status: GatekeeperStatus) => {
  vi.mocked(useGatekeeperStatus).mockReturnValue({ status });
};

beforeEach(() => {
  mockGatekeeper(GatekeeperStatus.SUCCESS);
});

describe('useAdvancedAccess', () => {
  it('denies access for the control variant', () => {
    mockFlag('control');

    const { result } = renderHook(() => useAdvancedAccess());

    expect(result.current).toEqual({
      isLoading: false,
      isEnabled: false,
      isAllowed: false,
    });
  });

  it('allows access for the test variant regardless of gatekeeper status', () => {
    mockFlag('test');
    mockGatekeeper(GatekeeperStatus.NOT_ALLOWED);

    const { result } = renderHook(() => useAdvancedAccess());

    expect(result.current).toEqual({
      isLoading: false,
      isEnabled: true,
      isAllowed: true,
    });
  });

  it('allows access for wallet-access-control when the gatekeeper succeeds', () => {
    mockFlag('wallet-access-control');
    mockGatekeeper(GatekeeperStatus.SUCCESS);

    const { result } = renderHook(() => useAdvancedAccess());

    expect(result.current).toEqual({
      isLoading: false,
      isEnabled: true,
      isAllowed: true,
    });
  });

  it('denies access for wallet-access-control when the gatekeeper denies', () => {
    mockFlag('wallet-access-control');
    mockGatekeeper(GatekeeperStatus.NOT_ALLOWED);

    const { result } = renderHook(() => useAdvancedAccess());

    expect(result.current).toEqual({
      isLoading: false,
      isEnabled: true,
      isAllowed: false,
    });
  });

  it('is loading while the gatekeeper is still resolving wallet-access-control', () => {
    mockFlag('wallet-access-control');
    mockGatekeeper(GatekeeperStatus.LOADING_ACCESS);

    const { result } = renderHook(() => useAdvancedAccess());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAllowed).toBe(false);
  });

  it('fails closed while the flag is still loading', () => {
    mockFlag(undefined, true);

    const { result } = renderHook(() => useAdvancedAccess());

    expect(result.current).toEqual({
      isLoading: true,
      isEnabled: false,
      isAllowed: false,
    });
  });

  it('allows access when the flag is a plain boolean toggle', () => {
    mockFlag(true);
    mockGatekeeper(GatekeeperStatus.NOT_ALLOWED);

    const { result } = renderHook(() => useAdvancedAccess());

    expect(result.current).toEqual({
      isLoading: false,
      isEnabled: true,
      isAllowed: true,
    });
  });

  it('fails closed for an unrecognized variant', () => {
    mockFlag('some-future-variant');

    const { result } = renderHook(() => useAdvancedAccess());

    expect(result.current).toEqual({
      isLoading: false,
      isEnabled: false,
      isAllowed: false,
    });
  });
});
