import React from 'react';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '../../../vitest.setup';
import { NotificationItem } from './NotificationItem';
import type { Notification } from '@/types/notifications';
import { NotificationCategory } from '@/types/notifications';
import { useNotificationStore } from '@/stores/notifications/NotificationStore';
import type * as ZustandMiddleware from 'zustand/middleware';

const accountState: { account?: { address: string } } = {
  account: {
    address: '0x1111111111111111111111111111111111111111',
  },
};

vi.mock('@jumperexchange/wallet-management', () => ({
  useAccount: () => accountState,
}));

vi.mock('motion/react', () => ({
  useInView: () => false,
}));

const contentState: { ctaLabel?: string | null } = { ctaLabel: 'Open' };

vi.mock('@/hooks/notifications/useNotificationContent', () => ({
  useNotificationContent: (notification: Notification) => ({
    title: notification.title,
    body: notification.body,
    ctaLabel: contentState.ctaLabel,
  }),
}));

vi.mock('@/hooks/userTracking/useNotificationTracking', () => ({
  useNotificationTracking: () => ({
    trackSeen: vi.fn(),
    trackClicked: vi.fn(),
    trackDismissed: vi.fn(),
  }),
}));

// Prevent zustand's persist from writing to localStorage during tests
vi.mock('zustand/middleware', async () => {
  const actual =
    await vi.importActual<typeof ZustandMiddleware>('zustand/middleware');
  return {
    ...actual,
    persist:
      (config: Parameters<typeof actual.persist>[0]) =>
      (...args: Parameters<ReturnType<typeof actual.persist>>) =>
        config(...args),
  };
});

const makeNotification = (
  overrides: Partial<Notification> = {},
): Notification => ({
  id: '1',
  title: 'STORED TITLE',
  body: 'STORED BODY',
  category: NotificationCategory.Earn,
  ctaLabel: 'STORED CTA',
  ctaUrl: '/earn',
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
  expiresAt: null,
  isGlobal: false,
  metadata: {},
  priority: 5,
  sourceRuleId: '',
  status: 'pending',
  userAddress: '0xabc',
  ...overrides,
});

describe('NotificationItem', () => {
  beforeEach(() => {
    accountState.account = {
      address: '0x1111111111111111111111111111111111111111',
    };
    contentState.ctaLabel = 'Open';
    useNotificationStore.setState({
      readNotificationIdsByAccount: {},
      deletedNotificationIdsByAccount: {},
    });
  });

  it('renders without a CTA link when ctaUrl is null (JUM-1144 regression)', () => {
    const notification = makeNotification({ ctaUrl: null, ctaLabel: null });
    contentState.ctaLabel = null;

    expect(() =>
      render(
        <NotificationItem notification={notification} onCtaClick={vi.fn()} />,
      ),
    ).not.toThrow();

    expect(screen.getByText('STORED TITLE')).toBeInTheDocument();
    expect(screen.queryByText('Open')).not.toBeInTheDocument();
  });

  it('renders an internal CTA link for a relative ctaUrl', () => {
    render(
      <NotificationItem
        notification={makeNotification({ ctaUrl: '/earn' })}
        onCtaClick={vi.fn()}
      />,
    );

    const link = screen.getByRole('link', { name: /open/i });
    expect(link).toHaveAttribute('href', '/earn');
    expect(link).not.toHaveAttribute('target', '_blank');
  });

  it('renders an external CTA link for an absolute ctaUrl', () => {
    render(
      <NotificationItem
        notification={makeNotification({ ctaUrl: 'https://example.com' })}
        onCtaClick={vi.fn()}
      />,
    );

    const link = screen.getByRole('link', { name: /open/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
