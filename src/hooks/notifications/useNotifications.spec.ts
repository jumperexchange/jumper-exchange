// @vitest-environment jsdom

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { notificationsQueryKey, useNotifications } from './useNotifications';

const accountState: { account?: { address: string } } = {
  account: {
    address: '0x1111111111111111111111111111111111111111',
  },
};

vi.mock('@lifi/wallet-management', () => ({
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
    accountState.account = {
      address: '0x1111111111111111111111111111111111111111',
    };
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
      queryKey: notificationsQueryKey(
        '0x1111111111111111111111111111111111111111',
      ),
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
});
