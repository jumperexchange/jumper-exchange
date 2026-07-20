// @vitest-environment jsdom
import { ChainType } from '@lifi/sdk';
import type { Account } from '@jumperexchange/widget-provider';
import {
  useBitcoinContext,
  useSolanaContext,
  useSuiContext,
  useTronContext,
} from '@jumperexchange/widget-provider';
import { useChains } from '@/hooks/useChains';
import { useHydrated } from '@/hooks/useHydrated';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useConnection } from 'wagmi';
import {
  WAGMI_RECENT_CONNECTOR_STORAGE_KEY,
  hasRecentWagmiConnector,
  useIsWalletResolving,
} from './useIsWalletResolving';

vi.mock('@/hooks/useHydrated', () => ({ useHydrated: vi.fn() }));
vi.mock('@/hooks/useChains', () => ({ useChains: vi.fn() }));
vi.mock('wagmi', () => ({ useConnection: vi.fn() }));
vi.mock('@jumperexchange/widget-provider', () => ({
  useSolanaContext: vi.fn(),
  useBitcoinContext: vi.fn(),
  useSuiContext: vi.fn(),
  useTronContext: vi.fn(),
}));

const disconnectedAccount = (chainType: ChainType): Account => ({
  chainType,
  isConnected: false,
  isConnecting: false,
  isReconnecting: false,
  isDisconnected: true,
  status: 'disconnected',
});

const mockHydrated = (hydrated: boolean) => {
  vi.mocked(useHydrated).mockReturnValue(hydrated);
};

const mockChains = (isSuccess: boolean) => {
  vi.mocked(useChains).mockReturnValue({
    chains: [],
    isSuccess,
    isLoading: !isSuccess,
    getChainById: vi.fn(),
  });
};

const mockConnection = ({
  address,
  status,
}: {
  address?: `0x${string}`;
  status: 'connected' | 'reconnecting' | 'connecting' | 'disconnected';
}) => {
  vi.mocked(useConnection).mockReturnValue({
    address,
    status,
  } as ReturnType<typeof useConnection>);
};

const mockNonEvmAccounts = ({
  solana = disconnectedAccount(ChainType.SVM),
  bitcoin = disconnectedAccount(ChainType.UTXO),
  sui = disconnectedAccount(ChainType.MVM),
  tron = disconnectedAccount(ChainType.TVM),
}: {
  solana?: Account;
  bitcoin?: Account;
  sui?: Account;
  tron?: Account;
} = {}) => {
  vi.mocked(useSolanaContext).mockReturnValue({
    account: solana,
  } as ReturnType<typeof useSolanaContext>);
  vi.mocked(useBitcoinContext).mockReturnValue({
    account: bitcoin,
  } as ReturnType<typeof useBitcoinContext>);
  vi.mocked(useSuiContext).mockReturnValue({
    account: sui,
  } as ReturnType<typeof useSuiContext>);
  vi.mocked(useTronContext).mockReturnValue({
    account: tron,
  } as ReturnType<typeof useTronContext>);
};

beforeEach(() => {
  window.localStorage.clear();
  mockHydrated(true);
  mockChains(true);
  mockConnection({ status: 'disconnected' });
  mockNonEvmAccounts();
});

describe('hasRecentWagmiConnector', () => {
  it('returns false when storage is empty', () => {
    expect(hasRecentWagmiConnector()).toBe(false);
  });

  it('returns true when a recent connector id is stored', () => {
    window.localStorage.setItem(
      WAGMI_RECENT_CONNECTOR_STORAGE_KEY,
      '"metaMask"',
    );

    expect(hasRecentWagmiConnector()).toBe(true);
  });
});

describe('useIsWalletResolving', () => {
  it('is resolving before hydration', () => {
    mockHydrated(false);

    const { result } = renderHook(() => useIsWalletResolving());

    expect(result.current).toBe(true);
  });

  it('is resolving while chains have not synced', () => {
    mockChains(false);

    const { result } = renderHook(() => useIsWalletResolving());

    expect(result.current).toBe(true);
  });

  it('is resolving while the wallet is reconnecting', () => {
    mockConnection({ status: 'reconnecting' });

    const { result } = renderHook(() => useIsWalletResolving());

    expect(result.current).toBe(true);
  });

  it('is resolving while the wallet is connecting', () => {
    mockConnection({ status: 'connecting' });

    const { result } = renderHook(() => useIsWalletResolving());

    expect(result.current).toBe(true);
  });

  it('is resolving briefly when chains are ready and a recent connector exists', () => {
    window.localStorage.setItem(
      WAGMI_RECENT_CONNECTOR_STORAGE_KEY,
      '"metaMask"',
    );

    const { result } = renderHook(() => useIsWalletResolving());

    expect(result.current).toBe(true);
  });

  it('settles as not resolving after the reconnect grace period with a recent connector', async () => {
    vi.useFakeTimers();
    window.localStorage.setItem(
      WAGMI_RECENT_CONNECTOR_STORAGE_KEY,
      '"metaMask"',
    );

    const { result } = renderHook(() => useIsWalletResolving());

    expect(result.current).toBe(true);

    await act(async () => {
      vi.runAllTimers();
    });

    expect(result.current).toBe(false);
    vi.useRealTimers();
  });

  it('is not resolving when settled disconnected without a recent connector', () => {
    const { result } = renderHook(() => useIsWalletResolving());

    expect(result.current).toBe(false);
  });

  it('is not resolving when an address is already available', () => {
    window.localStorage.setItem(
      WAGMI_RECENT_CONNECTOR_STORAGE_KEY,
      '"metaMask"',
    );
    mockConnection({
      address: '0x1111111111111111111111111111111111111111',
      status: 'connected',
    });

    const { result } = renderHook(() => useIsWalletResolving());

    expect(result.current).toBe(false);
  });

  it('is resolving while a non-EVM wallet is connecting', () => {
    mockNonEvmAccounts({
      solana: {
        ...disconnectedAccount(ChainType.SVM),
        status: 'connecting',
        isConnecting: true,
        isDisconnected: false,
      },
    });

    const { result } = renderHook(() => useIsWalletResolving());

    expect(result.current).toBe(true);
  });

  it('is not resolving when a non-EVM address is already available', () => {
    mockChains(false);
    mockNonEvmAccounts({
      solana: {
        address: 'So11111111111111111111111111111111111111112',
        chainType: ChainType.SVM,
        isConnected: true,
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: false,
        status: 'connected',
      },
    });

    const { result } = renderHook(() => useIsWalletResolving());

    expect(result.current).toBe(false);
  });
});
