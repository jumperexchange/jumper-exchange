// @vitest-environment jsdom

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationCategory } from '@/types/notifications';
import { notificationsQueryKey, useNotifications } from './useNotifications';

const ADDRESS = '0x1111111111111111111111111111111111111111';

const accountState: { account?: { address: string } } = {
  account: { address: ADDRESS },
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

describe('useNotifications', () => {
  beforeEach(() => {
    accountState.account = { address: ADDRESS };
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('has no refetchInterval (list is not polled automatically)', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderHook(() => useNotifications(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const query = queryClient.getQueryCache().find({
      queryKey: notificationsQueryKey(ADDRESS),
    });
    expect(
      (query?.options as { refetchInterval?: unknown }).refetchInterval,
    ).toBeUndefined();
  });

  it('does not fetch when enabled=false', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderHook(() => useNotifications({ enabled: false }), {
      wrapper: createWrapper(queryClient),
    });

    await new Promise<void>((resolve) => setTimeout(resolve, 50));
    expect(fetch).not.toHaveBeenCalled();
  });

  it('fetches without query string when no filters are provided', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderHook(() => useNotifications(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toBe(
      `https://notifications.test/api/notifications/${ADDRESS}`,
    );
  });

  it('appends category and createdAfter to the URL when provided', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const createdAfter = '2026-01-01T00:00:00.000Z';

    renderHook(
      () =>
        useNotifications({
          category: NotificationCategory.Campaign,
          createdAfter,
        }),
      { wrapper: createWrapper(queryClient) },
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    const url = new URL(calledUrl);
    expect(url.searchParams.get('category')).toBe('campaign');
    expect(url.searchParams.get('createdAfter')).toBe(createdAfter);
  });

  it('uses separate cache entries for different filter combinations', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const createdAfter = '2026-01-01T00:00:00.000Z';

    renderHook(() => useNotifications(), {
      wrapper: createWrapper(queryClient),
    });
    renderHook(
      () =>
        useNotifications({
          category: NotificationCategory.Campaign,
          createdAfter,
        }),
      { wrapper: createWrapper(queryClient) },
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    const noFilterKey = notificationsQueryKey(ADDRESS, {});
    const withFilterKey = notificationsQueryKey(ADDRESS, {
      category: NotificationCategory.Campaign,
      createdAfter,
    });
    expect(
      queryClient.getQueryCache().find({ queryKey: noFilterKey }),
    ).toBeDefined();
    expect(
      queryClient.getQueryCache().find({ queryKey: withFilterKey }),
    ).toBeDefined();
  });
});
