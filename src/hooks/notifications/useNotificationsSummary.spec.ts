// @vitest-environment jsdom

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  notificationsSummaryQueryKey,
  useNotificationsSummary,
} from './useNotificationsSummary';

const accountState: { account?: { address: string } } = {
  account: {
    address: '0x1111111111111111111111111111111111111111',
  },
};

vi.mock('@jumperexchange/wallet-management', () => ({
  useAccount: () => accountState,
}));

vi.mock('@/config/env-config', () => ({
  default: {
    NEXT_PUBLIC_NOTIFICATIONS_URL: 'https://notifications.test',
  },
}));

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: React.PropsWithChildren) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useNotificationsSummary', () => {
  beforeEach(() => {
    accountState.account = {
      address: '0x1111111111111111111111111111111111111111',
    };
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('has a 15s refetchInterval when enabled', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        count: 2,
        expiredCount: 1,
      }),
    } as Response);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderHook(() => useNotificationsSummary(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const summaryQuery = queryClient.getQueryCache().find({
      queryKey: notificationsSummaryQueryKey(
        '0x1111111111111111111111111111111111111111',
      ),
    });
    expect(
      (summaryQuery?.options as { refetchInterval?: unknown }).refetchInterval,
    ).toBe(15_000);
  });

  it('does not fetch when wallet address is missing', async () => {
    accountState.account = undefined;

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderHook(() => useNotificationsSummary(), {
      wrapper: createWrapper(queryClient),
    });

    await new Promise<void>((resolve) => setTimeout(resolve, 50));
    expect(fetch).not.toHaveBeenCalled();
  });

  it('does not fetch when wallet address is an invalid format', async () => {
    accountState.account = { address: 'not-a-hex-address' };

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderHook(() => useNotificationsSummary(), {
      wrapper: createWrapper(queryClient),
    });

    await new Promise<void>((resolve) => setTimeout(resolve, 50));
    expect(fetch).not.toHaveBeenCalled();
  });

  it('has placeholderData: keepPreviousData set so stale data is shown during refetch', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        count: 3,
        expiredCount: 0,
      }),
    } as Response);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const { result } = renderHook(() => useNotificationsSummary(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.data?.count).toBe(3));

    // Verify the option is configured — keepPreviousData is a function exported from RQ
    const summaryQuery = queryClient.getQueryCache().find({
      queryKey: notificationsSummaryQueryKey(
        '0x1111111111111111111111111111111111111111',
      ),
    });
    expect(
      typeof (summaryQuery?.options as { placeholderData?: unknown })
        .placeholderData,
    ).toBe('function');
  });
});
