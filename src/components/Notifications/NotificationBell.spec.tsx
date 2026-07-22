import React from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render } from '../../../vitest.setup';
import { NotificationBell } from './NotificationBell';
import { useNotificationStore } from '@/stores/notifications/NotificationStore';

const accountState: { account?: { address: string } } = {
  account: {
    address: '0x1111111111111111111111111111111111111111',
  },
};

const summaryState: {
  data?: { count: number; expiredCount: number };
  isLoading: boolean;
} = {
  data: { count: 0, expiredCount: 0 },
  isLoading: false,
};

vi.mock('@jumperexchange/wallet-management', () => ({
  useAccount: () => accountState,
}));

vi.mock('@mui/material/useMediaQuery', () => ({
  default: () => true,
}));

vi.mock('@/hooks/notifications/useNotificationsSummary', () => ({
  notificationsSummaryQueryKey: (address?: string) => [
    'notifications-summary',
    address,
  ],
  useNotificationsSummary: () => summaryState,
}));

vi.mock('@/components/Navbar/components/Buttons/Buttons.style', () => ({
  NavbarMenuToggleButton: React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<'button'>
  >((props, ref) => <button ref={ref} {...props} />),
}));

vi.mock('./Notifications.style', () => ({
  NotificationBadge: ({
    badgeContent,
    invisible,
    children,
  }: {
    badgeContent: number;
    invisible: boolean;
    children: React.ReactNode;
  }) => (
    <div
      data-testid="notification-badge"
      data-badge-content={badgeContent}
      data-invisible={String(invisible)}
    >
      {children}
    </div>
  ),
  BellIcon: () => <span data-testid="bell-icon" />,
}));

vi.mock('./NotificationPopover', () => ({
  NotificationPopover: () => <div data-testid="notification-popover" />,
}));

vi.mock('./NotificationDrawer', () => ({
  NotificationDrawer: () => <div data-testid="notification-drawer" />,
}));

// Prevent zustand's persist from writing to localStorage during tests
vi.mock('zustand/middleware', async () => {
  const actual =
    await vi.importActual<typeof import('zustand/middleware')>(
      'zustand/middleware',
    );
  return {
    ...actual,
    persist:
      (config: Parameters<typeof actual.persist>[0]) =>
      (...args: Parameters<ReturnType<typeof actual.persist>>) =>
        config(...args),
  };
});

describe('NotificationBell', () => {
  beforeEach(() => {
    accountState.account = {
      address: '0x1111111111111111111111111111111111111111',
    };
    summaryState.data = {
      count: 5,
      expiredCount: 0,
    };
    summaryState.isLoading = false;
    useNotificationStore.setState({
      readNotificationIdsByAccount: {
        '0x1111111111111111111111111111111111111111': ['read-1', 'read-2'],
      },
      deletedNotificationIdsByAccount: {
        '0x1111111111111111111111111111111111111111': ['deleted-1'],
      },
    });
  });

  it('renders hybrid badge count (summary count minus local read/deleted)', () => {
    render(<NotificationBell />);
    const badge = screen.getByTestId('notification-badge');
    // count=5, readIds=2, deletedIds=1 → 5-2-1=2
    expect(badge).toHaveAttribute('data-badge-content', '2');
    expect(badge).toHaveAttribute('data-invisible', 'false');
  });

  it('clamps badge to zero when local dismissed count exceeds server count', () => {
    summaryState.data = { count: 1, expiredCount: 0 };
    // 1 - 2 readIds - 1 deletedId = -2 → clamped to 0
    render(<NotificationBell />);
    const badge = screen.getByTestId('notification-badge');
    expect(badge).toHaveAttribute('data-badge-content', '0');
    expect(badge).toHaveAttribute('data-invisible', 'true');
  });

  it('hides badge while summary request is loading even with a visible count', () => {
    // beforeEach sets data to count=5 (badgeContent=2), which would normally
    // be visible. Loading must be the only reason the badge is hidden.
    summaryState.isLoading = true;

    render(<NotificationBell />);
    const badge = screen.getByTestId('notification-badge');
    expect(badge).toHaveAttribute('data-badge-content', '2');
    expect(badge).toHaveAttribute('data-invisible', 'true');
  });

  it('returns null when wallet is disconnected', () => {
    accountState.account = undefined;
    const { container } = render(<NotificationBell />);
    expect(container.firstChild).toBeNull();
  });
});
