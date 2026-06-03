import { isBefore, isValid, parseISO } from 'date-fns';
import type { Notification } from '@/types/notifications';

/**
 * Whether a notification has passed its expiry.
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
  // Expired once expiresAt is strictly in the past.
  return isBefore(expiresAt, now);
};
