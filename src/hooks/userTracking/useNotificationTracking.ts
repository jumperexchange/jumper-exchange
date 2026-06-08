'use client';

import { useAccount } from '@lifi/wallet-management';
import { useCallback } from 'react';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import type { Notification } from '@/types/notifications';
import type { JumperEventData } from '@/utils/tracking/jumperTracking';

/**
 * Tracks the notification engagement funnel into PostHog (via the Jumper
 * tracking pipeline): received → seen → clicked → dismissed (JUM-238).
 *
 * PostHog is the analytics/funnel store only — it is NOT the source of truth
 * for read/unread state. The unread badge / summary count is driven separately
 * (see `NotificationStore` and, eventually, a backend `status` column).
 *
 * `received`, `seen` and `dismissed` are "at most once per notification"
 * events: a notification is received/seen at most once (re-renders, refetches
 * and panel re-opens must not re-fire them) and can only be dismissed once.
 * They are de-duplicated through a session-scoped set keyed by
 * `action:address:notificationId`, cleared on a full page reload (acceptable
 * for analytics). `clicked` is emitted every time, since a user can legitimately
 * click a notification's CTA more than once (it is not removed on click).
 */
const firedOnce = new Set<string>();

const buildEventData = (notification: Notification): JumperEventData => ({
  [TrackingEventParameter.NotificationId]: notification.id,
  [TrackingEventParameter.NotificationSourceRuleId]: notification.sourceRuleId,
  [TrackingEventParameter.NotificationCategory]: notification.category,
  [TrackingEventParameter.NotificationCtaTarget]: notification.ctaUrl ?? '',
});

export const useNotificationTracking = () => {
  const { trackEvent } = useUserTracking();
  const { account } = useAccount();
  const address = account?.address ?? 'not_connected';

  const emit = useCallback(
    (action: TrackingAction, label: string, notification: Notification) => {
      void trackEvent({
        category: TrackingCategory.Notifications,
        action,
        label,
        data: buildEventData(notification),
      });
    },
    [trackEvent],
  );

  const emitOnce = useCallback(
    (action: TrackingAction, label: string, notification: Notification) => {
      const key = `${action}:${address}:${notification.id}`;
      if (firedOnce.has(key)) {
        return;
      }
      firedOnce.add(key);
      emit(action, label, notification);
    },
    [address, emit],
  );

  const trackReceived = useCallback(
    (notification: Notification) =>
      emitOnce(
        TrackingAction.NotificationReceived,
        'notification-received',
        notification,
      ),
    [emitOnce],
  );

  const trackSeen = useCallback(
    (notification: Notification) =>
      emitOnce(
        TrackingAction.NotificationSeen,
        'notification-seen',
        notification,
      ),
    [emitOnce],
  );

  const trackClicked = useCallback(
    (notification: Notification) =>
      emit(
        TrackingAction.NotificationClicked,
        'notification-clicked',
        notification,
      ),
    [emit],
  );

  const trackDismissed = useCallback(
    (notification: Notification) =>
      emitOnce(
        TrackingAction.NotificationDismissed,
        'notification-dismissed',
        notification,
      ),
    [emitOnce],
  );

  return { trackReceived, trackSeen, trackClicked, trackDismissed };
};
