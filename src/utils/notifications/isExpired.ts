import { isAfter, isValid, parseISO } from 'date-fns';
import type { Notification } from '@/types/notifications';

/**
 * Whether a notification has passed its expiry.
 *
 * The backend no longer filters expired rows server-side — it returns every
 * notification with an `expiresAt` and lets the client decide how to present
 * them (see JUM-1033/JUM-1034). This helper is the single place that encodes
 * that policy: today we hide expired notifications to match prior behaviour.
 * To show them later (greyed-out, behind a toggle, …) change this helper or
 * its call sites — nothing else needs to move.
 *
 * Notifications without an `expiresAt` (or with an unparseable one) never
 * expire and are always shown.
 */
export const isExpired = (
  notification: Pick<Notification, 'expiresAt'>,
  now: number = Date.now(),
): boolean => {
  if (!notification.expiresAt) {
    return false;
  }
  const expiresAt = parseISO(notification.expiresAt);
  if (!isValid(expiresAt)) {
    return false;
  }
  // Expired once expiresAt <= now (the exact boundary counts as expired).
  return !isAfter(expiresAt, now);
};
