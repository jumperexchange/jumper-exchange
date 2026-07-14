// @vitest-environment jsdom

import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TrackingAction, TrackingCategory } from '@/const/trackingKeys';
import type { Notification } from '@/types/notifications';
import { NotificationCategory } from '@/types/notifications';
import { useNotificationTracking } from './useNotificationTracking';

const trackEvent = vi.fn();

const DEFAULT_ADDRESS = '0x1111111111111111111111111111111111111111';
const accountState = { address: DEFAULT_ADDRESS };

vi.mock('@/hooks/userTracking/useUserTracking', () => ({
  useUserTracking: () => ({ trackEvent, trackTransaction: vi.fn() }),
}));

vi.mock('@jumperexchange/wallet-management', () => ({
  useAccount: () => ({ account: { address: accountState.address } }),
}));

let idCounter = 0;
const makeNotification = (
  overrides: Partial<Notification> = {},
): Notification => {
  idCounter += 1;
  return {
    id: `notif-${idCounter}`,
    title: 'Title',
    body: 'Body',
    category: NotificationCategory.Earn,
    ctaLabel: 'Open',
    ctaUrl: '/earn',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    expiresAt: null,
    isGlobal: false,
    metadata: {},
    priority: 0,
    sourceRuleId: 'rule-123',
    status: 'pending',
    userAddress: '0x1111111111111111111111111111111111111111',
    ...overrides,
  };
};

describe('useNotificationTracking', () => {
  beforeEach(() => {
    trackEvent.mockClear();
    accountState.address = DEFAULT_ADDRESS;
  });

  it('emits a clicked event with the consistent property schema', () => {
    const notification = makeNotification();
    const { result } = renderHook(() => useNotificationTracking());

    result.current.trackClicked(notification);

    expect(trackEvent).toHaveBeenCalledTimes(1);
    expect(trackEvent).toHaveBeenCalledWith({
      category: TrackingCategory.Notifications,
      action: TrackingAction.NotificationClicked,
      label: 'notification-clicked',
      data: {
        param_notification_id: notification.id,
        param_notification_source_rule_id: 'rule-123',
        param_notification_category: NotificationCategory.Earn,
        param_notification_cta_target: '/earn',
      },
    });
  });

  it('emits clicked events every time (a CTA can be clicked more than once)', () => {
    const notification = makeNotification();
    const { result } = renderHook(() => useNotificationTracking());

    result.current.trackClicked(notification);
    result.current.trackClicked(notification);

    expect(trackEvent).toHaveBeenCalledTimes(2);
    expect(trackEvent.mock.calls[0][0].action).toBe(
      TrackingAction.NotificationClicked,
    );
  });

  it('de-duplicates dismissed per notification (can only happen once)', () => {
    const notification = makeNotification();
    const { result } = renderHook(() => useNotificationTracking());

    result.current.trackDismissed(notification);
    result.current.trackDismissed(notification);

    expect(trackEvent).toHaveBeenCalledTimes(1);
    expect(trackEvent.mock.calls[0][0].action).toBe(
      TrackingAction.NotificationDismissed,
    );
  });

  it('de-duplicates impression events (received) per notification', () => {
    const notification = makeNotification();
    const { result } = renderHook(() => useNotificationTracking());

    result.current.trackReceived(notification);
    result.current.trackReceived(notification);

    expect(trackEvent).toHaveBeenCalledTimes(1);
    expect(trackEvent.mock.calls[0][0].action).toBe(
      TrackingAction.NotificationReceived,
    );
  });

  it('de-duplicates impression events (seen) per notification', () => {
    const notification = makeNotification();
    const { result } = renderHook(() => useNotificationTracking());

    result.current.trackSeen(notification);
    result.current.trackSeen(notification);

    expect(trackEvent).toHaveBeenCalledTimes(1);
    expect(trackEvent.mock.calls[0][0].action).toBe(
      TrackingAction.NotificationSeen,
    );
  });

  it('scopes impression de-duplication per wallet address', () => {
    const notification = makeNotification();
    const { result, rerender } = renderHook(() => useNotificationTracking());

    result.current.trackSeen(notification);

    // Same notification, different connected wallet -> distinct dedupe key.
    accountState.address = '0x2222222222222222222222222222222222222222';
    rerender();
    result.current.trackSeen(notification);

    expect(trackEvent).toHaveBeenCalledTimes(2);
  });
});
